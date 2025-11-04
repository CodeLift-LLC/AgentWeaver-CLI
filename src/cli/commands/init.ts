import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { AgentInstaller } from '../../lib/agent-installer.js';
import { SkillsInstaller } from '../../lib/skills-installer.js';
import { EnhancedTechDetector } from '../../lib/enhanced-tech-detector.js';
import { ConfigGenerator } from '../../lib/config-generator.js';
import { getTemplatesDirectory, pathExists, readFile } from '../../utils/file-operations.js';

/**
 * Get project name from package.json or directory name
 */
async function getProjectName(projectRoot: string): Promise<string> {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (await pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await readFile(packageJsonPath));
      if (packageJson.name) {
        return packageJson.name;
      }
    }
  } catch (error) {
    // Fallback to directory name
  }
  return path.basename(projectRoot);
}

interface InitOptions {
  yes?: boolean;
  agents?: string;
  skills?: string;
  mcp?: boolean;
  mode?: 'strict' | 'flexible' | 'adaptive';
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.cyan.bold('\n🚀 AgentWeaver CLI - Setup Wizard\n'));

  const projectRoot = process.cwd();
  const claudeDir = path.join(projectRoot, '.claude');
  const agentsDir = path.join(claudeDir, 'agents');
  const skillsDir = path.join(claudeDir, 'skills');

  // Check if .claude directory already exists
  if (await pathExists(claudeDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: chalk.yellow('.claude directory already exists. Overwrite?'),
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('\n✋ Setup cancelled.'));
      return;
    }
  }

  try {
    // Step 1: Detect tech stack (using enhanced detector)
    const spinner = ora('Detecting project tech stack...').start();
    const enhancedDetector = new EnhancedTechDetector(projectRoot);
    const enhancedTech = await enhancedDetector.detectAll();
    spinner.succeed('Tech stack detected');

    // Display detected technologies
    console.log(chalk.gray('\n📊 Detected Technologies:'));

    // Show architecture info
    if (enhancedTech.architecture) {
      console.log(chalk.cyan(`  Architecture: ${enhancedTech.architecture.type} (${enhancedTech.architecture.style})`));
      if (enhancedTech.architecture.workspaceTool) {
        console.log(chalk.gray(`  Monorepo: ${enhancedTech.architecture.workspaceTool}`));
      }
    }

    // Show all detected projects
    if (enhancedTech.projects.length > 0) {
      console.log(chalk.cyan(`\n  Detected ${enhancedTech.projects.length} project(s):`));
      enhancedTech.projects.forEach((project, idx) => {
        const frameworkInfo = project.framework ? ` (${project.framework})` : '';
        console.log(chalk.gray(`    ${idx + 1}. ${project.language}${frameworkInfo} - ${(project.confidence * 100).toFixed(0)}% confidence`));
      });
    }

    // Legacy display for backward compatibility
    if (enhancedTech.frontend?.framework) {
      console.log(chalk.gray(`\n  Frontend: ${enhancedTech.frontend.framework}`));
    }
    if (enhancedTech.backend?.framework) {
      console.log(chalk.gray(`  Backend: ${enhancedTech.backend.framework} (${enhancedTech.backend.language})`));
    }
    if (enhancedTech.database?.primary) {
      console.log(chalk.gray(`  Database: ${enhancedTech.database.primary}`));
    }
    console.log('');

    // Use legacy format for config generation (backward compatibility)
    const detectedTech = {
      frontend: enhancedTech.frontend,
      backend: enhancedTech.backend,
      database: enhancedTech.database,
      testing: enhancedTech.testing,
      deployment: enhancedTech.deployment,
    };

    // Step 2: Agent selection
    let selectedAgents: string[] = [];
    if (options.agents) {
      selectedAgents = options.agents.split(',').map((a) => a.trim());
    } else if (options.yes) {
      // Default to development agents for --yes flag
      selectedAgents = [
        'backend-dev',
        'frontend-dev',
        'qa-tester',
        'tech-lead',
        'devops',
        'docs-writer',
        'debugger',
        'ui-ux-dev',
      ];
    } else if (!options.yes) {
      const { agentChoice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'agentChoice',
          message: 'Which agents would you like to install?',
          choices: [
            { name: '✨ All agents (21 total agents)', value: 'all' },
            { name: '👨‍💻 Development agents only (8 agents)', value: 'dev' },
            { name: '🎯 Custom selection', value: 'custom' },
          ],
          default: 'dev',
        },
      ]);

      if (agentChoice === 'custom') {
        const templatesDir = getTemplatesDirectory();
        const agentInstaller = new AgentInstaller(path.join(templatesDir, 'agents'));
        const availableAgents = await agentInstaller.listAvailableAgents();

        const { agents } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'agents',
            message: 'Select agents to install:',
            choices: availableAgents.map((agent) => ({
              name: `${agent.name} - ${agent.frontmatter.description.split('.')[0]}`,
              value: agent.name,
              checked: true,
            })),
          },
        ]);
        selectedAgents = agents;
      } else if (agentChoice === 'dev') {
        selectedAgents = [
          'backend-dev',
          'frontend-dev',
          'qa-tester',
          'tech-lead',
          'devops',
          'docs-writer',
          'debugger',
          'ui-ux-dev',
        ];
      } else {
        selectedAgents = []; // All agents
      }
    }

    // Step 3: Skills selection
    let selectedSkills: string[] = [];
    if (options.skills) {
      selectedSkills = options.skills.split(',').map((s) => s.trim());
    } else if (options.yes) {
      // Default to all skills for --yes flag
      selectedSkills = [];
    } else if (!options.yes) {
      const { installSkills } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'installSkills',
          message: 'Install reusable skills library?',
          default: true,
        },
      ]);

      if (installSkills) {
        selectedSkills = []; // Install all skills
      }
    }

    // Step 4: MCP configuration
    let mcpServers: string[] = [];
    if (options.mcp !== false && !options.yes) {
      const { configureMcp } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'configureMcp',
          message: 'Configure MCP servers (.mcp.json)?',
          default: true,
        },
      ]);

      if (configureMcp) {
        const { servers } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'servers',
            message: 'Select MCP servers to configure:',
            choices: [
              { name: 'GitHub (repository operations)', value: 'github', checked: true },
              { name: 'Fetch (web content fetching)', value: 'fetch', checked: true },
              { name: 'Context7 (documentation lookup)', value: 'context7', checked: true },
              {
                name: 'Sequential Thinking (complex analysis)',
                value: 'sequential',
                checked: true,
              },
              { name: 'Playwright (E2E testing)', value: 'playwright', checked: false },
              { name: 'shadcn/ui (UI components)', value: 'shadcn', checked: false },
              { name: 'Socket (security scanning)', value: 'socket', checked: false },
              { name: 'Supabase (database)', value: 'supabase', checked: false },
            ],
          },
        ]);
        mcpServers = servers;
      }
    } else if (options.mcp !== false && options.yes) {
      // Default MCP servers for --yes flag
      mcpServers = ['github', 'fetch', 'context7', 'sequential'];
    }

    // Step 5: Tech stack mode
    let techMode: 'strict' | 'flexible' | 'adaptive' = options.mode || 'flexible';
    if (!options.yes && !options.mode) {
      const { mode } = await inquirer.prompt([
        {
          type: 'list',
          name: 'mode',
          message: 'Tech stack mode:',
          choices: [
            {
              name: 'Flexible - Prefer detected stack, allow alternatives (recommended)',
              value: 'flexible',
            },
            { name: 'Strict - Enforce detected stack only', value: 'strict' },
            { name: 'Adaptive - Auto-detect and adapt', value: 'adaptive' },
          ],
          default: 'flexible',
        },
      ]);
      techMode = mode;
    }

    // Step 6: Install agents
    console.log(chalk.cyan('\n📦 Installing components...\n'));

    const templatesDir = getTemplatesDirectory();
    const agentInstaller = new AgentInstaller(path.join(templatesDir, 'agents'));

    const agentSpinner = ora('Installing agents...').start();
    const agentResult = await agentInstaller.installAgents({
      targetDirectory: agentsDir,
      agentsToInstall: selectedAgents.length > 0 ? selectedAgents : undefined,
      overwrite: true,
    });

    if (agentResult.errors.length > 0) {
      agentSpinner.fail(`Agent installation completed with errors`);
      agentResult.errors.forEach((err) => {
        console.log(chalk.red(`  ✗ ${err.agent}: ${err.error}`));
      });
    } else {
      agentSpinner.succeed(`Installed ${agentResult.installed.length} agents`);
    }

    // Step 7: Install skills with template pack resolution
    let skillResult: any = { installed: [], templatePacksUsed: [] };
    if (selectedSkills.length > 0 || (!options.skills && !options.yes) || (options.yes && selectedSkills.length === 0)) {
      const skillsInstaller = new SkillsInstaller(path.join(templatesDir, 'skills'));
      const skillSpinner = ora('Installing skills with template resolution...').start();

      // Create tech stack context from detected tech
      const primaryProject = enhancedTech.projects.length > 0 ? enhancedTech.projects[0] : null;
      const techStackContext = primaryProject
        ? {
            techStack: {
              language: primaryProject.language,
              framework: primaryProject.framework,
              version: primaryProject.version,
              buildTool: primaryProject.buildTool,
              dependencies: primaryProject.dependencies,
            },
            project: {
              name: await getProjectName(projectRoot),
              path: projectRoot,
              architecture: enhancedTech.architecture?.type,
            },
          }
        : undefined;

      skillResult = await skillsInstaller.installSkills({
        targetDirectory: skillsDir,
        skillsToInstall: selectedSkills.length > 0 ? selectedSkills : undefined,
        overwrite: true,
        techStackContext,
        projectRoot,
      });

      if (skillResult.errors.length > 0) {
        skillSpinner.fail(`Skill installation completed with errors`);
        skillResult.errors.forEach((err: any) => {
          console.log(chalk.red(`  ✗ ${err.skill}: ${err.error}`));
        });
      } else {
        skillSpinner.succeed(`Installed ${skillResult.installed.length} skills`);

        // Show template packs used
        if (skillResult.templatePacksUsed && skillResult.templatePacksUsed.length > 0) {
          console.log(chalk.gray('\n  Template packs selected:'));
          skillResult.templatePacksUsed.forEach((tpu: any) => {
            console.log(
              chalk.gray(`    ${tpu.skill}: ${tpu.templatePack} (${(tpu.score * 100).toFixed(0)}% match)`)
            );
          });
        }
      }
    }

    // Step 8: Generate configurations
    if (mcpServers.length > 0) {
      const mcpSpinner = ora('Generating MCP configuration...').start();
      const mcpConfig = ConfigGenerator.generateMcpConfig({
        includeGithub: mcpServers.includes('github'),
        includeFetch: mcpServers.includes('fetch'),
        includeContext7: mcpServers.includes('context7'),
        includeSequential: mcpServers.includes('sequential'),
        includePlaywright: mcpServers.includes('playwright'),
        includeShadcn: mcpServers.includes('shadcn'),
        includeSocket: mcpServers.includes('socket'),
        includeSupabase: mcpServers.includes('supabase'),
      });

      await ConfigGenerator.writeMcpConfig(path.join(projectRoot, '.mcp.json'), mcpConfig);
      mcpSpinner.succeed('Generated .mcp.json');

      // Generate .env.example (keep at project root for visibility)
      const envExample = ConfigGenerator.generateEnvExample(mcpConfig);
      const { writeFile: writeFileUtil } = await import('../../utils/file-operations.js');
      await writeFileUtil(path.join(projectRoot, '.env.example'), envExample);
    }

    const configSpinner = ora('Generating AgentWeaver configuration...').start();
    const agentWeaverConfig = ConfigGenerator.generateAgentWeaverConfig(detectedTech, techMode);
    await ConfigGenerator.writeAgentWeaverConfig(
      path.join(claudeDir, 'agentweaver.config.yml'),
      agentWeaverConfig
    );
    configSpinner.succeed('Generated .claude/agentweaver.config.yml');

    // Generate CLAUDE.md
    const claudeMdSpinner = ora('Generating CLAUDE.md...').start();
    const installedAgentNames = agentResult.installed.map((agent: any) => agent.name);
    const installedSkillDirNames = skillResult.installed.map((skill: any) => skill.dirName);

    // Get project name from package.json or directory name
    const projectName = await getProjectName(projectRoot);

    const claudeMdContent = await ConfigGenerator.generateClaudeMd(
      projectName,
      detectedTech,
      installedAgentNames,
      installedSkillDirNames
    );
    await ConfigGenerator.writeClaudeMd(path.join(claudeDir, 'CLAUDE.md'), claudeMdContent);
    claudeMdSpinner.succeed('Generated .claude/CLAUDE.md');

    // Copy WORKFLOWS.md to .claude directory
    await ConfigGenerator.copyWorkflowsFile(claudeDir);

    // Success message
    console.log(chalk.green.bold('\n✅ Installation complete!\n'));

    console.log(chalk.cyan('📁 Created:'));
    console.log(chalk.gray(`  .claude/`));
    console.log(chalk.gray(`  ├── agents/                (${agentResult.installed.length} agents)`));
    if (skillResult.installed.length > 0) {
      console.log(chalk.gray(`  ├── skills/                (${skillResult.installed.length} skills)`));
    }
    console.log(chalk.gray(`  ├── CLAUDE.md              (Project context)`));
    console.log(chalk.gray(`  ├── WORKFLOWS.md           (Agent workflows)`));
    console.log(chalk.gray(`  └── agentweaver.config.yml (Tech stack)`));
    if (mcpServers.length > 0) {
      console.log(chalk.gray(`  .mcp.json                  (MCP servers at root)`));
      console.log(chalk.gray(`  .env.example               (Environment variables)`));
    }

    console.log(chalk.cyan('\n🎯 Next steps:\n'));
    if (mcpServers.length > 0) {
      console.log(chalk.white('  1. Copy .env.example to .env and fill in your credentials:'));
      if (mcpServers.includes('github')) {
        console.log(chalk.gray('     - GITHUB_TOKEN (from https://github.com/settings/tokens)'));
      }
      if (mcpServers.includes('supabase')) {
        console.log(chalk.gray('     - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'));
      }
      console.log('');
    }
    console.log(chalk.white('  2. Restart Claude Code to load the new agents'));
    console.log('');
    console.log(chalk.white('  3. Open .claude/CLAUDE.md to see all available agents and their usage'));
    console.log('');
    console.log(chalk.white('  4. Start using your agents:'));
    console.log(chalk.gray('     "Build a REST API for users"  (automatic invocation)'));
    console.log(chalk.gray('     @backend-dev implement authentication  (manual invocation)'));
    console.log('');
    console.log(chalk.cyan('📚 Documentation: https://github.com/CodeLift-LLC/AgentWeaver-CLI'));
    console.log('');
  } catch (error) {
    console.error(chalk.red('\n❌ Installation failed:'), (error as Error).message);
    process.exit(1);
  }
}
