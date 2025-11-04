import path from 'path';
import { pathExists, readFile, listDirectories } from '../utils/file-operations.js';
import { TemplatePackManifest } from './template-pack.js';

/**
 * Validation result for a template pack
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  packName: string;
  packPath: string;
}

export interface ValidationError {
  type: 'error';
  field: string;
  message: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface ValidationWarning {
  type: 'warning';
  field: string;
  message: string;
}

/**
 * Validates template packs for correctness and completeness
 */
export class TemplatePackValidator {
  /**
   * Validate a single template pack
   */
  async validateTemplatePack(packPath: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if manifest.json exists
    const manifestPath = path.join(packPath, 'manifest.json');
    if (!(await pathExists(manifestPath))) {
      return {
        valid: false,
        errors: [
          {
            type: 'error',
            field: 'manifest.json',
            message: 'manifest.json file is missing',
            severity: 'critical',
          },
        ],
        warnings: [],
        packName: path.basename(packPath),
        packPath,
      };
    }

    // Parse manifest
    let manifest: TemplatePackManifest;
    try {
      const manifestContent = await readFile(manifestPath);
      manifest = JSON.parse(manifestContent);
    } catch (error) {
      return {
        valid: false,
        errors: [
          {
            type: 'error',
            field: 'manifest.json',
            message: `Failed to parse manifest.json: ${(error as Error).message}`,
            severity: 'critical',
          },
        ],
        warnings: [],
        packName: path.basename(packPath),
        packPath,
      };
    }

    // Validate manifest schema
    this.validateManifestSchema(manifest, errors, warnings);

    // Validate referenced files exist
    await this.validateFiles(packPath, manifest, errors, warnings);

    // Validate applicability rules
    this.validateApplicability(manifest, errors, warnings);

    // Validate variables
    this.validateVariables(manifest, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      packName: manifest.name || path.basename(packPath),
      packPath,
    };
  }

  /**
   * Validate all template packs in a skill directory
   */
  async validateAllTemplatePacks(skillPath: string): Promise<ValidationResult[]> {
    const templatesPath = path.join(skillPath, 'templates');

    if (!(await pathExists(templatesPath))) {
      return [];
    }

    const packDirs = await listDirectories(templatesPath);
    const results: ValidationResult[] = [];

    for (const packDir of packDirs) {
      const packPath = path.join(templatesPath, packDir);
      const result = await this.validateTemplatePack(packPath);
      results.push(result);
    }

    return results;
  }

  /**
   * Validate manifest schema completeness
   */
  private validateManifestSchema(
    manifest: TemplatePackManifest,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Required fields
    if (!manifest.name) {
      errors.push({
        type: 'error',
        field: 'name',
        message: 'Template pack name is required',
        severity: 'high',
      });
    }

    if (!manifest.version) {
      errors.push({
        type: 'error',
        field: 'version',
        message: 'Template pack version is required',
        severity: 'high',
      });
    }

    if (!manifest.description) {
      warnings.push({
        type: 'warning',
        field: 'description',
        message: 'Description is recommended for better discoverability',
      });
    }

    if (!manifest.applicability) {
      errors.push({
        type: 'error',
        field: 'applicability',
        message: 'Applicability rules are required',
        severity: 'critical',
      });
    }

    if (!manifest.files || manifest.files.length === 0) {
      errors.push({
        type: 'error',
        field: 'files',
        message: 'At least one file must be specified',
        severity: 'critical',
      });
    }

    // Validate version format (semver)
    if (manifest.version && !this.isValidSemver(manifest.version)) {
      warnings.push({
        type: 'warning',
        field: 'version',
        message: 'Version should follow semantic versioning (e.g., 1.0.0)',
      });
    }

    // Check for tags
    if (!manifest.tags || manifest.tags.length === 0) {
      warnings.push({
        type: 'warning',
        field: 'tags',
        message: 'Tags help with template pack discovery',
      });
    }

    // Check for references
    if (!manifest.references || manifest.references.length === 0) {
      warnings.push({
        type: 'warning',
        field: 'references',
        message: 'Documentation references help users understand the template',
      });
    }
  }

  /**
   * Validate that all referenced files exist
   */
  private async validateFiles(
    packPath: string,
    manifest: TemplatePackManifest,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    if (!manifest.files) return;

    for (const file of manifest.files) {
      const filePath = path.join(packPath, file.source);

      if (!(await pathExists(filePath))) {
        errors.push({
          type: 'error',
          field: `files[${file.source}]`,
          message: `Source file '${file.source}' does not exist`,
          severity: 'critical',
        });
      }

      // Validate file configuration
      if (!file.target) {
        errors.push({
          type: 'error',
          field: `files[${file.source}].target`,
          message: 'Target path is required for each file',
          severity: 'high',
        });
      }

      if (!file.description) {
        warnings.push({
          type: 'warning',
          field: `files[${file.source}].description`,
          message: 'File description helps users understand the purpose',
        });
      }

      if (!['skip-if-exists', 'overwrite', 'merge'].includes(file.strategy || '')) {
        warnings.push({
          type: 'warning',
          field: `files[${file.source}].strategy`,
          message: "Strategy should be 'skip-if-exists', 'overwrite', or 'merge'",
        });
      }

      // Check if target uses variables
      if (file.target.includes('{{') && file.target.includes('}}')) {
        const varsUsed = this.extractVariablesFromTemplate(file.target);
        const definedVars = Object.keys(manifest.variables || {});

        for (const varName of varsUsed) {
          if (!definedVars.includes(varName)) {
            errors.push({
              type: 'error',
              field: `files[${file.source}].target`,
              message: `Variable '${varName}' used in target but not defined in variables`,
              severity: 'high',
            });
          }
        }
      }
    }
  }

  /**
   * Validate applicability rules
   */
  private validateApplicability(
    manifest: TemplatePackManifest,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!manifest.applicability) return;

    const { language, framework, minVersion } = manifest.applicability;

    if (!language) {
      errors.push({
        type: 'error',
        field: 'applicability.language',
        message: 'Language is required in applicability rules',
        severity: 'high',
      });
    }

    if (!framework || (Array.isArray(framework) && framework.length === 0)) {
      warnings.push({
        type: 'warning',
        field: 'applicability.framework',
        message: 'Framework specification helps with accurate matching',
      });
    }

    if (minVersion && !this.isValidSemver(minVersion)) {
      warnings.push({
        type: 'warning',
        field: 'applicability.minVersion',
        message: 'minVersion should follow semantic versioning',
      });
    }
  }

  /**
   * Validate variable definitions
   */
  private validateVariables(
    manifest: TemplatePackManifest,
    _errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!manifest.variables) return;

    for (const [varName, varDef] of Object.entries(manifest.variables)) {
      if (!varDef.description) {
        warnings.push({
          type: 'warning',
          field: `variables.${varName}.description`,
          message: 'Variable description helps users understand usage',
        });
      }

      if (varDef.required && !varDef.default) {
        warnings.push({
          type: 'warning',
          field: `variables.${varName}.default`,
          message: 'Required variables should have a default value',
        });
      }

      if (!['string', 'number', 'boolean', 'path'].includes(varDef.type || '')) {
        warnings.push({
          type: 'warning',
          field: `variables.${varName}.type`,
          message: "Variable type should be 'string', 'number', 'boolean', or 'path'",
        });
      }
    }
  }

  /**
   * Extract variable names from a Handlebars template string
   */
  private extractVariablesFromTemplate(template: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(template)) !== null) {
      variables.push(match[1].trim());
    }

    return variables;
  }

  /**
   * Check if a version string follows semantic versioning
   */
  private isValidSemver(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    return semverRegex.test(version);
  }
}
