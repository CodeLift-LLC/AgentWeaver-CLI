import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { StackInstaller } from '../src/lib/stack-installer.js';

describe('Stack Templates Installation', () => {
  let testDir: string;
  let installer: StackInstaller;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `agentweaver-test-${Date.now()}`);
    await fs.ensureDir(testDir);
    installer = new StackInstaller();
  });

  afterEach(async () => {
    if (await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  it('should list all available templates', async () => {
    const templates = await installer.listTemplates();

    expect(templates).toBeDefined();
    expect(templates.length).toBeGreaterThanOrEqual(3);

    const templateIds = templates.map((t) => t.id);
    expect(templateIds).toContain('nextjs-mvp');
    expect(templateIds).toContain('nestjs-backend');
    expect(templateIds).toContain('fastapi-backend');
  });

  it('should have valid manifest for nextjs-mvp', async () => {
    const templates = await installer.listTemplates();
    const nextjs = templates.find((t) => t.id === 'nextjs-mvp');

    expect(nextjs).toBeDefined();
    expect(nextjs?.name).toBe('Next.js Full-Stack MVP');
    expect(nextjs?.techStack.frontend?.framework).toBe('nextjs');
    expect(nextjs?.techStack.database?.primary).toBe('supabase');
  });

  it('should install nextjs-mvp template', async () => {
    const result = await installer.installTemplate('nextjs-mvp', testDir, {
      projectName: 'test-project',
      projectPath: testDir,
      selectedFeatures: {},
      environmentVariables: {},
    });

    if (!result.success && result.errors.length > 0) {
      console.log('Installation errors:', result.errors);
    }

    expect(result.success).toBe(true);
    expect(result.filesCreated.length).toBeGreaterThan(0);
    expect(result.template?.id).toBe('nextjs-mvp');

    // Verify essential files exist
    expect(await fs.pathExists(path.join(testDir, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'tsconfig.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'docker-compose.yml'))).toBe(true);
  });

  it('should install nestjs-backend template', async () => {
    const result = await installer.installTemplate('nestjs-backend', testDir, {
      projectName: 'test-nestjs',
      projectPath: testDir,
      selectedFeatures: {},
      environmentVariables: {},
    });

    expect(result.success).toBe(true);
    expect(result.template?.techStack.backend?.framework).toBe('nestjs');

    // Verify essential files exist
    expect(await fs.pathExists(path.join(testDir, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'nest-cli.json'))).toBe(true);
  });

  it('should install fastapi-backend template', async () => {
    const result = await installer.installTemplate('fastapi-backend', testDir, {
      projectName: 'test-fastapi',
      projectPath: testDir,
      selectedFeatures: {},
      environmentVariables: {},
    });

    expect(result.success).toBe(true);
    expect(result.template?.techStack.backend?.framework).toBe('fastapi');
    expect(result.template?.techStack.packageManager?.python).toBe('uv');

    // Verify essential files exist
    expect(await fs.pathExists(path.join(testDir, 'pyproject.toml'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'alembic.ini'))).toBe(true);
  });

  it('should have correct tech stack in template manifests', async () => {
    const templates = await installer.listTemplates();

    const nextjs = templates.find((t) => t.id === 'nextjs-mvp');
    const nestjs = templates.find((t) => t.id === 'nestjs-backend');
    const fastapi = templates.find((t) => t.id === 'fastapi-backend');

    // Next.js assertions
    expect(nextjs?.techStack.frontend?.framework).toBe('nextjs');
    expect(nextjs?.techStack.frontend?.language).toBe('typescript');
    expect(nextjs?.techStack.database?.orm).toBe('drizzle');

    // NestJS assertions
    expect(nestjs?.techStack.backend?.framework).toBe('nestjs');
    expect(nestjs?.techStack.backend?.language).toBe('typescript');
    expect(nestjs?.techStack.database?.orm).toBe('drizzle');

    // FastAPI assertions
    expect(fastapi?.techStack.backend?.framework).toBe('fastapi');
    expect(fastapi?.techStack.backend?.language).toBe('python');
    expect(fastapi?.techStack.database?.orm).toBe('sqlalchemy');
  });

  it('should filter Docker services based on features', async () => {
    const result = await installer.installTemplate('nextjs-mvp', testDir, {
      projectName: 'test-features',
      projectPath: testDir,
      selectedFeatures: {
        authentication: true,
        aiIntegration: true,
        email: false,
      },
      environmentVariables: {},
    });

    const dockerComposePath = path.join(testDir, 'docker-compose.yml');
    const dockerComposeContent = await fs.readFile(dockerComposePath, 'utf-8');

    // Should include selected features
    expect(dockerComposeContent).toContain('gotrue'); // authentication
    expect(dockerComposeContent).toContain('langfuse'); // AI integration

    // Should NOT include disabled features
    expect(dockerComposeContent).not.toContain('mailhog'); // email disabled
  });

  it('should replace projectName variable', async () => {
    const projectName = 'my-test-project';

    await installer.installTemplate('nextjs-mvp', testDir, {
      projectName,
      projectPath: testDir,
      selectedFeatures: {},
      environmentVariables: {},
    });

    const packageJsonPath = path.join(testDir, 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    expect(packageJson.name).toBe(projectName);
  });

  it('should handle invalid template gracefully', async () => {
    const result = await installer.installTemplate('invalid-template', testDir, {
      projectName: 'test',
      projectPath: testDir,
      selectedFeatures: {},
      environmentVariables: {},
    });

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
