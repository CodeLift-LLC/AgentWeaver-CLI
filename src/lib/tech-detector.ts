import path from 'path';
import { readJsonFile, pathExists, readFile } from '../utils/file-operations.js';

/**
 * Tech stack detection for various frameworks and technologies
 */

export interface TechStack {
  frontend?: FrontendTech;
  backend?: BackendTech;
  database?: DatabaseTech;
  testing?: TestingTech;
  deployment?: DeploymentTech;
}

export interface FrontendTech {
  framework?: 'nextjs' | 'react' | 'vue' | 'angular' | 'svelte' | 'solid';
  language?: 'typescript' | 'javascript';
  styling?: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion' | 'sass' | 'vanilla-css';
  uiLibrary?: 'shadcn-ui' | 'mui' | 'ant-design' | 'chakra-ui' | 'mantine';
  stateManagement?: 'zustand' | 'redux' | 'jotai' | 'recoil' | 'pinia' | 'vuex';
  routing?: 'app-router' | 'pages-router' | 'react-router' | 'vue-router' | 'tanstack-router';
}

export interface BackendTech {
  framework?:
    | 'express'
    | 'fastapi'
    | 'nestjs'
    | 'django'
    | 'flask'
    | 'hono'
    | 'elysia'
    | 'spring-boot'
    | 'aspnet-core'
    | 'gin'
    | 'actix-web'
    | 'rails'
    | 'laravel';
  language?:
    | 'typescript'
    | 'javascript'
    | 'python'
    | 'go'
    | 'rust'
    | 'java'
    | 'csharp'
    | 'ruby'
    | 'php';
  apiStyle?: 'rest' | 'graphql' | 'grpc' | 'trpc';
  validation?: 'zod' | 'joi' | 'yup' | 'pydantic' | 'class-validator';
}

export interface DatabaseTech {
  primary?:
    | 'postgresql'
    | 'mysql'
    | 'mongodb'
    | 'sqlite'
    | 'redis'
    | 'supabase'
    | 'oracle'
    | 'sql-server'
    | 'mariadb'
    | 'h2';
  orm?:
    | 'prisma'
    | 'typeorm'
    | 'drizzle'
    | 'mongoose'
    | 'sequelize'
    | 'sqlalchemy'
    | 'hibernate'
    | 'entity-framework-core'
    | 'gorm'
    | 'diesel';
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
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  [key: string]: unknown;
}

export class TechDetector {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Detects the complete tech stack
   */
  async detectAll(): Promise<TechStack> {
    const [frontend, backend, database, testing, deployment] = await Promise.all([
      this.detectFrontend(),
      this.detectBackend(),
      this.detectDatabase(),
      this.detectTesting(),
      this.detectDeployment(),
    ]);

    return {
      frontend,
      backend,
      database,
      testing,
      deployment,
    };
  }

  /**
   * Detects frontend technologies
   */
  async detectFrontend(): Promise<FrontendTech | undefined> {
    const packageJson = await this.readPackageJson();
    if (!packageJson) return undefined;

    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const frontend: FrontendTech = {};

    // Framework detection
    if (deps['next']) frontend.framework = 'nextjs';
    else if (deps['react']) frontend.framework = 'react';
    else if (deps['vue']) frontend.framework = 'vue';
    else if (deps['@angular/core']) frontend.framework = 'angular';
    else if (deps['svelte']) frontend.framework = 'svelte';
    else if (deps['solid-js']) frontend.framework = 'solid';

    // Language detection
    if (deps['typescript'] || (await pathExists(path.join(this.projectRoot, 'tsconfig.json')))) {
      frontend.language = 'typescript';
    } else {
      frontend.language = 'javascript';
    }

    // Styling detection
    if (deps['tailwindcss']) frontend.styling = 'tailwind';
    else if (deps['styled-components']) frontend.styling = 'styled-components';
    else if (deps['@emotion/react']) frontend.styling = 'emotion';
    else if (deps['sass']) frontend.styling = 'sass';

    // UI Library detection
    if (deps['@radix-ui/react-dialog'] || deps['@/components/ui']) frontend.uiLibrary = 'shadcn-ui';
    else if (deps['@mui/material']) frontend.uiLibrary = 'mui';
    else if (deps['antd']) frontend.uiLibrary = 'ant-design';
    else if (deps['@chakra-ui/react']) frontend.uiLibrary = 'chakra-ui';
    else if (deps['@mantine/core']) frontend.uiLibrary = 'mantine';

    // State management detection
    if (deps['zustand']) frontend.stateManagement = 'zustand';
    else if (deps['@reduxjs/toolkit'] || deps['redux']) frontend.stateManagement = 'redux';
    else if (deps['jotai']) frontend.stateManagement = 'jotai';
    else if (deps['recoil']) frontend.stateManagement = 'recoil';
    else if (deps['pinia']) frontend.stateManagement = 'pinia';
    else if (deps['vuex']) frontend.stateManagement = 'vuex';

    // Routing detection
    if (frontend.framework === 'nextjs') {
      const hasAppDir = await pathExists(path.join(this.projectRoot, 'app'));
      frontend.routing = hasAppDir ? 'app-router' : 'pages-router';
    } else if (deps['react-router-dom']) {
      frontend.routing = 'react-router';
    } else if (deps['vue-router']) {
      frontend.routing = 'vue-router';
    } else if (deps['@tanstack/react-router']) {
      frontend.routing = 'tanstack-router';
    }

    return Object.keys(frontend).length > 0 ? frontend : undefined;
  }

  /**
   * Detects backend technologies
   */
  async detectBackend(): Promise<BackendTech | undefined> {
    const packageJson = await this.readPackageJson();
    const pyproject = await this.readPyprojectToml();

    const backend: BackendTech = {};

    // Node.js backend detection
    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['express']) {
        backend.framework = 'express';
        backend.language = deps['typescript'] ? 'typescript' : 'javascript';
      } else if (deps['@nestjs/core']) {
        backend.framework = 'nestjs';
        backend.language = 'typescript';
      } else if (deps['hono']) {
        backend.framework = 'hono';
        backend.language = deps['typescript'] ? 'typescript' : 'javascript';
      } else if (deps['elysia']) {
        backend.framework = 'elysia';
        backend.language = 'typescript';
      }

      // API Style detection
      if (deps['@trpc/server']) backend.apiStyle = 'trpc';
      else if (deps['graphql'] || deps['apollo-server']) backend.apiStyle = 'graphql';
      else if (deps['@grpc/grpc-js']) backend.apiStyle = 'grpc';
      else backend.apiStyle = 'rest';

      // Validation detection
      if (deps['zod']) backend.validation = 'zod';
      else if (deps['joi']) backend.validation = 'joi';
      else if (deps['yup']) backend.validation = 'yup';
      else if (deps['class-validator']) backend.validation = 'class-validator';
    }

    // Python backend detection
    if (pyproject) {
      if (pyproject.includes('fastapi')) {
        backend.framework = 'fastapi';
        backend.language = 'python';
        backend.validation = 'pydantic';
        backend.apiStyle = 'rest';
      } else if (pyproject.includes('django')) {
        backend.framework = 'django';
        backend.language = 'python';
        backend.apiStyle = 'rest';
      } else if (pyproject.includes('flask')) {
        backend.framework = 'flask';
        backend.language = 'python';
        backend.apiStyle = 'rest';
      }
    }

    return Object.keys(backend).length > 0 ? backend : undefined;
  }

  /**
   * Detects database technologies
   */
  async detectDatabase(): Promise<DatabaseTech | undefined> {
    const packageJson = await this.readPackageJson();
    const pyproject = await this.readPyprojectToml();
    const envFile = await this.readEnvFile();

    const database: DatabaseTech = {};

    // Database detection from environment variables
    if (envFile) {
      if (envFile.includes('postgres') || envFile.includes('postgresql')) {
        database.primary = 'postgresql';
      } else if (envFile.includes('mysql')) {
        database.primary = 'mysql';
      } else if (envFile.includes('mongodb')) {
        database.primary = 'mongodb';
      } else if (envFile.includes('supabase')) {
        database.primary = 'supabase';
      }

      if (envFile.includes('redis')) {
        database.cache = 'redis';
      }
    }

    // ORM detection
    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['@prisma/client'] || deps['prisma']) {
        database.orm = 'prisma';
        database.migrations = 'prisma';
      } else if (deps['typeorm']) {
        database.orm = 'typeorm';
        database.migrations = 'typeorm';
      } else if (deps['drizzle-orm']) {
        database.orm = 'drizzle';
      } else if (deps['mongoose']) {
        database.orm = 'mongoose';
        database.primary = 'mongodb';
      } else if (deps['sequelize']) {
        database.orm = 'sequelize';
      }

      if (deps['redis'] || deps['ioredis']) {
        database.cache = 'redis';
      }
    }

    // Python ORM detection
    if (pyproject) {
      if (pyproject.includes('sqlalchemy')) {
        database.orm = 'sqlalchemy';
      }
    }

    return Object.keys(database).length > 0 ? database : undefined;
  }

  /**
   * Detects testing technologies
   */
  async detectTesting(): Promise<TestingTech | undefined> {
    const packageJson = await this.readPackageJson();
    const pyproject = await this.readPyprojectToml();

    const testing: TestingTech = {};

    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Unit testing
      if (deps['vitest']) testing.unit = 'vitest';
      else if (deps['jest']) testing.unit = 'jest';
      else if (deps['mocha']) testing.unit = 'mocha';

      // E2E testing
      if (deps['@playwright/test'] || deps['playwright']) testing.e2e = 'playwright';
      else if (deps['cypress']) testing.e2e = 'cypress';
      else if (deps['puppeteer']) testing.e2e = 'puppeteer';
      else if (deps['selenium-webdriver']) testing.e2e = 'selenium';

      // Coverage
      testing.coverage = !!(
        deps['@vitest/coverage-v8'] ||
        deps['@vitest/coverage-c8'] ||
        packageJson.scripts?.coverage
      );
    }

    if (pyproject) {
      if (pyproject.includes('pytest')) {
        testing.unit = 'pytest';
      }
    }

    return Object.keys(testing).length > 0 ? testing : undefined;
  }

  /**
   * Detects deployment technologies
   */
  async detectDeployment(): Promise<DeploymentTech | undefined> {
    const packageJson = await this.readPackageJson();
    const deployment: DeploymentTech = {};

    // Check for Vercel
    if (await pathExists(path.join(this.projectRoot, 'vercel.json'))) {
      deployment.platform = 'vercel';
    }

    // Check for Netlify
    if (await pathExists(path.join(this.projectRoot, 'netlify.toml'))) {
      deployment.platform = 'netlify';
    }

    // Check for Docker
    if (await pathExists(path.join(this.projectRoot, 'Dockerfile'))) {
      deployment.containerization = 'docker';
    }

    // Check for CI/CD
    if (await pathExists(path.join(this.projectRoot, '.github', 'workflows'))) {
      deployment.cicd = 'github-actions';
    } else if (await pathExists(path.join(this.projectRoot, '.gitlab-ci.yml'))) {
      deployment.cicd = 'gitlab-ci';
    } else if (await pathExists(path.join(this.projectRoot, '.circleci'))) {
      deployment.cicd = 'circle-ci';
    }

    // Check package.json scripts for deployment hints
    if (packageJson?.scripts) {
      const scripts = packageJson.scripts;
      if (scripts['vercel']) deployment.platform = 'vercel';
      else if (scripts['netlify']) deployment.platform = 'netlify';
      else if (scripts['railway']) deployment.platform = 'railway';
      else if (scripts['fly']) deployment.platform = 'fly-io';
    }

    return Object.keys(deployment).length > 0 ? deployment : undefined;
  }

  /**
   * Helper: Read package.json
   */
  private async readPackageJson(): Promise<PackageJson | null> {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      if (!(await pathExists(packagePath))) return null;
      return await readJsonFile<PackageJson>(packagePath);
    } catch {
      return null;
    }
  }

  /**
   * Helper: Read pyproject.toml
   */
  private async readPyprojectToml(): Promise<string | null> {
    try {
      const pyprojectPath = path.join(this.projectRoot, 'pyproject.toml');
      if (!(await pathExists(pyprojectPath))) return null;
      return await readFile(pyprojectPath);
    } catch {
      return null;
    }
  }

  /**
   * Helper: Read .env file
   */
  private async readEnvFile(): Promise<string | null> {
    try {
      const envPath = path.join(this.projectRoot, '.env');
      const envExamplePath = path.join(this.projectRoot, '.env.example');

      if (await pathExists(envPath)) {
        return await readFile(envPath);
      } else if (await pathExists(envExamplePath)) {
        return await readFile(envExamplePath);
      }
      return null;
    } catch {
      return null;
    }
  }
}
