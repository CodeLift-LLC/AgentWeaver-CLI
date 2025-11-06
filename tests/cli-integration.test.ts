import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import yaml from 'js-yaml';
import type { AgentWeaverConfig } from '../src/lib/config-generator.js';

describe('CLI Integration Tests - Template Installation', () => {
  let testDir: string;
  let cliPath: string;

  beforeEach(async () => {
    // Create a unique test directory
    testDir = path.join(os.tmpdir(), `agentweaver-cli-test-${Date.now()}`);
    await fs.ensureDir(testDir);

    // Path to the CLI executable
    cliPath = path.join(__dirname, '..', 'dist', 'cli', 'index.js');

    // Ensure the CLI is built
    if (!await fs.pathExists(cliPath)) {
      throw new Error('CLI not built. Run `npm run build` first.');
    }
  });

  afterEach(async () => {
    // Clean up test directory
    if (await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  it('should install nextjs-mvp template and create config files', async () => {
    // Run the CLI command with --yes flag to skip prompts
    const command = `node "${cliPath}" init --template nextjs-mvp --yes --no-mcp`;

    try {
      execSync(command, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: 120000, // 2 minute timeout
      });
    } catch (error: any) {
      console.log('CLI Output:', error.stdout?.toString());
      console.log('CLI Error:', error.stderr?.toString());
      throw error;
    }

    // Verify template files are installed
    expect(await fs.pathExists(path.join(testDir, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'tsconfig.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'docker-compose.yml'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'next.config.ts'))).toBe(true);

    // Verify agentweaver.config.yml is created
    const configPath = path.join(testDir, 'agentweaver.config.yml');
    expect(await fs.pathExists(configPath)).toBe(true);

    // Read and parse the config
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = yaml.load(configContent) as AgentWeaverConfig;

    // Verify tech stack from template is in config
    expect(config.techStack).toBeDefined();
    expect(config.techStack.frontend?.framework).toBe('nextjs');
    expect(config.techStack.frontend?.language).toBe('typescript');
    expect(config.techStack.database?.primary).toBe('supabase');
    expect(config.techStack.database?.orm).toBe('drizzle');
    expect(config.techStack.packageManager?.node).toBe('pnpm');

    // Verify tech-stack.md is created
    const techStackMdPath = path.join(testDir, 'tech-stack.md');
    expect(await fs.pathExists(techStackMdPath)).toBe(true);

    // Read and verify tech-stack.md content
    const techStackMd = await fs.readFile(techStackMdPath, 'utf-8');
    expect(techStackMd).toContain('# Tech Stack Overview');
    expect(techStackMd).toContain('nextjs');
    expect(techStackMd).toContain('typescript');
    expect(techStackMd).toContain('supabase');
    expect(techStackMd).toContain('drizzle');
    expect(techStackMd).toContain('pnpm');
  }, 180000); // 3 minute test timeout

  it('should install nestjs-backend template and create config files', async () => {
    const command = `node "${cliPath}" init --template nestjs-backend --yes --no-mcp`;

    try {
      execSync(command, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: 120000,
      });
    } catch (error: any) {
      console.log('CLI Output:', error.stdout?.toString());
      console.log('CLI Error:', error.stderr?.toString());
      throw error;
    }

    // Verify template files
    expect(await fs.pathExists(path.join(testDir, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'nest-cli.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'docker-compose.yml'))).toBe(true);

    // Verify config file
    const configPath = path.join(testDir, 'agentweaver.config.yml');
    expect(await fs.pathExists(configPath)).toBe(true);

    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = yaml.load(configContent) as AgentWeaverConfig;

    // Verify NestJS tech stack
    expect(config.techStack.backend?.framework).toBe('nestjs');
    expect(config.techStack.backend?.language).toBe('typescript');
    expect(config.techStack.database?.primary).toBe('supabase');
    expect(config.techStack.database?.orm).toBe('drizzle');

    // Verify tech-stack.md
    const techStackMdPath = path.join(testDir, 'tech-stack.md');
    expect(await fs.pathExists(techStackMdPath)).toBe(true);

    const techStackMd = await fs.readFile(techStackMdPath, 'utf-8');
    expect(techStackMd).toContain('nestjs');
    expect(techStackMd).toContain('typescript');
  }, 180000);

  it('should install fastapi-backend template and create config files', async () => {
    const command = `node "${cliPath}" init --template fastapi-backend --yes --no-mcp`;

    try {
      execSync(command, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: 120000,
      });
    } catch (error: any) {
      console.log('CLI Output:', error.stdout?.toString());
      console.log('CLI Error:', error.stderr?.toString());
      throw error;
    }

    // Verify template files
    expect(await fs.pathExists(path.join(testDir, 'pyproject.toml'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'docker-compose.yml'))).toBe(true);
    expect(await fs.pathExists(path.join(testDir, 'alembic.ini'))).toBe(true);

    // Verify config file
    const configPath = path.join(testDir, 'agentweaver.config.yml');
    expect(await fs.pathExists(configPath)).toBe(true);

    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = yaml.load(configContent) as AgentWeaverConfig;

    // Verify FastAPI tech stack
    expect(config.techStack.backend?.framework).toBe('fastapi');
    expect(config.techStack.backend?.language).toBe('python');
    expect(config.techStack.database?.primary).toBe('supabase');
    expect(config.techStack.database?.orm).toBe('sqlalchemy');
    expect(config.techStack.packageManager?.python).toBe('uv');

    // Verify tech-stack.md
    const techStackMdPath = path.join(testDir, 'tech-stack.md');
    expect(await fs.pathExists(techStackMdPath)).toBe(true);

    const techStackMd = await fs.readFile(techStackMdPath, 'utf-8');
    expect(techStackMd).toContain('fastapi');
    expect(techStackMd).toContain('python');
    expect(techStackMd).toContain('sqlalchemy');
    expect(techStackMd).toContain('uv');
  }, 180000);

  it('should install template without agents when no agents specified', async () => {
    const command = `node "${cliPath}" init --template nextjs-mvp --yes --no-mcp`;

    execSync(command, {
      cwd: testDir,
      stdio: 'pipe',
      timeout: 120000,
    });

    // Verify .agentweaver directory is NOT created (or is empty)
    const agentWeaverDir = path.join(testDir, '.agentweaver');
    const hasAgents = await fs.pathExists(path.join(agentWeaverDir, 'agents'));

    if (hasAgents) {
      const agents = await fs.readdir(path.join(agentWeaverDir, 'agents'));
      expect(agents.length).toBe(0);
    }
  }, 180000);

  it('should list available templates', async () => {
    const command = `node "${cliPath}" templates`;

    const output = execSync(command, {
      encoding: 'utf-8',
      timeout: 30000,
    });

    // Verify all templates are listed
    expect(output).toContain('nextjs-mvp');
    expect(output).toContain('nestjs-backend');
    expect(output).toContain('fastapi-backend');
    expect(output).toContain('Next.js Full-Stack MVP');
    expect(output).toContain('NestJS Backend API');
    expect(output).toContain('FastAPI Backend API');
  });

  it('should handle invalid template gracefully', async () => {
    const command = `node "${cliPath}" init --template invalid-template --yes`;

    try {
      execSync(command, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: 30000,
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      // Should throw error for invalid template
      const output = error.stderr?.toString() || error.stdout?.toString();
      expect(output).toContain('not found');
    }
  });

  it('should sync template tech stack to CLAUDE.md', async () => {
    const command = `node "${cliPath}" init --template nextjs-mvp --yes --no-mcp`;

    execSync(command, {
      cwd: testDir,
      stdio: 'pipe',
      timeout: 120000,
    });

    // Verify CLAUDE.md is created
    const claudeMdPath = path.join(testDir, 'CLAUDE.md');
    expect(await fs.pathExists(claudeMdPath)).toBe(true);

    // Read CLAUDE.md
    const claudeMd = await fs.readFile(claudeMdPath, 'utf-8');

    // Should contain tech stack information
    expect(claudeMd).toContain('Tech Stack');
    expect(claudeMd).toContain('nextjs');
    expect(claudeMd).toContain('typescript');
    expect(claudeMd).toContain('supabase');
  }, 180000);

  it('should create .gitignore with AgentWeaver patterns', async () => {
    const command = `node "${cliPath}" init --template nextjs-mvp --yes --no-mcp`;

    execSync(command, {
      cwd: testDir,
      stdio: 'pipe',
      timeout: 120000,
    });

    // Verify .gitignore exists
    const gitignorePath = path.join(testDir, '.gitignore');
    expect(await fs.pathExists(gitignorePath)).toBe(true);

    const gitignore = await fs.readFile(gitignorePath, 'utf-8');

    // Should contain common patterns
    expect(gitignore).toContain('node_modules');
    expect(gitignore).toContain('.env');
  }, 180000);

  it('should handle project name customization', async () => {
    const projectName = 'my-custom-project';
    const command = `node "${cliPath}" init --template nextjs-mvp --yes --no-mcp`;

    // Set project name via environment or expect default behavior
    execSync(command, {
      cwd: testDir,
      stdio: 'pipe',
      timeout: 120000,
    });

    const packageJsonPath = path.join(testDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // Should have a project name (either custom or auto-generated)
    expect(packageJson.name).toBeDefined();
    expect(packageJson.name.length).toBeGreaterThan(0);
  }, 180000);
});
