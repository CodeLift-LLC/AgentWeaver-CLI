import { BaseDetector, TechInfo } from './base-detector.js';

/**
 * Detector for Go projects
 * Supports: go.mod, go.sum
 * Frameworks: Gin, Echo, Fiber, Chi, Gorilla Mux, Buffalo, Beego
 */
export class GoDetector extends BaseDetector {
  readonly language = 'go';
  readonly name = 'GoDetector';
  readonly manifestFiles = ['go.mod', 'go.sum'];

  protected async detectFromManifests(): Promise<TechInfo | null> {
    const goModContent = await this.readManifest('go.mod');
    if (!goModContent) return null;

    try {
      const { goVersion } = this.parseGoMod(goModContent);
      const dependencies = this.extractDependencies(goModContent);
      const { framework, database, orm } = this.detectFrameworkAndTools(dependencies);

      const techInfo: TechInfo = {
        language: 'go',
        framework,
        version: goVersion,
        buildTool: 'go',
        packageManager: 'go-modules',
        dependencies,
        orm,
        database,
        confidence: this.calculateConfidence({
          hasManifest: true,
          hasStructure: await this.hasDirectory('cmd'),
          hasDependencies: dependencies.length > 0,
          frameworkDetected: !!framework,
        }),
      };

      return techInfo;
    } catch (error) {
      console.error('Error parsing go.mod:', error);
      return null;
    }
  }

  protected async detectFromStructure(): Promise<TechInfo | null> {
    // Check for typical Go project structure
    const hasCmd = await this.hasDirectory('cmd');
    const hasPkg = await this.hasDirectory('pkg');
    const hasInternal = await this.hasDirectory('internal');
    const hasMain = await this.hasManifestFile('main.go');

    if (hasCmd || hasPkg || hasInternal || hasMain) {
      return {
        language: 'go',
        buildTool: 'go',
        confidence: 0.6,
      };
    }

    return null;
  }

  /**
   * Parse go.mod file
   */
  private parseGoMod(content: string): { goVersion: string } {
    // Extract Go version
    const goVersionMatch = content.match(/^go\s+([\d.]+)$/m);
    const goVersion = goVersionMatch ? goVersionMatch[1] : '1.21';

    return { goVersion };
  }

  /**
   * Extract dependencies from go.mod
   */
  private extractDependencies(content: string): string[] {
    const dependencies: string[] = [];

    // Match require block
    const requireMatch = content.match(/require\s*\(([\s\S]*?)\)/);
    if (requireMatch) {
      const requireBlock = requireMatch[1];
      const depMatches = requireBlock.matchAll(/^\s*([^\s]+)\s+v?[\d.]+/gm);

      for (const match of depMatches) {
        dependencies.push(match[1]);
      }
    }

    // Match single-line require statements
    const singleRequires = content.matchAll(/^require\s+([^\s]+)\s+v?[\d.]+/gm);
    for (const match of singleRequires) {
      dependencies.push(match[1]);
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
      { pattern: 'github.com/gin-gonic/gin', framework: 'gin' },
      { pattern: 'github.com/labstack/echo', framework: 'echo' },
      { pattern: 'github.com/gofiber/fiber', framework: 'fiber' },
      { pattern: 'github.com/go-chi/chi', framework: 'chi' },
      { pattern: 'github.com/gorilla/mux', framework: 'gorilla-mux' },
      { pattern: 'github.com/gobuffalo/buffalo', framework: 'buffalo' },
      { pattern: 'github.com/beego/beego', framework: 'beego' },
      { pattern: 'github.com/revel/revel', framework: 'revel' },
      { pattern: 'github.com/gofiber/fiber/v2', framework: 'fiber' },
      { pattern: 'go.uber.org/fx', framework: 'fx' },
    ];

    for (const { pattern, framework: fw } of frameworkPatterns) {
      if (dependencies.some((dep) => dep.startsWith(pattern))) {
        framework = fw;
        break;
      }
    }

    // ORM detection
    const ormPatterns = [
      { pattern: 'gorm.io/gorm', orm: 'gorm' },
      { pattern: 'github.com/go-gorm/gorm', orm: 'gorm' },
      { pattern: 'github.com/jmoiron/sqlx', orm: 'sqlx' },
      { pattern: 'github.com/volatiletech/sqlboiler', orm: 'sqlboiler' },
      { pattern: 'entgo.io/ent', orm: 'ent' },
      { pattern: 'github.com/uptrace/bun', orm: 'bun' },
    ];

    for (const { pattern, orm: ormTech } of ormPatterns) {
      if (dependencies.some((dep) => dep.startsWith(pattern))) {
        orm = ormTech;
        break;
      }
    }

    // Database detection
    const databasePatterns = [
      { pattern: 'github.com/lib/pq', database: 'postgresql' },
      { pattern: 'github.com/jackc/pgx', database: 'postgresql' },
      { pattern: 'gorm.io/driver/postgres', database: 'postgresql' },
      { pattern: 'github.com/go-sql-driver/mysql', database: 'mysql' },
      { pattern: 'gorm.io/driver/mysql', database: 'mysql' },
      { pattern: 'go.mongodb.org/mongo-driver', database: 'mongodb' },
      { pattern: 'github.com/go-redis/redis', database: 'redis' },
      { pattern: 'github.com/redis/go-redis', database: 'redis' },
      { pattern: 'gorm.io/driver/sqlite', database: 'sqlite' },
      { pattern: 'github.com/mattn/go-sqlite3', database: 'sqlite' },
    ];

    for (const { pattern, database: db } of databasePatterns) {
      if (dependencies.some((dep) => dep.startsWith(pattern))) {
        database = db;
        break;
      }
    }

    return { framework, database, orm };
  }

  protected async applyHeuristics(): Promise<TechInfo | null> {
    // Check for .go files in common locations
    const hasMain = await this.hasManifestFile('main.go');
    const hasCmd = await this.hasDirectory('cmd');

    if (hasMain || hasCmd) {
      return {
        language: 'go',
        confidence: 0.3,
      };
    }

    return null;
  }
}
