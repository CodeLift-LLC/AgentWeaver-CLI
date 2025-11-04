import { parse as parseToml } from '@iarna/toml';
import { BaseDetector, TechInfo } from './base-detector.js';

/**
 * Detector for Rust projects
 * Supports: Cargo.toml, Cargo.lock
 * Frameworks: Actix-web, Rocket, Axum, Warp, Tide, Tower
 */
export class RustDetector extends BaseDetector {
  readonly language = 'rust';
  readonly name = 'RustDetector';
  readonly manifestFiles = ['Cargo.toml', 'Cargo.lock'];

  protected async detectFromManifests(): Promise<TechInfo | null> {
    const cargoTomlContent = await this.readManifest('Cargo.toml');
    if (!cargoTomlContent) return null;

    try {
      const cargoToml = parseToml(cargoTomlContent) as any;
      const { edition } = this.extractPackageInfo(cargoToml);
      const dependencies = this.extractDependencies(cargoToml);
      const { framework, database, orm } = this.detectFrameworkAndTools(dependencies);

      const techInfo: TechInfo = {
        language: 'rust',
        framework,
        version: edition || '2021',
        buildTool: 'cargo',
        packageManager: 'cargo',
        dependencies,
        orm,
        database,
        confidence: this.calculateConfidence({
          hasManifest: true,
          hasStructure: await this.hasDirectory('src'),
          hasDependencies: dependencies.length > 0,
          frameworkDetected: !!framework,
        }),
      };

      return techInfo;
    } catch (error) {
      console.error('Error parsing Cargo.toml:', error);
      return null;
    }
  }

  protected async detectFromStructure(): Promise<TechInfo | null> {
    // Check for typical Rust project structure
    const hasSrc = await this.hasDirectory('src');
    const hasMainRs = await this.hasManifestFile('src/main.rs');
    const hasLibRs = await this.hasManifestFile('src/lib.rs');

    if (hasSrc || hasMainRs || hasLibRs) {
      return {
        language: 'rust',
        buildTool: 'cargo',
        confidence: 0.6,
      };
    }

    return null;
  }

  /**
   * Extract package information from Cargo.toml
   */
  private extractPackageInfo(cargoToml: any): {
    edition: string;
  } {
    const pkg = cargoToml.package || {};

    return {
      edition: pkg.edition || '2021',
    };
  }

  /**
   * Extract dependencies from Cargo.toml
   */
  private extractDependencies(cargoToml: any): string[] {
    const dependencies: string[] = [];

    // Regular dependencies
    if (cargoToml.dependencies) {
      dependencies.push(...Object.keys(cargoToml.dependencies));
    }

    // Dev dependencies
    if (cargoToml['dev-dependencies']) {
      dependencies.push(...Object.keys(cargoToml['dev-dependencies']));
    }

    // Build dependencies
    if (cargoToml['build-dependencies']) {
      dependencies.push(...Object.keys(cargoToml['build-dependencies']));
    }

    return dependencies;
  }

  /**
   * Detect framework and tools from dependencies
   */
  private detectFrameworkAndTools(dependencies: string[]): {
    framework?: string;
    database?: string;
    orm?: string;
  } {
    let framework: string | undefined;
    let database: string | undefined;
    let orm: string | undefined;

    // Framework detection
    const frameworkPatterns = [
      { pattern: 'actix-web', framework: 'actix-web' },
      { pattern: 'rocket', framework: 'rocket' },
      { pattern: 'axum', framework: 'axum' },
      { pattern: 'warp', framework: 'warp' },
      { pattern: 'tide', framework: 'tide' },
      { pattern: 'tower', framework: 'tower' },
      { pattern: 'hyper', framework: 'hyper' },
      { pattern: 'poem', framework: 'poem' },
      { pattern: 'salvo', framework: 'salvo' },
    ];

    for (const { pattern, framework: fw } of frameworkPatterns) {
      if (dependencies.includes(pattern)) {
        framework = fw;
        break;
      }
    }

    // ORM detection
    const ormPatterns = [
      { pattern: 'diesel', orm: 'diesel' },
      { pattern: 'sqlx', orm: 'sqlx' },
      { pattern: 'sea-orm', orm: 'sea-orm' },
      { pattern: 'tokio-postgres', orm: 'tokio-postgres' },
      { pattern: 'rusqlite', orm: 'rusqlite' },
    ];

    for (const { pattern, orm: ormTech } of ormPatterns) {
      if (dependencies.includes(pattern)) {
        orm = ormTech;
        break;
      }
    }

    // Database detection
    const databasePatterns = [
      { pattern: 'sqlx', database: 'postgresql' }, // sqlx supports multiple DBs
      { pattern: 'tokio-postgres', database: 'postgresql' },
      { pattern: 'diesel', database: 'postgresql' }, // diesel supports multiple DBs
      { pattern: 'mysql', database: 'mysql' },
      { pattern: 'mongodb', database: 'mongodb' },
      { pattern: 'redis', database: 'redis' },
      { pattern: 'rusqlite', database: 'sqlite' },
    ];

    for (const { pattern, database: db } of databasePatterns) {
      if (dependencies.some((dep) => dep.includes(pattern))) {
        database = db;
        break;
      }
    }

    return { framework, database, orm };
  }

  protected async applyHeuristics(): Promise<TechInfo | null> {
    // Check for .rs files in common locations
    const hasMainRs = await this.hasManifestFile('src/main.rs');
    const hasLibRs = await this.hasManifestFile('src/lib.rs');

    if (hasMainRs || hasLibRs) {
      return {
        language: 'rust',
        buildTool: 'cargo',
        confidence: 0.3,
      };
    }

    return null;
  }
}
