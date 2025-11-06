import { BaseDetector, TechInfo } from './base-detector.js';

/**
 * Detector for PHP projects
 * Supports: composer.json, composer.lock
 * Frameworks: Laravel, Symfony, CodeIgniter, CakePHP, Slim, Lumen
 */
export class PHPDetector extends BaseDetector {
  readonly language = 'php';
  readonly name = 'PHPDetector';
  readonly manifestFiles = ['composer.json', 'composer.lock'];

  protected async detectFromManifests(): Promise<TechInfo | null> {
    const composerJson = await this.readJsonManifest<any>('composer.json');
    if (!composerJson) return null;

    try {
      const dependencies = this.extractDependencies(composerJson);
      const { framework, database, orm } = this.detectFrameworkAndTools(dependencies);
      const phpVersion = this.extractPhpVersion(composerJson);

      const techInfo: TechInfo = {
        language: 'php',
        framework,
        version: phpVersion || '8.0',
        buildTool: 'composer',
        packageManager: 'composer',
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
      console.error('Error parsing composer.json:', error);
      return null;
    }
  }

  protected async detectFromStructure(): Promise<TechInfo | null> {
    // Check for Laravel structure
    const hasArtisan = await this.hasManifestFile('artisan');
    const hasApp = await this.hasDirectory('app');

    if (hasArtisan && hasApp) {
      return {
        language: 'php',
        framework: 'laravel',
        buildTool: 'composer',
        confidence: 0.8,
      };
    }

    // Check for Symfony structure
    const hasSymfonyKernel = await this.hasManifestFile('bin/console');
    const hasConfig = await this.hasDirectory('config');

    if (hasSymfonyKernel && hasConfig) {
      return {
        language: 'php',
        framework: 'symfony',
        buildTool: 'composer',
        confidence: 0.7,
      };
    }

    // Generic PHP project
    if (hasApp || (await this.hasDirectory('src'))) {
      return {
        language: 'php',
        buildTool: 'composer',
        confidence: 0.5,
      };
    }

    return null;
  }

  /**
   * Extract dependencies from composer.json
   */
  private extractDependencies(composerJson: any): string[] {
    const dependencies: string[] = [];

    // Regular dependencies
    if (composerJson.require) {
      dependencies.push(...Object.keys(composerJson.require));
    }

    // Dev dependencies
    if (composerJson['require-dev']) {
      dependencies.push(...Object.keys(composerJson['require-dev']));
    }

    return dependencies.filter((dep) => !dep.startsWith('php')); // Filter out PHP version constraint
  }

  /**
   * Extract PHP version from composer.json
   */
  private extractPhpVersion(composerJson: any): string | null {
    if (composerJson.require && composerJson.require.php) {
      const versionConstraint = composerJson.require.php;

      // Extract version number from constraint (e.g., "^8.1" -> "8.1")
      const match = versionConstraint.match(/[\d.]+/);
      return match ? match[0] : null;
    }

    return null;
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
      { pattern: 'laravel/framework', framework: 'laravel' },
      { pattern: 'symfony/symfony', framework: 'symfony' },
      { pattern: 'symfony/framework-bundle', framework: 'symfony' },
      { pattern: 'codeigniter4/framework', framework: 'codeigniter' },
      { pattern: 'cakephp/cakephp', framework: 'cakephp' },
      { pattern: 'slim/slim', framework: 'slim' },
      { pattern: 'laravel/lumen-framework', framework: 'lumen' },
      { pattern: 'yiisoft/yii2', framework: 'yii2' },
      { pattern: 'phpunit/phpunit', framework: 'phpunit' }, // Testing framework
    ];

    for (const { pattern, framework: fw } of frameworkPatterns) {
      if (dependencies.includes(pattern)) {
        framework = fw;
        break;
      }
    }

    // ORM detection
    const ormPatterns = [
      { pattern: 'doctrine/orm', orm: 'doctrine' },
      { pattern: 'illuminate/database', orm: 'eloquent' },
      { pattern: 'propel/propel', orm: 'propel' },
      { pattern: 'cycle/orm', orm: 'cycle' },
    ];

    for (const { pattern, orm: ormTech } of ormPatterns) {
      if (dependencies.includes(pattern)) {
        orm = ormTech;
        break;
      }
    }

    // Database detection
    const databasePatterns = [
      { pattern: 'doctrine/dbal', database: 'multiple' }, // DBAL supports multiple databases
      { pattern: 'mongodb/mongodb', database: 'mongodb' },
      { pattern: 'predis/predis', database: 'redis' },
      { pattern: 'phpredis/phpredis', database: 'redis' },
    ];

    for (const { pattern, database: db } of databasePatterns) {
      if (dependencies.includes(pattern)) {
        database = db;
        break;
      }
    }

    return { framework, database, orm };
  }

  protected async applyHeuristics(): Promise<TechInfo | null> {
    // Check for PHP files in common locations
    const hasIndexPhp = await this.hasManifestFile('index.php');
    const hasPublicIndex = await this.hasManifestFile('public/index.php');

    if (hasIndexPhp || hasPublicIndex) {
      return {
        language: 'php',
        confidence: 0.4,
      };
    }

    return null;
  }
}
