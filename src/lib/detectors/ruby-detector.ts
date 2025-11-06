import { BaseDetector, TechInfo } from './base-detector.js';

/**
 * Detector for Ruby projects
 * Supports: Gemfile, Gemfile.lock, *.gemspec
 * Frameworks: Ruby on Rails, Sinatra, Hanami, Padrino, Grape
 */
export class RubyDetector extends BaseDetector {
  readonly language = 'ruby';
  readonly name = 'RubyDetector';
  readonly manifestFiles = ['Gemfile', 'Gemfile.lock', '.ruby-version'];

  protected async detectFromManifests(): Promise<TechInfo | null> {
    const gemfileContent = await this.readManifest('Gemfile');
    if (!gemfileContent) return null;

    try {
      const dependencies = this.extractDependencies(gemfileContent);
      const { framework, database, orm } = this.detectFrameworkAndTools(dependencies);
      const rubyVersion = await this.detectRubyVersion();

      const techInfo: TechInfo = {
        language: 'ruby',
        framework,
        version: rubyVersion || '3.0',
        buildTool: 'bundler',
        packageManager: 'rubygems',
        dependencies,
        orm,
        database,
        confidence: this.calculateConfidence({
          hasManifest: true,
          hasStructure: await this.hasDirectory('app'),
          hasDependencies: dependencies.length > 0,
          frameworkDetected: !!framework,
        }),
      };

      return techInfo;
    } catch (error) {
      console.error('Error parsing Gemfile:', error);
      return null;
    }
  }

  protected async detectFromStructure(): Promise<TechInfo | null> {
    // Check for typical Ruby on Rails structure
    const hasApp = await this.hasDirectory('app');
    const hasConfig = await this.hasDirectory('config');
    const hasDb = await this.hasDirectory('db');
    const hasRakefile = await this.hasManifestFile('Rakefile');

    if ((hasApp && hasConfig) || (hasDb && hasRakefile)) {
      return {
        language: 'ruby',
        framework: 'rails',
        buildTool: 'bundler',
        confidence: 0.7,
      };
    }

    // Check for Sinatra or other lightweight frameworks
    if (hasApp || hasRakefile) {
      return {
        language: 'ruby',
        buildTool: 'bundler',
        confidence: 0.5,
      };
    }

    return null;
  }

  /**
   * Extract dependencies from Gemfile
   */
  private extractDependencies(gemfileContent: string): string[] {
    const dependencies: string[] = [];

    // Match gem declarations
    const gemPattern = /gem\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = gemPattern.exec(gemfileContent)) !== null) {
      dependencies.push(match[1]);
    }

    return dependencies;
  }

  /**
   * Detect Ruby version from .ruby-version file
   */
  private async detectRubyVersion(): Promise<string | null> {
    const rubyVersionContent = await this.readManifest('.ruby-version');
    if (rubyVersionContent) {
      return rubyVersionContent.trim();
    }

    // Try to extract from Gemfile
    const gemfileContent = await this.readManifest('Gemfile');
    if (gemfileContent) {
      const versionMatch = gemfileContent.match(/ruby\s+['"]([^'"]+)['"]/);
      if (versionMatch) {
        return versionMatch[1];
      }
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
      { pattern: 'rails', framework: 'rails' },
      { pattern: 'sinatra', framework: 'sinatra' },
      { pattern: 'hanami', framework: 'hanami' },
      { pattern: 'padrino', framework: 'padrino' },
      { pattern: 'grape', framework: 'grape' },
      { pattern: 'roda', framework: 'roda' },
      { pattern: 'cuba', framework: 'cuba' },
    ];

    for (const { pattern, framework: fw } of frameworkPatterns) {
      if (dependencies.includes(pattern)) {
        framework = fw;
        break;
      }
    }

    // ORM detection
    const ormPatterns = [
      { pattern: 'activerecord', orm: 'activerecord' },
      { pattern: 'sequel', orm: 'sequel' },
      { pattern: 'datamapper', orm: 'datamapper' },
      { pattern: 'mongoid', orm: 'mongoid' },
      { pattern: 'rom', orm: 'rom' },
    ];

    for (const { pattern, orm: ormTech } of ormPatterns) {
      if (dependencies.includes(pattern)) {
        orm = ormTech;
        break;
      }
    }

    // Database detection
    const databasePatterns = [
      { pattern: 'pg', database: 'postgresql' },
      { pattern: 'mysql2', database: 'mysql' },
      { pattern: 'sqlite3', database: 'sqlite' },
      { pattern: 'mongo', database: 'mongodb' },
      { pattern: 'redis', database: 'redis' },
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
    // Check for .rb files in common locations
    const hasRakefile = await this.hasManifestFile('Rakefile');
    const hasConfigRu = await this.hasManifestFile('config.ru');

    if (hasRakefile || hasConfigRu) {
      return {
        language: 'ruby',
        buildTool: 'bundler',
        confidence: 0.4,
      };
    }

    return null;
  }
}
