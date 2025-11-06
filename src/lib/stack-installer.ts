/**
 * Stack Template Installer
 *
 * Handles installation of pre-configured tech stack templates
 */

import path from 'path';
import { existsSync } from 'fs';
import { readFile, writeFile, mkdir, copyFile, readdir } from 'fs/promises';
import yaml from 'js-yaml';
import Handlebars from 'handlebars';
import type {
  StackTemplate,
  StackContext,
  InstallResult,
  ValidationResult,
  TemplateFeatures,
  DockerService,
  TemplateFile,
} from './stack-template.js';
import { getTemplatesDirectory } from '../utils/file-operations.js';

export class StackInstaller {
  private templatesDir: string;

  constructor() {
    this.templatesDir = path.join(getTemplatesDirectory(), 'stacks');
  }

  /**
   * List all available stack templates
   */
  async listTemplates(): Promise<StackTemplate[]> {
    if (!existsSync(this.templatesDir)) {
      return [];
    }

    const entries = await readdir(this.templatesDir, { withFileTypes: true });
    const templateDirs = entries
      .filter((entry) => entry.isDirectory())
      .filter((entry) => !entry.name.startsWith('_')) // Ignore _shared
      .map((entry) => entry.name);

    const templates: StackTemplate[] = [];

    for (const dirName of templateDirs) {
      try {
        const template = await this.loadTemplate(dirName);
        templates.push(template);
      } catch (error) {
        console.warn(`Failed to load template "${dirName}":`, (error as Error).message);
      }
    }

    return templates;
  }

  /**
   * Load a specific template by ID
   */
  async loadTemplate(templateId: string): Promise<StackTemplate> {
    const templateDir = path.join(this.templatesDir, templateId);
    const manifestPath = path.join(templateDir, 'manifest.yml');

    if (!existsSync(manifestPath)) {
      throw new Error(`Template manifest not found: ${manifestPath}`);
    }

    const manifestContent = await readFile(manifestPath, 'utf-8');
    const template = yaml.load(manifestContent) as StackTemplate;

    // Validate required fields
    if (!template.id || !template.name || !template.techStack) {
      throw new Error(`Invalid template manifest: ${templateId}`);
    }

    return template;
  }

  /**
   * Install a template to the target directory
   */
  async installTemplate(
    templateId: string,
    targetDir: string,
    context: StackContext
  ): Promise<InstallResult> {
    const result: InstallResult = {
      success: false,
      template: {} as StackTemplate,
      filesCreated: [],
      servicesConfigured: [],
      errors: [],
      warnings: [],
      nextSteps: [],
    };

    try {
      // Load template
      const template = await this.loadTemplate(templateId);
      result.template = template;

      // Validate prerequisites
      const validation = await this.validatePrerequisites(template);
      if (!validation.valid) {
        result.errors.push(...validation.errors);
        return result;
      }
      result.warnings.push(...validation.warnings);

      // Filter files and services based on selected features
      const filteredFiles = this.filterFilesByFeatures(template.files, context.selectedFeatures);
      const filteredServices = this.filterServicesByFeatures(
        template.dockerServices,
        context.selectedFeatures
      );

      // Copy template files
      await this.copyTemplateFiles(templateId, targetDir, filteredFiles, context);
      result.filesCreated = filteredFiles.map((f) => f.destination);

      // Configure Docker services
      result.servicesConfigured = filteredServices.map((s) => s.name);

      // Generate next steps
      result.nextSteps = this.generateNextSteps(template, context);

      result.success = true;
    } catch (error) {
      result.errors.push((error as Error).message);
    }

    return result;
  }

  /**
   * Validate system prerequisites for a template
   */
  async validatePrerequisites(template: StackTemplate): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      missingRequirements: [],
    };

    // Check Docker
    if (template.requirements.docker) {
      const hasDocker = await this.checkCommand('docker --version');
      if (!hasDocker) {
        result.errors.push('Docker is required but not installed');
        result.missingRequirements.push('docker');
        result.valid = false;
      }
    }

    // Check pnpm
    if (template.requirements.pnpm) {
      const hasPnpm = await this.checkCommand('pnpm --version');
      if (!hasPnpm) {
        result.warnings.push('pnpm is recommended. Install with: npm install -g pnpm');
      }
    }

    // Check uv (Python)
    if (template.requirements.uv) {
      const hasUv = await this.checkCommand('uv --version');
      if (!hasUv) {
        result.warnings.push(
          'uv is recommended for Python. Install from: https://github.com/astral-sh/uv'
        );
      }
    }

    return result;
  }

  /**
   * Prompt user for feature customization
   */
  async promptCustomization(template: StackTemplate): Promise<Partial<TemplateFeatures>> {
    // This will be implemented with inquirer in the CLI command
    // Return default features for now
    return template.features;
  }

  /**
   * Filter files based on selected features
   */
  private filterFilesByFeatures(
    files: TemplateFile[],
    selectedFeatures: Partial<TemplateFeatures>
  ): TemplateFile[] {
    return files.filter((file) => {
      // Always include required files
      if (file.required) return true;

      // If file has no feature requirements, include it
      if (!file.features || file.features.length === 0) return true;

      // Check if any of the file's required features are selected
      return file.features.some((feature) => {
        const featureKey = feature as keyof TemplateFeatures;
        return selectedFeatures[featureKey] === true;
      });
    });
  }

  /**
   * Filter Docker services based on selected features
   */
  private filterServicesByFeatures(
    services: DockerService[],
    selectedFeatures: Partial<TemplateFeatures>
  ): DockerService[] {
    return services.filter((service) => {
      if (service.required) return true;
      if (!service.features || service.features.length === 0) return true;

      return service.features.some((feature) => {
        const featureKey = feature as keyof TemplateFeatures;
        return selectedFeatures[featureKey] === true;
      });
    });
  }

  /**
   * Copy template files to target directory
   */
  private async copyTemplateFiles(
    templateId: string,
    targetDir: string,
    files: TemplateFile[],
    context: StackContext
  ): Promise<void> {
    const templateDir = path.join(this.templatesDir, templateId);

    for (const file of files) {
      const sourcePath = path.join(templateDir, file.source);
      const destPath = path.join(targetDir, file.destination);

      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      if (!existsSync(destDir)) {
        await mkdir(destDir, { recursive: true });
      }

      if (file.type === 'template') {
        // Process file with Handlebars
        const templateContent = await readFile(sourcePath, 'utf-8');
        const compiled = Handlebars.compile(templateContent);
        const processed = compiled({
          ...context,
          projectName: context.projectName,
          features: context.selectedFeatures,
        });
        await writeFile(destPath, processed);
      } else {
        // Direct copy
        await copyFile(sourcePath, destPath);
      }
    }
  }

  /**
   * Generate post-installation next steps
   */
  private generateNextSteps(template: StackTemplate, context: StackContext): string[] {
    const steps: string[] = [];

    // Package manager setup
    if (template.techStack.packageManager?.node === 'pnpm') {
      steps.push('Install dependencies: pnpm install');
    }
    if (template.techStack.packageManager?.python === 'uv') {
      steps.push('Install Python dependencies: uv sync');
    }

    // Database setup
    if (template.techStack.database) {
      steps.push('Start services: docker compose up -d');
      steps.push('Run migrations: pnpm db:migrate (or your migration command)');
    }

    // Environment variables
    steps.push('Copy .env.example to .env and fill in your values');

    // AI features
    if (context.selectedFeatures.aiIntegration) {
      steps.push('Add your OPENAI_API_KEY to .env');
    }

    // Testing
    if (template.techStack.testing) {
      steps.push('Run tests: pnpm test');
    }

    // Development server
    steps.push('Start development server: pnpm dev');

    return steps;
  }

  /**
   * Check if a command is available
   */
  private async checkCommand(command: string): Promise<boolean> {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      await execAsync(command);
      return true;
    } catch {
      return false;
    }
  }
}
