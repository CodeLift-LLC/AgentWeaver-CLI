#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { validateCommand } from './commands/validate.js';
import { regenerateDocsCommand } from './commands/regenerate-docs.js';
import { templatesCommand } from './commands/templates.js';

const program = new Command();

program
  .name('agentweaver')
  .description(
    'CLI tool for bootstrapping projects with tech stack templates, AI agents, and reusable skills'
  )
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('Initialize AgentWeaver in your project (with optional tech stack template)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option(
    '--template <template>',
    'Tech stack template to use (e.g., nextjs-mvp, nestjs-backend, fastapi-backend)'
  )
  .option(
    '--agents <agents>',
    'Comma-separated list of agents to install (e.g., backend-dev,frontend-dev)'
  )
  .option('--skills <skills>', 'Comma-separated list of skills to install')
  .option('--no-mcp', 'Skip MCP server configuration')
  .option('--mode <mode>', 'Tech stack mode: strict, flexible, or adaptive', 'flexible')
  .action(initCommand);

// Templates command
program
  .command('templates')
  .description('List available tech stack templates')
  .action(templatesCommand);

// Validate command
program
  .command('validate')
  .description('Validate template packs for correctness')
  .option('--skill <skill>', 'Validate template packs for a specific skill')
  .option('--pack <pack>', 'Validate a specific template pack directory')
  .option('-v, --verbose', 'Show detailed validation information')
  .action(validateCommand);

// Regenerate docs command
program
  .command('regenerate-docs')
  .description('Regenerate documentation files (tech-stack.md) from agentweaver.config.yml')
  .action(regenerateDocsCommand);

// Global error handling
program.exitOverride();

try {
  await program.parseAsync(process.argv);
} catch (error) {
  if ((error as { code?: string }).code === 'commander.help') {
    process.exit(0);
  }
  console.error(chalk.red('Error:'), (error as Error).message);
  process.exit(1);
}
