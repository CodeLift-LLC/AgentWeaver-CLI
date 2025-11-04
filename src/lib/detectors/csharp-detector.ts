import path from 'path';
import { parseString as parseXml } from 'xml2js';
import { BaseDetector, TechInfo } from './base-detector.js';

/**
 * Detector for C# / .NET projects
 * Supports: .csproj, .sln, packages.config, Directory.Build.props
 * Frameworks: ASP.NET Core, .NET Framework, Blazor, MAUI, WPF, WinForms
 */
export class CSharpDetector extends BaseDetector {
  readonly language = 'csharp';
  readonly name = 'CSharpDetector';
  readonly manifestFiles = ['packages.config', 'Directory.Build.props', 'global.json'];
  readonly manifestPatterns = ['*.csproj', '*.sln'];

  protected async detectFromManifests(): Promise<TechInfo | null> {
    // Try to find .csproj files first
    const csprojTech = await this.detectFromCsproj();
    if (csprojTech) return csprojTech;

    // Try .sln solution file
    const slnTech = await this.detectFromSolution();
    if (slnTech) return slnTech;

    // Try global.json
    const globalJsonTech = await this.detectFromGlobalJson();
    if (globalJsonTech) return globalJsonTech;

    return null;
  }

  protected async detectFromStructure(): Promise<TechInfo | null> {
    // Check for typical .NET project structures
    const hasControllers = await this.hasDirectory('Controllers');
    const hasModels = await this.hasDirectory('Models');
    const hasViews = await this.hasDirectory('Views');
    const hasPages = await this.hasDirectory('Pages');
    const hasProgram = await this.hasCSharpFile('Program.cs');
    const hasStartup = await this.hasCSharpFile('Startup.cs');

    if (hasControllers || hasModels || hasViews || hasPages || hasProgram || hasStartup) {
      return {
        language: 'csharp',
        framework: hasControllers ? 'aspnet-core' : undefined,
        confidence: 0.6,
      };
    }

    return null;
  }

  /**
   * Check if a C# file exists
   */
  private async hasCSharpFile(filename: string): Promise<boolean> {
    return await this.hasManifestFile(filename);
  }

  /**
   * Find all .csproj files in the project root
   */
  private async findCsprojFiles(): Promise<string[]> {
    return await this.findFilesMatchingPattern('*.csproj');
  }

  /**
   * Find all .sln files in the project root
   */
  private async findSolutionFiles(): Promise<string[]> {
    return await this.findFilesMatchingPattern('*.sln');
  }

  /**
   * Detect from .csproj file
   */
  private async detectFromCsproj(): Promise<TechInfo | null> {
    const csprojFiles = await this.findCsprojFiles();
    if (csprojFiles.length === 0) return null;

    // Parse the first .csproj file found
    const csprojContent = await this.readManifest(csprojFiles[0]);
    if (!csprojContent) return null;

    try {
      const csproj = await this.parseXmlAsync(csprojContent);
      const { framework, version, targetFramework } = this.extractProjectInfo(csproj);
      const dependencies = this.extractNuGetPackages(csproj);
      const { orm, database } = this.detectToolsFromPackages(dependencies);

      const techInfo: TechInfo = {
        language: 'csharp',
        framework,
        version: version || targetFramework,
        buildTool: 'dotnet',
        packageManager: 'nuget',
        dependencies,
        orm,
        database,
        confidence: this.calculateConfidence({
          hasManifest: true,
          hasStructure: await this.hasDirectory('Controllers'),
          hasDependencies: dependencies.length > 0,
          frameworkDetected: !!framework,
        }),
      };

      return techInfo;
    } catch (error) {
      console.error('Error parsing .csproj:', error);
      return null;
    }
  }

  /**
   * Detect from .sln solution file
   */
  private async detectFromSolution(): Promise<TechInfo | null> {
    const slnFiles = await this.findSolutionFiles();
    if (slnFiles.length === 0) return null;

    const slnFile = slnFiles[0]; // Use the first .sln file found

    const slnContent = await this.readManifest(slnFile);
    if (!slnContent) return null;

    // Parse solution file to find project references
    const projectMatches = slnContent.matchAll(/Project\([^)]+\)\s*=\s*"[^"]+",\s*"([^"]+\.csproj)"/g);
    const projectFiles: string[] = [];

    for (const match of projectMatches) {
      projectFiles.push(match[1]);
    }

    // If we found project files, try to detect from the first one
    if (projectFiles.length > 0) {
      const projectPath = path.basename(projectFiles[0]);
      const csprojContent = await this.readManifest(projectPath);

      if (csprojContent) {
        try {
          const csproj = await this.parseXmlAsync(csprojContent);
          const { framework, version, targetFramework } = this.extractProjectInfo(csproj);
          const dependencies = this.extractNuGetPackages(csproj);

          return {
            language: 'csharp',
            framework,
            version: version || targetFramework,
            buildTool: 'dotnet',
            packageManager: 'nuget',
            dependencies,
            confidence: 0.8,
          };
        } catch {
          // Failed to parse, return basic info
        }
      }
    }

    // Return basic .NET detection
    return {
      language: 'csharp',
      buildTool: 'dotnet',
      confidence: 0.5,
    };
  }

  /**
   * Detect from global.json
   */
  private async detectFromGlobalJson(): Promise<TechInfo | null> {
    const globalJson = await this.readJsonManifest<{ sdk?: { version?: string } }>('global.json');
    if (!globalJson) return null;

    const sdkVersion = globalJson.sdk?.version;

    return {
      language: 'csharp',
      version: sdkVersion,
      buildTool: 'dotnet',
      confidence: 0.4,
    };
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
   * Extract project information from .csproj
   */
  private extractProjectInfo(csproj: any): {
    framework?: string;
    version?: string;
    targetFramework?: string;
  } {
    const propertyGroup = csproj.Project?.PropertyGroup?.[0] || {};

    // Extract target framework
    const targetFramework =
      propertyGroup.TargetFramework?.[0] || propertyGroup.TargetFrameworks?.[0] || '';

    // Extract NuGet packages to help with framework detection
    const packages = this.extractNuGetPackages(csproj);

    // Detect framework type from SDK or package references
    let framework: string | undefined;

    // Check for web SDK
    if (csproj.Project?.$?.Sdk?.includes('Microsoft.NET.Sdk.Web')) {
      framework = 'aspnet-core';
    }
    // Check for Blazor
    else if (targetFramework.includes('blazor') || propertyGroup.RazorLangVersion) {
      framework = 'blazor';
    }
    // Check for MAUI
    else if (csproj.Project?.$?.Sdk?.includes('Microsoft.NET.Sdk.Maui')) {
      framework = 'maui';
    }
    // Check for WPF
    else if (propertyGroup.UseWPF?.[0] === 'true') {
      framework = 'wpf';
    }
    // Check for WinForms
    else if (propertyGroup.UseWindowsForms?.[0] === 'true') {
      framework = 'winforms';
    }
    // Check for ASP.NET Core packages
    else if (
      packages.some(
        (pkg) =>
          pkg.includes('Microsoft.AspNetCore') ||
          pkg.includes('AspNetCore.Mvc') ||
          pkg.includes('AspNetCore.App')
      )
    ) {
      framework = 'aspnet-core';
    }
    // Check for Blazor packages
    else if (packages.some((pkg) => pkg.includes('Blazor'))) {
      framework = 'blazor';
    }
    // Default to generic .NET
    else {
      framework = targetFramework.startsWith('net') ? 'dotnet' : 'dotnet-framework';
    }

    // Extract version from target framework (e.g., "net8.0" -> "8.0")
    let version: string | undefined;
    const versionMatch = targetFramework.match(/net(\d+\.\d+)/);
    if (versionMatch) {
      version = versionMatch[1];
    }

    return { framework, version, targetFramework };
  }

  /**
   * Extract NuGet packages from .csproj
   */
  private extractNuGetPackages(csproj: any): string[] {
    const packages: string[] = [];

    // Extract PackageReference elements
    const itemGroups = csproj.Project?.ItemGroup || [];
    for (const itemGroup of itemGroups) {
      const packageRefs = itemGroup.PackageReference || [];
      for (const pkg of packageRefs) {
        const packageName = pkg.$?.Include;
        if (packageName) {
          packages.push(packageName);
        }
      }
    }

    return packages;
  }

  /**
   * Detect ORM and database from NuGet packages
   */
  private detectToolsFromPackages(packages: string[]): {
    orm?: string;
    database?: string;
  } {
    let orm: string | undefined;
    let database: string | undefined;

    // ORM detection
    const ormPatterns = [
      { pattern: 'EntityFrameworkCore', orm: 'entity-framework-core' },
      { pattern: 'EntityFramework', orm: 'entity-framework' },
      { pattern: 'Dapper', orm: 'dapper' },
      { pattern: 'NHibernate', orm: 'nhibernate' },
      { pattern: 'LinqToDB', orm: 'linq2db' },
    ];

    for (const { pattern, orm: ormTech } of ormPatterns) {
      if (packages.some((pkg) => pkg.includes(pattern))) {
        orm = ormTech;
        break;
      }
    }

    // Database detection
    const databasePatterns = [
      { pattern: 'Npgsql', database: 'postgresql' },
      { pattern: 'MySql', database: 'mysql' },
      { pattern: 'SqlServer', database: 'sql-server' },
      { pattern: 'MongoDB', database: 'mongodb' },
      { pattern: 'Oracle', database: 'oracle' },
      { pattern: 'Sqlite', database: 'sqlite' },
      { pattern: 'StackExchange.Redis', database: 'redis' },
    ];

    for (const { pattern, database: db } of databasePatterns) {
      if (packages.some((pkg) => pkg.includes(pattern))) {
        database = db;
        break;
      }
    }

    return { orm, database };
  }

  protected async applyHeuristics(): Promise<TechInfo | null> {
    // Check for .cs files
    const hasProgram = await this.hasCSharpFile('Program.cs');
    const hasStartup = await this.hasCSharpFile('Startup.cs');

    if (hasProgram || hasStartup) {
      return {
        language: 'csharp',
        confidence: 0.3,
      };
    }

    return null;
  }
}
