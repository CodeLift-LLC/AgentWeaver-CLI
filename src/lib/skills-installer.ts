import path from 'path';
import Handlebars from 'handlebars';
import {
  copyDirectory,
  ensureDirectory,
  listDirectories,
  readFile,
  pathExists,
  writeFile,
} from '../utils/file-operations.js';
import { parseSkillFile, SkillFrontmatter } from '../utils/yaml-parser.js';
import { TemplateResolver } from './template-resolver.js';
import { ResolutionContext, TemplatePackMatch } from './template-pack.js';

/**
 * Skills installer for copying and validating skill directories
 */

export interface SkillInfo {
  name: string;
  dirName: string;
  frontmatter: SkillFrontmatter;
  hasTemplates: boolean;
  validated: boolean;
}

export interface SkillInstallOptions {
  targetDirectory: string;
  skillsToInstall?: string[]; // If not provided, install all
  overwrite?: boolean;
  techStackContext?: ResolutionContext; // Tech stack for template resolution
  projectRoot?: string; // Project root for relative path resolution
}

export interface SkillInstallResult {
  installed: SkillInfo[];
  skipped: string[];
  errors: Array<{ skill: string; error: string }>;
  templatePacksUsed?: Array<{ skill: string; templatePack: string; score: number }>;
}

export class SkillsInstaller {
  private sourceDirectory: string;

  constructor(sourceDirectory: string) {
    this.sourceDirectory = sourceDirectory;
  }

  /**
   * Lists all available skills in the source directory
   */
  async listAvailableSkills(): Promise<SkillInfo[]> {
    const dirs = await listDirectories(this.sourceDirectory);
    const skills: SkillInfo[] = [];

    for (const dirName of dirs) {
      try {
        const skillPath = path.join(this.sourceDirectory, dirName);
        const skillMdPath = path.join(skillPath, 'SKILL.md');

        // Check if SKILL.md exists
        if (!(await pathExists(skillMdPath))) {
          console.warn(`Warning: ${dirName} missing SKILL.md, skipping`);
          continue;
        }

        // Parse and validate SKILL.md
        const content = await readFile(skillMdPath);
        const parsed = parseSkillFile(content, skillMdPath);

        // Check for templates directory
        const templatesPath = path.join(skillPath, 'templates');
        const hasTemplates = await pathExists(templatesPath);

        skills.push({
          name: parsed.frontmatter.name,
          dirName,
          frontmatter: parsed.frontmatter,
          hasTemplates,
          validated: true,
        });
      } catch (error) {
        console.warn(`Warning: Invalid skill ${dirName}:`, (error as Error).message);
      }
    }

    return skills;
  }

  /**
   * Validates a skill directory before installation
   */
  async validateSkill(dirName: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const skillPath = path.join(this.sourceDirectory, dirName);
      const skillMdPath = path.join(skillPath, 'SKILL.md');

      // Check if directory exists
      if (!(await pathExists(skillPath))) {
        return { valid: false, error: 'Skill directory does not exist' };
      }

      // Check if SKILL.md exists
      if (!(await pathExists(skillMdPath))) {
        return { valid: false, error: 'SKILL.md file not found' };
      }

      // Validate SKILL.md content
      const content = await readFile(skillMdPath);
      parseSkillFile(content, skillMdPath);

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Installs skills to the target directory with template pack resolution
   */
  async installSkills(options: SkillInstallOptions): Promise<SkillInstallResult> {
    const result: SkillInstallResult = {
      installed: [],
      skipped: [],
      errors: [],
      templatePacksUsed: [],
    };

    // Get list of skills to install
    const availableSkills = await this.listAvailableSkills();
    let skillsToInstall = availableSkills;

    if (options.skillsToInstall && options.skillsToInstall.length > 0) {
      skillsToInstall = availableSkills.filter(
        (skill) =>
          options.skillsToInstall!.includes(skill.name) ||
          options.skillsToInstall!.includes(skill.dirName)
      );
    }

    // Ensure target directory exists
    await ensureDirectory(options.targetDirectory);

    // Create template resolver if tech stack context provided
    const templateResolver = options.techStackContext
      ? new TemplateResolver(this.sourceDirectory)
      : null;

    // Install each skill
    for (const skill of skillsToInstall) {
      const targetPath = path.join(options.targetDirectory, skill.dirName);

      // Check if skill already exists
      if (!options.overwrite && (await pathExists(targetPath))) {
        result.skipped.push(skill.name);
        continue;
      }

      try {
        const sourcePath = path.join(this.sourceDirectory, skill.dirName);

        // Check if skill has templates and we have tech stack context
        if (skill.hasTemplates && templateResolver && options.techStackContext) {
          // Use template pack resolution
          const installResult = await this.installSkillWithTemplates(
            skill,
            sourcePath,
            targetPath,
            templateResolver,
            options.techStackContext,
            options.projectRoot
          );

          if (installResult.templatePack) {
            result.templatePacksUsed!.push({
              skill: skill.name,
              templatePack: installResult.templatePack.pack.manifest.name,
              score: installResult.templatePack.score,
            });
          }
        } else {
          // Legacy: Copy entire skill directory
          await copyDirectory(sourcePath, targetPath);
        }

        result.installed.push(skill);
      } catch (error) {
        result.errors.push({
          skill: skill.name,
          error: (error as Error).message,
        });
      }
    }

    return result;
  }

  /**
   * Install a skill using template pack resolution
   */
  private async installSkillWithTemplates(
    skill: SkillInfo,
    sourcePath: string,
    targetPath: string,
    resolver: TemplateResolver,
    context: ResolutionContext,
    projectRoot?: string
  ): Promise<{ templatePack: TemplatePackMatch | null }> {
    // Ensure target directory exists
    await ensureDirectory(targetPath);

    // Copy SKILL.md file
    const skillMdSource = path.join(sourcePath, 'SKILL.md');
    const skillMdTarget = path.join(targetPath, 'SKILL.md');
    const skillMdContent = await readFile(skillMdSource);
    await writeFile(skillMdTarget, skillMdContent);

    // Resolve best template pack
    const templateMatch = await resolver.resolveTemplatePack(skill.dirName, context);

    if (templateMatch) {
      // Install files from the selected template pack
      const projectRootPath = projectRoot || process.cwd();

      // Prepare template variables context
      const templateContext = this.buildTemplateContext(templateMatch.pack.manifest.variables);

      for (const file of templateMatch.pack.manifest.files) {
        const sourceFilePath = path.join(templateMatch.pack.packPath, file.source);

        // Resolve target path using Handlebars
        const targetFilePathTemplate = Handlebars.compile(file.target);
        const targetFilePath = targetFilePathTemplate(templateContext);

        const absoluteTargetPath = path.join(projectRootPath, targetFilePath);

        // Check strategy
        if (file.strategy === 'skip-if-exists' && (await pathExists(absoluteTargetPath))) {
          console.log(`  Skipping ${targetFilePath} (already exists)`);
          continue;
        }

        // Ensure target directory exists
        await ensureDirectory(path.dirname(absoluteTargetPath));

        // Read file content
        let fileContent = await readFile(sourceFilePath);

        // Apply Handlebars template interpolation if specified
        if (file.templateEngine === 'handlebars') {
          const template = Handlebars.compile(fileContent);
          fileContent = template(templateContext);
        }

        // Write processed file
        await writeFile(absoluteTargetPath, fileContent);
        console.log(`  ✓ Installed ${targetFilePath}`);
      }

      // Create a templates-used.json file for reference
      const templatesUsedPath = path.join(targetPath, 'templates-used.json');
      await writeFile(
        templatesUsedPath,
        JSON.stringify(
          {
            templatePack: templateMatch.pack.manifest.name,
            version: templateMatch.pack.manifest.version,
            score: templateMatch.score,
            reasons: templateMatch.reasons,
            installedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
    } else {
      // No suitable template pack found, log warning
      console.warn(
        `  Warning: No suitable template pack found for ${skill.name} with current tech stack`
      );
    }

    return { templatePack: templateMatch };
  }

  /**
   * Build template context from variable definitions
   * Extracts default values from variable definitions for Handlebars
   */
  private buildTemplateContext(variables?: Record<string, any>): Record<string, any> {
    if (!variables) {
      return {};
    }

    const context: Record<string, any> = {};

    for (const [varName, varDef] of Object.entries(variables)) {
      // Use default value if provided
      context[varName] = varDef.default || '';
    }

    return context;
  }

  /**
   * Gets information about a specific skill
   */
  async getSkillInfo(skillName: string): Promise<SkillInfo | null> {
    const skills = await this.listAvailableSkills();
    return (
      skills.find((skill) => skill.name === skillName || skill.dirName === skillName) || null
    );
  }

  /**
   * Filters skills by tag
   */
  async getSkillsByTag(tag: string): Promise<SkillInfo[]> {
    const allSkills = await this.listAvailableSkills();
    return allSkills.filter((skill) => skill.frontmatter.tags?.includes(tag));
  }

  /**
   * Gets all unique tags from all skills
   */
  async getAllTags(): Promise<string[]> {
    const allSkills = await this.listAvailableSkills();
    const tagsSet = new Set<string>();

    for (const skill of allSkills) {
      if (skill.frontmatter.tags) {
        skill.frontmatter.tags.forEach((tag) => tagsSet.add(tag));
      }
    }

    return Array.from(tagsSet).sort();
  }
}
