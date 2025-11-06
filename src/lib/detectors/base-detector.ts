import path from 'path';
import { readFile, readJsonFile, pathExists } from '../../utils/file-operations.js';
import { readdir } from 'fs/promises';

/**
 * Common tech information structure returned by all detectors
 */
export interface TechInfo {
  language: string;
  framework?: string;
  version?: string;
  buildTool?: string;
  packageManager?: string;
  dependencies?: string[];
  orm?: string;
  database?: string;
  confidence: number; // 0.0 to 1.0 - how confident we are in this detection
}

/**
 * Detection result with metadata
 */
export interface DetectionResult {
  detector: string;
  techInfo: TechInfo | null;
  detectionMethod: 'manifest' | 'structure' | 'imports' | 'heuristic';
  timestamp: Date;
}

/**
 * Abstract base class for all language/framework detectors
 *
 * Each detector is responsible for detecting a specific language or ecosystem
 * and can use multiple detection strategies (manifest files, directory structure, etc.)
 */
export abstract class BaseDetector {
  protected projectRoot: string;

  /**
   * The primary language this detector handles (e.g., 'java', 'python', 'csharp')
   */
  abstract readonly language: string;

  /**
   * Exact manifest filenames to check (e.g., ['package.json', 'go.mod'])
   */
  abstract readonly manifestFiles: string[];

  /**
   * File patterns with wildcards (e.g., ['*.csproj', '*.gradle', '*.gradle.kts'])
   * Use this for files with variable names like ProjectName.csproj
   */
  readonly manifestPatterns: string[] = [];

  /**
   * Human-readable name for this detector
   */
  abstract readonly name: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Main detection method - orchestrates multiple detection strategies
   * Subclasses can override this for custom detection logic
   */
  async detect(): Promise<DetectionResult> {
    const startTime = new Date();

    // Try manifest-based detection first (highest confidence)
    let techInfo = await this.detectFromManifests();
    let method: DetectionResult['detectionMethod'] = 'manifest';

    // If manifest detection fails, try structure-based detection
    if (!techInfo) {
      techInfo = await this.detectFromStructure();
      method = 'structure';
    }

    // If structure detection fails, try import analysis
    if (!techInfo) {
      techInfo = await this.detectFromImports();
      method = 'imports';
    }

    // Last resort: heuristics
    if (!techInfo) {
      techInfo = await this.applyHeuristics();
      method = 'heuristic';
    }

    return {
      detector: this.name,
      techInfo,
      detectionMethod: method,
      timestamp: startTime,
    };
  }

  /**
   * Detect tech stack from manifest files (highest confidence)
   * Subclasses MUST implement this
   */
  protected abstract detectFromManifests(): Promise<TechInfo | null>;

  /**
   * Detect tech stack from directory/file structure patterns (medium confidence)
   * Subclasses can override for language-specific patterns
   */
  protected async detectFromStructure(): Promise<TechInfo | null> {
    return null; // Default: no structure detection
  }

  /**
   * Detect tech stack from import statements (lower confidence, expensive)
   * Subclasses can override for language-specific import analysis
   */
  protected async detectFromImports(): Promise<TechInfo | null> {
    return null; // Default: no import analysis
  }

  /**
   * Apply heuristics when other methods fail (lowest confidence)
   * Subclasses can override for language-specific heuristics
   */
  protected async applyHeuristics(): Promise<TechInfo | null> {
    return null; // Default: no heuristics
  }

  /**
   * Check if a manifest file exists in the project
   */
  protected async hasManifestFile(filename: string): Promise<boolean> {
    const manifestPath = path.join(this.projectRoot, filename);
    return await pathExists(manifestPath);
  }

  /**
   * Read a manifest file from the project
   */
  protected async readManifest(filename: string): Promise<string | null> {
    try {
      const manifestPath = path.join(this.projectRoot, filename);
      if (!(await pathExists(manifestPath))) return null;
      return await readFile(manifestPath);
    } catch {
      return null;
    }
  }

  /**
   * Read a JSON manifest file from the project
   */
  protected async readJsonManifest<T = any>(filename: string): Promise<T | null> {
    try {
      const manifestPath = path.join(this.projectRoot, filename);
      if (!(await pathExists(manifestPath))) return null;
      return await readJsonFile<T>(manifestPath);
    } catch {
      return null;
    }
  }

  /**
   * Check if a directory exists in the project
   */
  protected async hasDirectory(dirPath: string): Promise<boolean> {
    const fullPath = path.join(this.projectRoot, dirPath);
    return await pathExists(fullPath);
  }

  /**
   * Extract dependencies from a list of strings
   * Useful for matching framework patterns
   */
  protected matchFramework(
    dependencies: string[],
    patterns: Array<{ pattern: string | RegExp; framework: string; version?: string }>
  ): { framework?: string; version?: string } {
    for (const { pattern, framework, version } of patterns) {
      const matchFound = dependencies.some((dep) =>
        typeof pattern === 'string' ? dep.includes(pattern) : pattern.test(dep)
      );

      if (matchFound) {
        return { framework, version };
      }
    }

    return {};
  }

  /**
   * Calculate confidence score based on number of indicators found
   */
  protected calculateConfidence(indicators: {
    hasManifest: boolean;
    hasStructure: boolean;
    hasDependencies: boolean;
    frameworkDetected: boolean;
  }): number {
    let score = 0;

    if (indicators.hasManifest) score += 0.4;
    if (indicators.hasStructure) score += 0.2;
    if (indicators.hasDependencies) score += 0.2;
    if (indicators.frameworkDetected) score += 0.2;

    return Math.min(score, 1.0);
  }

  /**
   * Utility: Check if project likely uses this language
   * Can be used as a quick pre-check before expensive detection
   */
  async isLikelyCandidate(): Promise<boolean> {
    // Check exact manifest filenames
    for (const manifestFile of this.manifestFiles) {
      if (await this.hasManifestFile(manifestFile)) {
        return true;
      }
    }

    // Check manifest patterns (*.csproj, *.gradle, etc.)
    for (const pattern of this.manifestPatterns) {
      if (await this.hasFileMatchingPattern(pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if any file matches the given pattern (e.g., *.csproj)
   */
  protected async hasFileMatchingPattern(pattern: string): Promise<boolean> {
    try {
      const files = await readdir(this.projectRoot);

      // Convert glob pattern to regex
      // *.csproj -> ^.*\.csproj$
      // *.gradle.kts -> ^.*\.gradle\.kts$
      const regexPattern = pattern
        .replace(/\./g, '\\.') // Escape dots
        .replace(/\*/g, '.*'); // Convert * to .*

      const regex = new RegExp(`^${regexPattern}$`);

      return files.some((file) => regex.test(file));
    } catch {
      return false;
    }
  }

  /**
   * Find all files matching a pattern (e.g., *.csproj)
   */
  protected async findFilesMatchingPattern(pattern: string): Promise<string[]> {
    try {
      const files = await readdir(this.projectRoot);

      const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');

      const regex = new RegExp(`^${regexPattern}$`);

      return files.filter((file) => regex.test(file));
    } catch {
      return [];
    }
  }
}
