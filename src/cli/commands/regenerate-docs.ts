import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import yaml from 'js-yaml';
import { ConfigGenerator, type AgentWeaverConfig } from '../../lib/config-generator.js';

/**
 * Regenerate documentation files (tech-stack.md) from agentweaver.config.yml
 */
export async function regenerateDocsCommand() {
  console.log(chalk.cyan.bold('\n📝 AgentWeaver Documentation Regenerator\n'));

  try {
    // Find .claude directory
    const claudeDir = findClaudeDirectory();
    if (!claudeDir) {
      console.error(
        chalk.red('\n❌ Error: .claude directory not found. Run "agentweaver init" first.\n')
      );
      process.exit(1);
    }

    // Read agentweaver.config.yml
    const configPath = path.join(claudeDir, 'agentweaver.config.yml');
    const spinner = ora('Reading agentweaver.config.yml...').start();

    if (!existsSync(configPath)) {
      spinner.fail(chalk.red('agentweaver.config.yml not found. Run "agentweaver init" first.'));
      process.exit(1);
    }

    const configContent = await readFile(configPath, 'utf-8');
    const config = yaml.load(configContent) as AgentWeaverConfig;
    spinner.succeed('Configuration loaded successfully');

    // Validate config structure
    const validateSpinner = ora('Validating configuration...').start();
    try {
      validateConfig(config);
      validateSpinner.succeed('Configuration is valid');
    } catch (error) {
      validateSpinner.fail(chalk.red(`Invalid configuration: ${(error as Error).message}`));
      process.exit(1);
    }

    // Regenerate tech-stack.md
    const regenSpinner = ora('Regenerating tech-stack.md...').start();
    const techStackPath = path.join(claudeDir, 'tech-stack.md');

    await ConfigGenerator.writeTechStackMarkdown(techStackPath, config);
    regenSpinner.succeed('tech-stack.md regenerated successfully');

    // Success message
    console.log(chalk.green.bold('\n✅ Documentation regenerated successfully!\n'));
    console.log(chalk.gray('Files updated:'));
    console.log(chalk.gray(`  └── ${path.relative(process.cwd(), techStackPath)}`));
    console.log();
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to regenerate documentation:'), (error as Error).message);
    process.exit(1);
  }
}

/**
 * Find .claude directory in current or parent directories
 */
function findClaudeDirectory(): string | null {
  let currentDir = process.cwd();
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const claudeDir = path.join(currentDir, '.claude');
    if (existsSync(claudeDir)) {
      return claudeDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Validate config structure
 */
function validateConfig(config: AgentWeaverConfig): void {
  // Project section is optional
  if (config.project && config.project.name && typeof config.project.name !== 'string') {
    throw new Error('Invalid "project.name" in configuration - must be a string');
  }

  if (!config.techStack) {
    throw new Error('Missing "techStack" section in configuration');
  }

  if (!config.techStack.mode || typeof config.techStack.mode !== 'string') {
    throw new Error('Missing or invalid "techStack.mode" in configuration');
  }

  const validModes = ['strict', 'flexible', 'adaptive'];
  if (!validModes.includes(config.techStack.mode)) {
    throw new Error(
      `Invalid techStack.mode "${config.techStack.mode}". Must be one of: ${validModes.join(', ')}`
    );
  }

  // Optional: Validate tech stack sections exist
  const requiredSections = ['frontend', 'backend', 'database', 'testing', 'deployment'];
  for (const section of requiredSections) {
    if (!config.techStack[section as keyof typeof config.techStack]) {
      console.warn(
        chalk.yellow(`⚠️  Warning: Missing "techStack.${section}" section in configuration`)
      );
    }
  }
}
