import path from 'path';
import { pathExists, readJsonFile } from '../utils/file-operations.js';
import { readdir } from 'fs/promises';
import semver from 'semver';
import {
  TemplatePackManifest,
  LoadedTemplatePack,
  TemplatePackMatch,
  ResolutionContext,
  MatchReason,
  SCORING_WEIGHTS,
  MIN_MATCH_SCORE,
} from './template-pack.js';

/**
 * Resolves the best template pack for a given skill and tech stack
 */
export class TemplateResolver {
  private skillsDirectory: string;

  constructor(skillsDirectory: string) {
    this.skillsDirectory = skillsDirectory;
  }

  /**
   * Find and score all template packs for a skill
   */
  async findTemplatePacks(skillName: string): Promise<LoadedTemplatePack[]> {
    const skillPath = path.join(this.skillsDirectory, skillName);
    const templatesPath = path.join(skillPath, 'templates');

    // Check if templates directory exists
    if (!(await pathExists(templatesPath))) {
      return [];
    }

    const templatePacks: LoadedTemplatePack[] = [];

    try {
      const packDirs = await readdir(templatesPath, { withFileTypes: true });

      for (const packDir of packDirs) {
        if (!packDir.isDirectory()) continue;

        const packPath = path.join(templatesPath, packDir.name);
        const manifestPath = path.join(packPath, 'manifest.json');

        // Load manifest
        if (await pathExists(manifestPath)) {
          try {
            const manifest = await readJsonFile<TemplatePackManifest>(manifestPath);
            templatePacks.push({
              manifest,
              packPath,
              skillName,
            });
          } catch (error) {
            console.error(`Error loading manifest for ${packDir.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading templates directory for ${skillName}:`, error);
    }

    return templatePacks;
  }

  /**
   * Resolve the best template pack for a skill given the tech stack
   */
  async resolveTemplatePack(
    skillName: string,
    context: ResolutionContext
  ): Promise<TemplatePackMatch | null> {
    const availablePacks = await this.findTemplatePacks(skillName);

    if (availablePacks.length === 0) {
      return null;
    }

    // Score each pack
    const matches = availablePacks
      .map((pack) => this.scoreTemplatePack(pack, context))
      .filter((match) => match.score >= MIN_MATCH_SCORE)
      .sort((a, b) => b.score - a.score);

    // Return best match or null
    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Resolve multiple template packs at once (for batch operations)
   */
  async resolveMultiple(
    skillNames: string[],
    context: ResolutionContext
  ): Promise<Map<string, TemplatePackMatch | null>> {
    const results = new Map<string, TemplatePackMatch | null>();

    await Promise.all(
      skillNames.map(async (skillName) => {
        const match = await this.resolveTemplatePack(skillName, context);
        results.set(skillName, match);
      })
    );

    return results;
  }

  /**
   * Score a template pack against the resolution context
   */
  private scoreTemplatePack(
    pack: LoadedTemplatePack,
    context: ResolutionContext
  ): TemplatePackMatch {
    const reasons: MatchReason[] = [];
    let totalScore = 0;

    const { manifest } = pack;
    const { techStack, preferences } = context;

    // 1. Language match (40%)
    const languageScore = this.scoreLanguageMatch(
      manifest.applicability.language,
      techStack.language
    );
    reasons.push({
      factor: 'language',
      score: languageScore,
      description: `Language: ${manifest.applicability.language} vs ${techStack.language}`,
    });
    totalScore += languageScore * SCORING_WEIGHTS.EXACT_LANGUAGE_MATCH;

    // 2. Framework match (30%)
    const frameworkScore = this.scoreFrameworkMatch(
      manifest.applicability.framework,
      techStack.framework
    );
    reasons.push({
      factor: 'framework',
      score: frameworkScore,
      description: `Framework: ${manifest.applicability.framework} vs ${techStack.framework}`,
    });
    totalScore += frameworkScore * SCORING_WEIGHTS.EXACT_FRAMEWORK_MATCH;

    // 3. Version compatibility (15%)
    const versionScore = this.scoreVersionCompatibility(
      manifest.applicability.minVersion,
      manifest.applicability.maxVersion,
      techStack.version
    );
    reasons.push({
      factor: 'version',
      score: versionScore,
      description: `Version compatibility: ${techStack.version}`,
    });
    totalScore += versionScore * SCORING_WEIGHTS.VERSION_COMPATIBILITY;

    // 4. User preferences (10%)
    const preferenceScore = this.scoreUserPreferences(pack, preferences);
    reasons.push({
      factor: 'preferences',
      score: preferenceScore,
      description: 'User preferences alignment',
    });
    totalScore += preferenceScore * SCORING_WEIGHTS.USER_PREFERENCE;

    // 5. Dependency match (5%)
    const dependencyScore = this.scoreDependencyMatch(
      manifest.applicability.dependencies?.required,
      techStack.dependencies
    );
    reasons.push({
      factor: 'dependencies',
      score: dependencyScore,
      description: 'Required dependencies present',
    });
    totalScore += dependencyScore * SCORING_WEIGHTS.DEPENDENCY_MATCH;

    return {
      pack,
      score: Math.min(totalScore, 1.0), // Cap at 1.0
      reasons,
    };
  }

  /**
   * Score language match
   */
  private scoreLanguageMatch(packLanguage: string, detectedLanguage: string): number {
    if (!detectedLanguage) return 0;

    // Exact match
    if (packLanguage.toLowerCase() === detectedLanguage.toLowerCase()) {
      return 1.0;
    }

    // Close match (e.g., "typescript" vs "javascript")
    if (
      (packLanguage === 'typescript' && detectedLanguage === 'javascript') ||
      (packLanguage === 'javascript' && detectedLanguage === 'typescript')
    ) {
      return 0.7;
    }

    return 0;
  }

  /**
   * Score framework match
   */
  private scoreFrameworkMatch(
    packFramework: string | string[] | undefined,
    detectedFramework: string | undefined
  ): number {
    if (!packFramework || !detectedFramework) {
      return 0.5; // Neutral score if no framework specified
    }

    const frameworks = Array.isArray(packFramework) ? packFramework : [packFramework];

    // Exact match
    if (frameworks.some((fw) => fw.toLowerCase() === detectedFramework.toLowerCase())) {
      return 1.0;
    }

    // Partial match (e.g., "express" matches "express-typescript")
    if (
      frameworks.some(
        (fw) =>
          fw.toLowerCase().includes(detectedFramework.toLowerCase()) ||
          detectedFramework.toLowerCase().includes(fw.toLowerCase())
      )
    ) {
      return 0.6;
    }

    return 0;
  }

  /**
   * Score version compatibility
   */
  private scoreVersionCompatibility(
    minVersion: string | undefined,
    maxVersion: string | undefined,
    detectedVersion: string | undefined
  ): number {
    // If no version constraints, it's compatible
    if (!minVersion && !maxVersion) {
      return 1.0;
    }

    // If version not detected, neutral score
    if (!detectedVersion) {
      return 0.5;
    }

    try {
      // Clean version string (remove non-semver parts)
      const cleanVersion = semver.coerce(detectedVersion);
      if (!cleanVersion) return 0.5;

      // Check min version
      if (minVersion) {
        const cleanMin = semver.coerce(minVersion);
        if (cleanMin && semver.lt(cleanVersion, cleanMin)) {
          return 0; // Below minimum
        }
      }

      // Check max version
      if (maxVersion) {
        const cleanMax = semver.coerce(maxVersion);
        if (cleanMax && semver.gt(cleanVersion, cleanMax)) {
          return 0.3; // Above maximum (might still work)
        }
      }

      return 1.0; // Compatible
    } catch {
      return 0.5; // Error parsing versions, neutral score
    }
  }

  /**
   * Score user preferences
   */
  private scoreUserPreferences(
    pack: LoadedTemplatePack,
    preferences: ResolutionContext['preferences']
  ): number {
    if (!preferences) return 0.5;

    let score = 0;
    let factors = 0;

    // Preferred language
    if (preferences.preferredLanguage) {
      factors++;
      if (pack.manifest.applicability.language === preferences.preferredLanguage) {
        score += 1.0;
      }
    }

    // Preferred framework
    if (preferences.preferredFramework) {
      factors++;
      const frameworks = Array.isArray(pack.manifest.applicability.framework)
        ? pack.manifest.applicability.framework
        : [pack.manifest.applicability.framework];

      if (frameworks.includes(preferences.preferredFramework)) {
        score += 1.0;
      }
    }

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Score dependency match
   */
  private scoreDependencyMatch(
    requiredDeps: string[] | undefined,
    detectedDeps: string[] | undefined
  ): number {
    if (!requiredDeps || requiredDeps.length === 0) {
      return 1.0; // No requirements, fully compatible
    }

    if (!detectedDeps || detectedDeps.length === 0) {
      return 0.3; // Can't verify, low score
    }

    // Count how many required dependencies are present
    const matchCount = requiredDeps.filter((reqDep) =>
      detectedDeps.some((dep) => dep.includes(reqDep) || reqDep.includes(dep))
    ).length;

    return matchCount / requiredDeps.length;
  }

  /**
   * Get all available template packs for a skill (for listing/debugging)
   */
  async listAvailableTemplatePacks(skillName: string): Promise<LoadedTemplatePack[]> {
    return await this.findTemplatePacks(skillName);
  }

  /**
   * Validate a template pack manifest
   */
  static validateManifest(manifest: TemplatePackManifest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!manifest.name) errors.push('Missing required field: name');
    if (!manifest.version) errors.push('Missing required field: version');
    if (!manifest.description) errors.push('Missing required field: description');
    if (!manifest.applicability) errors.push('Missing required field: applicability');
    if (!manifest.applicability?.language) errors.push('Missing required field: applicability.language');
    if (!manifest.files || manifest.files.length === 0) {
      errors.push('Missing or empty required field: files');
    }

    // Validate files
    manifest.files?.forEach((file, index) => {
      if (!file.source) errors.push(`File ${index}: missing source`);
      if (!file.target) errors.push(`File ${index}: missing target`);
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
