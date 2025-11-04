import path from 'path';
import {
  copyDirectory,
  ensureDirectory,
  listDirectories,
  readFile,
  pathExists,
} from '../utils/file-operations.js';
import { parseSkillFile, SkillFrontmatter } from '../utils/yaml-parser.js';

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
}

export interface SkillInstallResult {
  installed: SkillInfo[];
  skipped: string[];
  errors: Array<{ skill: string; error: string }>;
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
   * Installs skills to the target directory
   */
  async installSkills(options: SkillInstallOptions): Promise<SkillInstallResult> {
    const result: SkillInstallResult = {
      installed: [],
      skipped: [],
      errors: [],
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
        await copyDirectory(sourcePath, targetPath);
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
