import { parseString as parseXml } from 'xml2js';
import { BaseDetector, TechInfo } from './base-detector.js';

/**
 * Detector for Java projects
 * Supports: Maven (pom.xml), Gradle (build.gradle, build.gradle.kts)
 * Frameworks: Spring Boot, Micronaut, Quarkus, Jakarta EE, Vert.x
 */
export class JavaDetector extends BaseDetector {
  readonly language = 'java';
  readonly name = 'JavaDetector';
  readonly manifestFiles = ['pom.xml'];
  readonly manifestPatterns = ['build.gradle*', 'settings.gradle*'];

  protected async detectFromManifests(): Promise<TechInfo | null> {
    // Try Maven first (most common)
    const mavenTech = await this.detectFromMaven();
    if (mavenTech) return mavenTech;

    // Try Gradle
    const gradleTech = await this.detectFromGradle();
    if (gradleTech) return gradleTech;

    return null;
  }

  protected async detectFromStructure(): Promise<TechInfo | null> {
    // Check for typical Java project structure
    const hasJavaSource = await this.hasDirectory('src/main/java');
    const hasTestSource = await this.hasDirectory('src/test/java');

    if (hasJavaSource || hasTestSource) {
      return {
        language: 'java',
        buildTool: 'unknown',
        confidence: 0.5,
      };
    }

    return null;
  }

  /**
   * Detect from Maven (pom.xml)
   */
  private async detectFromMaven(): Promise<TechInfo | null> {
    const pomContent = await this.readManifest('pom.xml');
    if (!pomContent) return null;

    try {
      const pom = await this.parseXmlAsync(pomContent);
      const dependencies = this.extractMavenDependencies(pom);
      const { framework, orm, database } = this.detectFrameworkAndTools(dependencies);

      // Extract Java version
      const javaVersion =
        pom.project?.properties?.[0]?.['maven.compiler.source']?.[0] ||
        pom.project?.properties?.[0]?.['java.version']?.[0] ||
        pom.project?.properties?.[0]?.['maven.compiler.target']?.[0] ||
        '17';

      const techInfo: TechInfo = {
        language: 'java',
        framework,
        version: javaVersion,
        buildTool: 'maven',
        packageManager: 'maven',
        dependencies,
        orm,
        database,
        confidence: this.calculateConfidence({
          hasManifest: true,
          hasStructure: await this.hasDirectory('src/main/java'),
          hasDependencies: dependencies.length > 0,
          frameworkDetected: !!framework,
        }),
      };

      return techInfo;
    } catch (error) {
      console.error('Error parsing pom.xml:', error);
      return null;
    }
  }

  /**
   * Detect from Gradle (build.gradle or build.gradle.kts)
   */
  private async detectFromGradle(): Promise<TechInfo | null> {
    // Try Groovy first
    let gradleContent = await this.readManifest('build.gradle');
    let isKotlinDsl = false;

    // If no Groovy file, try Kotlin DSL
    if (!gradleContent) {
      gradleContent = await this.readManifest('build.gradle.kts');
      isKotlinDsl = true;
    }

    if (!gradleContent) return null;

    try {
      const dependencies = this.extractGradleDependencies(gradleContent);
      const { framework, orm, database } = this.detectFrameworkAndTools(dependencies);

      // Extract Java version from Gradle config
      const javaVersionMatch = gradleContent.match(/sourceCompatibility\s*=\s*['"]([\d.]+)['"]/);
      const javaVersion = javaVersionMatch ? javaVersionMatch[1] : '17';

      const techInfo: TechInfo = {
        language: 'java',
        framework,
        version: javaVersion,
        buildTool: isKotlinDsl ? 'gradle-kotlin' : 'gradle',
        packageManager: 'gradle',
        dependencies,
        orm,
        database,
        confidence: this.calculateConfidence({
          hasManifest: true,
          hasStructure: await this.hasDirectory('src/main/java'),
          hasDependencies: dependencies.length > 0,
          frameworkDetected: !!framework,
        }),
      };

      return techInfo;
    } catch (error) {
      console.error('Error parsing build.gradle:', error);
      return null;
    }
  }

  /**
   * Parse XML asynchronously
   */
  private parseXmlAsync(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseXml(xml, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Extract dependencies from Maven POM
   */
  private extractMavenDependencies(pom: any): string[] {
    const dependencies: string[] = [];

    // Extract regular dependencies
    const depsList = pom.project?.dependencies?.[0]?.dependency || [];
    for (const dep of depsList) {
      const groupId = dep.groupId?.[0];
      const artifactId = dep.artifactId?.[0];
      if (groupId && artifactId) {
        dependencies.push(`${groupId}:${artifactId}`);
      }
    }

    // Extract parent dependencies (for Spring Boot starters)
    const parent = pom.project?.parent?.[0];
    if (parent) {
      const groupId = parent.groupId?.[0];
      const artifactId = parent.artifactId?.[0];
      if (groupId && artifactId) {
        dependencies.push(`${groupId}:${artifactId}`);
      }
    }

    return dependencies;
  }

  /**
   * Extract dependencies from Gradle build file
   */
  private extractGradleDependencies(gradleContent: string): string[] {
    const dependencies: string[] = [];

    // Match implementation, api, compile, runtimeOnly, etc.
    const depPatterns = [
      /implementation\s+['"]([^'"]+)['"]/g,
      /api\s+['"]([^'"]+)['"]/g,
      /compile\s+['"]([^'"]+)['"]/g,
      /runtimeOnly\s+['"]([^'"]+)['"]/g,
      /annotationProcessor\s+['"]([^'"]+)['"]/g,
    ];

    for (const pattern of depPatterns) {
      let match;
      while ((match = pattern.exec(gradleContent)) !== null) {
        dependencies.push(match[1]);
      }
    }

    return dependencies;
  }

  /**
   * Detect framework, ORM, and database from dependencies
   */
  private detectFrameworkAndTools(dependencies: string[]): {
    framework?: string;
    orm?: string;
    database?: string;
  } {
    let framework: string | undefined;
    let orm: string | undefined;
    let database: string | undefined;

    // Framework detection
    const frameworkPatterns = [
      { pattern: 'spring-boot-starter', framework: 'spring-boot' },
      { pattern: 'io.micronaut', framework: 'micronaut' },
      { pattern: 'io.quarkus', framework: 'quarkus' },
      { pattern: 'jakarta.ee-api', framework: 'jakarta-ee' },
      { pattern: 'javax.ee-api', framework: 'java-ee' },
      { pattern: 'io.vertx', framework: 'vertx' },
      { pattern: 'com.sparkjava', framework: 'spark' },
      { pattern: 'io.javalin', framework: 'javalin' },
    ];

    for (const { pattern, framework: fw } of frameworkPatterns) {
      if (dependencies.some((dep) => dep.includes(pattern))) {
        framework = fw;
        break;
      }
    }

    // ORM detection
    const ormPatterns = [
      { pattern: 'hibernate', orm: 'hibernate' },
      { pattern: 'spring-data-jpa', orm: 'spring-data-jpa' },
      { pattern: 'mybatis', orm: 'mybatis' },
      { pattern: 'jooq', orm: 'jooq' },
      { pattern: 'eclipselink', orm: 'eclipselink' },
      { pattern: 'exposed', orm: 'exposed' },
    ];

    for (const { pattern, orm: ormTech } of ormPatterns) {
      if (dependencies.some((dep) => dep.toLowerCase().includes(pattern))) {
        orm = ormTech;
        break;
      }
    }

    // Database detection
    const databasePatterns = [
      { pattern: 'postgresql', database: 'postgresql' },
      { pattern: 'mysql', database: 'mysql' },
      { pattern: 'mariadb', database: 'mariadb' },
      { pattern: 'oracle', database: 'oracle' },
      { pattern: 'mssql', database: 'sql-server' },
      { pattern: 'h2', database: 'h2' },
      { pattern: 'mongodb', database: 'mongodb' },
      { pattern: 'redis', database: 'redis' },
    ];

    for (const { pattern, database: db } of databasePatterns) {
      if (dependencies.some((dep) => dep.toLowerCase().includes(pattern))) {
        database = db;
        break;
      }
    }

    return { framework, orm, database };
  }

  protected async applyHeuristics(): Promise<TechInfo | null> {
    // Check for .java files in common locations
    const commonPaths = ['src/main/java', 'src/test/java', 'src'];

    for (const p of commonPaths) {
      if (await this.hasDirectory(p)) {
        return {
          language: 'java',
          confidence: 0.3,
        };
      }
    }

    return null;
  }
}
