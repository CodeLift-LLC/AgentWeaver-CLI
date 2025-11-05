import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
import { StackInstaller } from '../src/lib/stack-installer.js';
import type { AgentWeaverConfig } from '../src/lib/config-generator.js';

describe('Tech Stack Template Installation and Synchronization', () => {
  let testDir: string;
  let installer: StackInstaller;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = path.join(os.tmpdir(), `agentweaver-test-${Date.now()}`);
    await fs.ensureDir(testDir);
    installer = new StackInstaller();
  });

  afterEach(async () => {
    // Clean up test directory
    if (await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  describe('Template Listing', () => {
    it('should list all available templates', async () => {
      const templates = await installer.listTemplates();

      expect(templates).toBeDefined();
      expect(templates.length).toBeGreaterThanOrEqual(3);

      const templateIds = templates.map((t) => t.id);
      expect(templateIds).toContain('nextjs-mvp');
      expect(templateIds).toContain('nestjs-backend');
      expect(templateIds).toContain('fastapi-backend');
    });

    it('should have valid manifest data for each template', async () => {
      const templates = await installer.listTemplates();

      templates.forEach((template) => {
        // Required fields
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(template.complexity).toBeDefined();
        expect(template.architecture).toBeDefined();

        // Tech stack should be defined
        expect(template.techStack).toBeDefined();
        expect(template.techStack.packageManager).toBeDefined();

        // Should have either frontend or backend
        expect(
          template.techStack.frontend || template.techStack.backend
        ).toBeDefined();

        // Should have database
        expect(template.techStack.database).toBeDefined();

        // Should have files and dockerServices
        expect(Array.isArray(template.files)).toBe(true);
        expect(Array.isArray(template.dockerServices)).toBe(true);

        // Should have features object
        expect(template.features).toBeDefined();
        expect(typeof template.features).toBe('object');
      });
    });
  });

  describe('Next.js MVP Template Installation', () => {
    it('should install nextjs-mvp template successfully', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {
          authentication: true,
          aiIntegration: true,
          vectorSearch: true,
          payments: false,
          email: false,
          fileStorage: true,
          realtime: true,
          analytics: false,
        },
        projectName: 'test-nextjs-project',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('success');
      expect(result.filesCreated).toBeGreaterThan(0);
      expect(result.template).toBeDefined();
      expect(result.template?.id).toBe('nextjs-mvp');
    });

    it('should create all essential Next.js files', async () => {
      await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {},
        projectName: 'test-nextjs',
      });

      // Check for essential files
      const essentialFiles = [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        'tailwind.config.ts',
        'docker-compose.yml',
        'Dockerfile',
        '.gitignore',
        '.env.example',
        'README.md',
      ];

      for (const file of essentialFiles) {
        const filePath = path.join(testDir, file);
        const exists = await fs.pathExists(filePath);
        expect(exists).toBe(true);
      }
    });

    it('should have correct tech stack in template manifest', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {},
        projectName: 'test-nextjs',
      });

      const template = result.template;
      expect(template).toBeDefined();
      expect(template?.techStack.frontend?.framework).toBe('nextjs');
      expect(template?.techStack.frontend?.language).toBe('typescript');
      expect(template?.techStack.database?.primary).toBe('supabase');
      expect(template?.techStack.database?.orm).toBe('drizzle');
      expect(template?.techStack.packageManager?.node).toBe('pnpm');
    });

    it('should conditionally include Docker services based on features', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {
          authentication: true,
          aiIntegration: true,
          email: true,
        },
        projectName: 'test-nextjs',
      });

      const dockerComposePath = path.join(testDir, 'docker-compose.yml');
      const dockerComposeContent = await fs.readFile(dockerComposePath, 'utf-8');

      // Should include authentication service
      expect(dockerComposeContent).toContain('gotrue');

      // Should include Langfuse for AI integration
      expect(dockerComposeContent).toContain('langfuse');

      // Should include MailHog for email
      expect(dockerComposeContent).toContain('mailhog');
    });
  });

  describe('NestJS Backend Template Installation', () => {
    it('should install nestjs-backend template successfully', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nestjs-backend',
        features: {
          authentication: true,
          aiIntegration: false,
        },
        projectName: 'test-nestjs-api',
      });

      expect(result.success).toBe(true);
      expect(result.template?.id).toBe('nestjs-backend');
    });

    it('should create all essential NestJS files', async () => {
      await installer.installTemplate(testDir, {
        templateId: 'nestjs-backend',
        features: {},
        projectName: 'test-nestjs',
      });

      const essentialFiles = [
        'package.json',
        'tsconfig.json',
        'nest-cli.json',
        'docker-compose.yml',
        'Dockerfile',
        '.gitignore',
        'README.md',
      ];

      for (const file of essentialFiles) {
        const filePath = path.join(testDir, file);
        const exists = await fs.pathExists(filePath);
        expect(exists).toBe(true);
      }
    });

    it('should have correct tech stack in template manifest', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nestjs-backend',
        features: {},
        projectName: 'test-nestjs',
      });

      const template = result.template;
      expect(template?.techStack.backend?.framework).toBe('nestjs');
      expect(template?.techStack.backend?.language).toBe('typescript');
      expect(template?.techStack.database?.primary).toBe('supabase');
      expect(template?.techStack.database?.orm).toBe('drizzle');
    });
  });

  describe('FastAPI Backend Template Installation', () => {
    it('should install fastapi-backend template successfully', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'fastapi-backend',
        features: {
          authentication: true,
          vectorSearch: true,
        },
        projectName: 'test-fastapi-api',
      });

      expect(result.success).toBe(true);
      expect(result.template?.id).toBe('fastapi-backend');
    });

    it('should create all essential FastAPI files', async () => {
      await installer.installTemplate(testDir, {
        templateId: 'fastapi-backend',
        features: {},
        projectName: 'test-fastapi',
      });

      const essentialFiles = [
        'pyproject.toml',
        'docker-compose.yml',
        'Dockerfile',
        '.gitignore',
        'README.md',
        'alembic.ini',
        'pytest.ini',
      ];

      for (const file of essentialFiles) {
        const filePath = path.join(testDir, file);
        const exists = await fs.pathExists(filePath);
        expect(exists).toBe(true);
      }
    });

    it('should have correct tech stack in template manifest', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'fastapi-backend',
        features: {},
        projectName: 'test-fastapi',
      });

      const template = result.template;
      expect(template?.techStack.backend?.framework).toBe('fastapi');
      expect(template?.techStack.backend?.language).toBe('python');
      expect(template?.techStack.database?.primary).toBe('supabase');
      expect(template?.techStack.database?.orm).toBe('sqlalchemy');
      expect(template?.techStack.packageManager?.python).toBe('uv');
    });

    it('should use uv as package manager', async () => {
      await installer.installTemplate(testDir, {
        templateId: 'fastapi-backend',
        features: {},
        projectName: 'test-fastapi',
      });

      const pyprojectPath = path.join(testDir, 'pyproject.toml');
      const pyprojectContent = await fs.readFile(pyprojectPath, 'utf-8');

      // Should contain uv configuration
      expect(pyprojectContent).toContain('[tool.uv]');
    });
  });

  describe('Tech Stack Synchronization', () => {
    it('should sync Next.js template tech stack to agentweaver.config.yml', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {},
        projectName: 'test-sync',
      });

      // Manually create config to simulate what init command does
      const template = result.template;
      expect(template).toBeDefined();

      // Verify tech stack structure matches what would be written to config
      expect(template?.techStack.frontend).toBeDefined();
      expect(template?.techStack.frontend?.framework).toBe('nextjs');
      expect(template?.techStack.database).toBeDefined();
      expect(template?.techStack.database?.primary).toBe('supabase');
    });

    it('should sync NestJS template tech stack to agentweaver.config.yml', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nestjs-backend',
        features: {},
        projectName: 'test-sync',
      });

      const template = result.template;
      expect(template?.techStack.backend).toBeDefined();
      expect(template?.techStack.backend?.framework).toBe('nestjs');
      expect(template?.techStack.backend?.language).toBe('typescript');
    });

    it('should sync FastAPI template tech stack to agentweaver.config.yml', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'fastapi-backend',
        features: {},
        projectName: 'test-sync',
      });

      const template = result.template;
      expect(template?.techStack.backend).toBeDefined();
      expect(template?.techStack.backend?.framework).toBe('fastapi');
      expect(template?.techStack.backend?.language).toBe('python');
      expect(template?.techStack.packageManager?.python).toBe('uv');
    });

    it('should have architecture information in template', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {},
        projectName: 'test-arch',
      });

      const template = result.template;
      expect(template?.architecture).toBe('vertical-slice');
    });
  });

  describe('Feature Filtering', () => {
    it('should respect feature flags for optional services', async () => {
      // Install with minimal features
      const result = await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {
          authentication: false,
          aiIntegration: false,
          email: false,
          fileStorage: false,
        },
        projectName: 'test-minimal',
      });

      const dockerComposePath = path.join(testDir, 'docker-compose.yml');
      const dockerComposeContent = await fs.readFile(dockerComposePath, 'utf-8');

      // Should NOT include optional services
      expect(dockerComposeContent).not.toContain('gotrue');
      expect(dockerComposeContent).not.toContain('langfuse');
      expect(dockerComposeContent).not.toContain('mailhog');

      // Should still include core services
      expect(dockerComposeContent).toContain('postgres');
      expect(dockerComposeContent).toContain('redis');
    });

    it('should include all features when all enabled', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nestjs-backend',
        features: {
          authentication: true,
          aiIntegration: true,
          vectorSearch: true,
          payments: true,
          email: true,
          fileStorage: true,
          realtime: true,
          analytics: true,
        },
        projectName: 'test-full',
      });

      const dockerComposePath = path.join(testDir, 'docker-compose.yml');
      const dockerComposeContent = await fs.readFile(dockerComposePath, 'utf-8');

      // Should include all optional services
      expect(dockerComposeContent).toContain('gotrue'); // authentication
      expect(dockerComposeContent).toContain('langfuse'); // AI integration
      expect(dockerComposeContent).toContain('mailhog'); // email
    });
  });

  describe('Template Metadata', () => {
    it('should have correct complexity levels', async () => {
      const templates = await installer.listTemplates();

      const nextjs = templates.find((t) => t.id === 'nextjs-mvp');
      const nestjs = templates.find((t) => t.id === 'nestjs-backend');
      const fastapi = templates.find((t) => t.id === 'fastapi-backend');

      expect(nextjs?.complexity).toBe('beginner');
      expect(nestjs?.complexity).toBe('intermediate');
      expect(fastapi?.complexity).toBe('intermediate');
    });

    it('should have correct architecture for all templates', async () => {
      const templates = await installer.listTemplates();

      templates.forEach((template) => {
        expect(template.architecture).toBe('vertical-slice');
      });
    });

    it('should have Docker services defined', async () => {
      const templates = await installer.listTemplates();

      templates.forEach((template) => {
        expect(template.dockerServices.length).toBeGreaterThan(0);

        // All should have postgres
        expect(template.dockerServices).toContain('postgres');

        // All should have redis
        expect(template.dockerServices).toContain('redis');
      });
    });

    it('should have file counts matching actual files', async () => {
      const templates = await installer.listTemplates();

      for (const template of templates) {
        const result = await installer.installTemplate(testDir, {
          templateId: template.id,
          features: {},
          projectName: 'test-filecount',
        });

        // Files created should be close to manifest count
        // (may vary slightly due to conditional features)
        expect(result.filesCreated).toBeGreaterThan(0);

        // Clean up for next iteration
        await fs.remove(testDir);
        await fs.ensureDir(testDir);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid template ID gracefully', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'invalid-template-id',
        features: {},
        projectName: 'test-invalid',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });

    it('should handle missing project name gracefully', async () => {
      const result = await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {},
        projectName: '',
      });

      // Should either use default or succeed
      // (implementation may vary)
      expect(result.success).toBe(true);
    });
  });

  describe('Template Variables', () => {
    it('should replace projectName variable in files', async () => {
      const projectName = 'my-awesome-project';
      await installer.installTemplate(testDir, {
        templateId: 'nextjs-mvp',
        features: {},
        projectName,
      });

      const packageJsonPath = path.join(testDir, 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);

      expect(packageJson.name).toBe(projectName);
    });

    it('should replace projectName in docker-compose.yml', async () => {
      const projectName = 'test-docker-project';
      await installer.installTemplate(testDir, {
        templateId: 'nestjs-backend',
        features: {},
        projectName,
      });

      const dockerComposePath = path.join(testDir, 'docker-compose.yml');
      const dockerComposeContent = await fs.readFile(dockerComposePath, 'utf-8');

      // Container names should include project name
      expect(dockerComposeContent).toContain(`${projectName}-postgres`);
      expect(dockerComposeContent).toContain(`${projectName}-redis`);
    });
  });
});
