import path from 'path';
import { readJsonFile, pathExists, readFile } from '../utils/file-operations.js';
import {
  BaseDetector,
  DetectionResult,
  JavaDetector,
  CSharpDetector,
  GoDetector,
  RustDetector,
  RubyDetector,
  PHPDetector,
} from './detectors/index.js';

/**
 * Enhanced tech stack detection supporting multiple languages and architectures
 */

export interface EnhancedTechStack {
  // Architecture information
  architecture?: ArchitectureInfo;

  // Language projects detected (supports multi-language projects)
  projects: ProjectInfo[];

  // Legacy compatibility (for existing v1 config)
  frontend?: FrontendTech;
  backend?: BackendTech;
  database?: DatabaseTech;
  testing?: TestingTech;
  deployment?: DeploymentTech;
}

export interface ArchitectureInfo {
  type: 'monolith' | 'microservices' | 'monorepo' | 'web-fullstack' | 'cli-tool' | 'desktop-app' | 'mobile-app' | 'library';
  style: 'monoglot' | 'polyglot'; // Single language or multiple languages
  projectCount: number;
  hasWorkspaces: boolean; // npm/yarn workspaces, cargo workspaces, etc.
  workspaceTool?: 'npm-workspaces' | 'yarn-workspaces' | 'pnpm-workspaces' | 'lerna' | 'nx' | 'turborepo' | 'cargo-workspaces';
}

export interface ProjectInfo {
  name?: string; // Project name (from package.json, Cargo.toml, etc.)
  language: string;
  framework?: string;
  version?: string;
  buildTool?: string;
  packageManager?: string;
  dependencies?: string[];
  orm?: string;
  database?: string;
  confidence: number;
  detectionMethod: DetectionResult['detectionMethod'];
  path?: string; // Relative path in monorepo
}

// Legacy interfaces for backward compatibility
export interface FrontendTech {
  framework?: 'nextjs' | 'react' | 'vue' | 'angular' | 'svelte' | 'solid';
  language?: 'typescript' | 'javascript';
  styling?: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion' | 'sass' | 'vanilla-css';
  uiLibrary?: 'shadcn-ui' | 'mui' | 'ant-design' | 'chakra-ui' | 'mantine';
  stateManagement?: 'zustand' | 'redux' | 'jotai' | 'recoil' | 'pinia' | 'vuex';
  routing?: 'app-router' | 'pages-router' | 'react-router' | 'vue-router' | 'tanstack-router';
}

export interface BackendTech {
  framework?: 'express' | 'fastapi' | 'nestjs' | 'django' | 'flask' | 'hono' | 'elysia' | 'spring-boot' | 'aspnet-core' | 'gin' | 'actix-web' | 'rails' | 'laravel';
  language?: 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'java' | 'csharp' | 'ruby' | 'php';
  apiStyle?: 'rest' | 'graphql' | 'grpc' | 'trpc';
  validation?: 'zod' | 'joi' | 'yup' | 'pydantic' | 'class-validator';
}

export interface DatabaseTech {
  primary?: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'redis' | 'supabase' | 'oracle' | 'sql-server';
  orm?: 'prisma' | 'typeorm' | 'drizzle' | 'mongoose' | 'sequelize' | 'sqlalchemy' | 'hibernate' | 'entity-framework-core' | 'gorm' | 'diesel';
  cache?: 'redis' | 'memcached';
  migrations?: 'prisma' | 'typeorm' | 'knex' | 'alembic';
}

export interface TestingTech {
  unit?: 'jest' | 'vitest' | 'mocha' | 'pytest' | 'go-test' | 'junit5' | 'xunit' | 'rspec';
  e2e?: 'playwright' | 'cypress' | 'selenium' | 'puppeteer';
  coverage?: boolean;
}

export interface DeploymentTech {
  platform?: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'azure' | 'railway' | 'render' | 'fly-io';
  containerization?: 'docker' | 'podman';
  cicd?: 'github-actions' | 'gitlab-ci' | 'circle-ci' | 'jenkins';
}

interface PackageJson {
  name?: string;
  workspaces?: string[] | { packages: string[] };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  [key: string]: unknown;
}

export class EnhancedTechDetector {
  private projectRoot: string;
  private detectors: BaseDetector[];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;

    // Initialize all language detectors
    this.detectors = [
      new JavaDetector(projectRoot),
      new CSharpDetector(projectRoot),
      new GoDetector(projectRoot),
      new RustDetector(projectRoot),
      new RubyDetector(projectRoot),
      new PHPDetector(projectRoot),
    ];
  }

  /**
   * Detects the complete enhanced tech stack with architecture analysis
   */
  async detectAll(): Promise<EnhancedTechStack> {
    // Run all detectors in parallel
    const detectionResults = await this.runAllDetectors();

    // Detect JavaScript/TypeScript projects (using legacy detector for now)
    const jsProjects = await this.detectJavaScriptProjects();

    // Detect Python projects (using legacy detector for now)
    const pythonProjects = await this.detectPythonProjects();

    // Combine all detected projects
    const allProjects = [
      ...detectionResults.filter(r => r.techInfo !== null).map(r => this.convertToProjectInfo(r)),
      ...jsProjects,
      ...pythonProjects,
    ];

    // Detect architecture type
    const architecture = await this.detectArchitecture(allProjects);

    // Generate legacy compatibility data
    const { frontend, backend, database, testing, deployment } = await this.generateLegacyData(allProjects);

    return {
      architecture,
      projects: allProjects,
      frontend,
      backend,
      database,
      testing,
      deployment,
    };
  }

  /**
   * Run all language detectors in parallel
   */
  private async runAllDetectors(): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];

    for (const detector of this.detectors) {
      // Quick pre-check to avoid expensive detection
      if (await detector.isLikelyCandidate()) {
        try {
          const result = await detector.detect();
          results.push(result);
        } catch (error) {
          console.error(`Error running ${detector.name}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Convert DetectionResult to ProjectInfo
   */
  private convertToProjectInfo(result: DetectionResult): ProjectInfo {
    const techInfo = result.techInfo!;

    return {
      language: techInfo.language,
      framework: techInfo.framework,
      version: techInfo.version,
      buildTool: techInfo.buildTool,
      packageManager: techInfo.packageManager,
      dependencies: techInfo.dependencies,
      orm: techInfo.orm,
      database: techInfo.database,
      confidence: techInfo.confidence,
      detectionMethod: result.detectionMethod,
    };
  }

  /**
   * Detect JavaScript/TypeScript projects (Node.js, frontend frameworks)
   */
  private async detectJavaScriptProjects(): Promise<ProjectInfo[]> {
    const packageJson = await this.readPackageJson();
    if (!packageJson) return [];

    const projects: ProjectInfo[] = [];

    // Detect frontend project
    const frontend = await this.detectFrontend();
    if (frontend) {
      projects.push({
        name: packageJson.name,
        language: frontend.language || 'javascript',
        framework: frontend.framework,
        confidence: 0.9,
        detectionMethod: 'manifest',
      });
    }

    // Detect backend project
    const backend = await this.detectBackend();
    if (backend && backend.language && ['typescript', 'javascript'].includes(backend.language)) {
      projects.push({
        name: packageJson.name,
        language: backend.language,
        framework: backend.framework,
        confidence: 0.9,
        detectionMethod: 'manifest',
      });
    }

    return projects;
  }

  /**
   * Detect Python projects
   */
  private async detectPythonProjects(): Promise<ProjectInfo[]> {
    const pyproject = await this.readPyprojectToml();
    if (!pyproject) return [];

    const projects: ProjectInfo[] = [];

    // Basic Python detection
    if (pyproject.includes('fastapi')) {
      projects.push({
        language: 'python',
        framework: 'fastapi',
        confidence: 0.8,
        detectionMethod: 'manifest',
      });
    } else if (pyproject.includes('django')) {
      projects.push({
        language: 'python',
        framework: 'django',
        confidence: 0.8,
        detectionMethod: 'manifest',
      });
    } else if (pyproject.includes('flask')) {
      projects.push({
        language: 'python',
        framework: 'flask',
        confidence: 0.8,
        detectionMethod: 'manifest',
      });
    } else {
      projects.push({
        language: 'python',
        confidence: 0.6,
        detectionMethod: 'manifest',
      });
    }

    return projects;
  }

  /**
   * Detect architecture type based on detected projects
   */
  private async detectArchitecture(projects: ProjectInfo[]): Promise<ArchitectureInfo> {
    const projectCount = projects.length;
    const languages = new Set(projects.map(p => p.language));
    const style: 'monoglot' | 'polyglot' = languages.size > 1 ? 'polyglot' : 'monoglot';

    // Check for workspace configuration
    const { hasWorkspaces, workspaceTool } = await this.detectWorkspaces();

    // Determine architecture type
    let type: ArchitectureInfo['type'] = 'monolith';

    if (hasWorkspaces || projectCount > 2) {
      type = 'monorepo';
    } else if (projectCount === 0) {
      type = 'library';
    } else if (projectCount === 1) {
      const project = projects[0];

      // CLI tool detection
      if (await this.hasDirectory('cmd') || await this.hasDirectory('cli') || await this.hasManifestFile('bin')) {
        type = 'cli-tool';
      }
      // Desktop app detection
      else if (project.framework === 'wpf' || project.framework === 'winforms' || project.framework === 'maui') {
        type = 'desktop-app';
      }
      // Mobile app detection
      else if (project.framework === 'maui' || await this.hasDirectory('android') || await this.hasDirectory('ios')) {
        type = 'mobile-app';
      }
      // Web application
      else if (project.framework) {
        type = 'monolith';
      }
    } else if (projectCount === 2) {
      // Frontend + Backend = web-fullstack
      const hasFrontend = projects.some(p => ['nextjs', 'react', 'vue', 'angular', 'svelte'].includes(p.framework || ''));
      const hasBackend = projects.some(p => ['express', 'fastapi', 'spring-boot', 'aspnet-core', 'gin', 'rails', 'laravel'].includes(p.framework || ''));

      if (hasFrontend && hasBackend) {
        type = 'web-fullstack';
      } else {
        type = 'microservices';
      }
    } else {
      type = 'microservices';
    }

    return {
      type,
      style,
      projectCount,
      hasWorkspaces,
      workspaceTool,
    };
  }

  /**
   * Detect workspace configuration (monorepo indicators)
   */
  private async detectWorkspaces(): Promise<{ hasWorkspaces: boolean; workspaceTool?: ArchitectureInfo['workspaceTool'] }> {
    // Check npm/yarn/pnpm workspaces
    const packageJson = await this.readPackageJson();
    if (packageJson?.workspaces) {
      if (await pathExists(path.join(this.projectRoot, 'pnpm-workspace.yaml'))) {
        return { hasWorkspaces: true, workspaceTool: 'pnpm-workspaces' };
      } else if (await pathExists(path.join(this.projectRoot, 'yarn.lock'))) {
        return { hasWorkspaces: true, workspaceTool: 'yarn-workspaces' };
      } else {
        return { hasWorkspaces: true, workspaceTool: 'npm-workspaces' };
      }
    }

    // Check Lerna
    if (await pathExists(path.join(this.projectRoot, 'lerna.json'))) {
      return { hasWorkspaces: true, workspaceTool: 'lerna' };
    }

    // Check Nx
    if (await pathExists(path.join(this.projectRoot, 'nx.json'))) {
      return { hasWorkspaces: true, workspaceTool: 'nx' };
    }

    // Check Turborepo
    if (await pathExists(path.join(this.projectRoot, 'turbo.json'))) {
      return { hasWorkspaces: true, workspaceTool: 'turborepo' };
    }

    // Check Cargo workspaces
    const cargoToml = await readFile(path.join(this.projectRoot, 'Cargo.toml')).catch(() => null);
    if (cargoToml && cargoToml.includes('[workspace]')) {
      return { hasWorkspaces: true, workspaceTool: 'cargo-workspaces' };
    }

    return { hasWorkspaces: false };
  }

  /**
   * Generate legacy tech stack data for backward compatibility
   */
  private async generateLegacyData(projects: ProjectInfo[]): Promise<{
    frontend?: FrontendTech;
    backend?: BackendTech;
    database?: DatabaseTech;
    testing?: TestingTech;
    deployment?: DeploymentTech;
  }> {
    const frontend = await this.detectFrontend();
    const backend = this.detectBackendFromProjects(projects);
    const database = await this.detectDatabase();
    const testing = await this.detectTesting();
    const deployment = await this.detectDeployment();

    return { frontend, backend, database, testing, deployment };
  }

  /**
   * Detect backend from projects list
   */
  private detectBackendFromProjects(projects: ProjectInfo[]): BackendTech | undefined {
    const backendProject = projects.find(p =>
      ['express', 'fastapi', 'nestjs', 'django', 'flask', 'spring-boot', 'aspnet-core', 'gin', 'actix-web', 'rails', 'laravel'].includes(p.framework || '')
    );

    if (!backendProject) return undefined;

    return {
      framework: backendProject.framework as BackendTech['framework'],
      language: backendProject.language as BackendTech['language'],
      apiStyle: 'rest', // Default
    };
  }

  // Legacy detection methods (kept for compatibility)
  private async detectFrontend(): Promise<FrontendTech | undefined> {
    const packageJson = await this.readPackageJson();
    if (!packageJson) return undefined;

    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const frontend: FrontendTech = {};

    if (deps['next']) frontend.framework = 'nextjs';
    else if (deps['react']) frontend.framework = 'react';
    else if (deps['vue']) frontend.framework = 'vue';
    else if (deps['@angular/core']) frontend.framework = 'angular';
    else if (deps['svelte']) frontend.framework = 'svelte';
    else if (deps['solid-js']) frontend.framework = 'solid';

    if (deps['typescript'] || (await pathExists(path.join(this.projectRoot, 'tsconfig.json')))) {
      frontend.language = 'typescript';
    } else {
      frontend.language = 'javascript';
    }

    if (deps['tailwindcss']) frontend.styling = 'tailwind';
    if (deps['zustand']) frontend.stateManagement = 'zustand';

    return Object.keys(frontend).length > 0 ? frontend : undefined;
  }

  private async detectBackend(): Promise<BackendTech | undefined> {
    const packageJson = await this.readPackageJson();
    const backend: BackendTech = {};

    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['express']) {
        backend.framework = 'express';
        backend.language = deps['typescript'] ? 'typescript' : 'javascript';
      } else if (deps['@nestjs/core']) {
        backend.framework = 'nestjs';
        backend.language = 'typescript';
      }

      if (deps['zod']) backend.validation = 'zod';
    }

    return Object.keys(backend).length > 0 ? backend : undefined;
  }

  private async detectDatabase(): Promise<DatabaseTech | undefined> {
    const packageJson = await this.readPackageJson();
    const database: DatabaseTech = {};

    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['@prisma/client']) {
        database.orm = 'prisma';
        database.migrations = 'prisma';
      } else if (deps['typeorm']) {
        database.orm = 'typeorm';
      }
    }

    return Object.keys(database).length > 0 ? database : undefined;
  }

  private async detectTesting(): Promise<TestingTech | undefined> {
    const packageJson = await this.readPackageJson();
    const testing: TestingTech = {};

    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['vitest']) testing.unit = 'vitest';
      else if (deps['jest']) testing.unit = 'jest';

      if (deps['@playwright/test']) testing.e2e = 'playwright';
      else if (deps['cypress']) testing.e2e = 'cypress';
    }

    return Object.keys(testing).length > 0 ? testing : undefined;
  }

  private async detectDeployment(): Promise<DeploymentTech | undefined> {
    const deployment: DeploymentTech = {};

    if (await pathExists(path.join(this.projectRoot, 'vercel.json'))) {
      deployment.platform = 'vercel';
    }
    if (await pathExists(path.join(this.projectRoot, 'Dockerfile'))) {
      deployment.containerization = 'docker';
    }
    if (await pathExists(path.join(this.projectRoot, '.github', 'workflows'))) {
      deployment.cicd = 'github-actions';
    }

    return Object.keys(deployment).length > 0 ? deployment : undefined;
  }

  // Helper methods
  private async readPackageJson(): Promise<PackageJson | null> {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      if (!(await pathExists(packagePath))) return null;
      return await readJsonFile<PackageJson>(packagePath);
    } catch {
      return null;
    }
  }

  private async readPyprojectToml(): Promise<string | null> {
    try {
      const pyprojectPath = path.join(this.projectRoot, 'pyproject.toml');
      if (!(await pathExists(pyprojectPath))) return null;
      return await readFile(pyprojectPath);
    } catch {
      return null;
    }
  }

  private async hasDirectory(dirPath: string): Promise<boolean> {
    return await pathExists(path.join(this.projectRoot, dirPath));
  }

  private async hasManifestFile(filename: string): Promise<boolean> {
    return await pathExists(path.join(this.projectRoot, filename));
  }
}
