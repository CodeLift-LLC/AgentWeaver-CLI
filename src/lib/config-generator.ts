import { writeJsonFile, writeFile } from '../utils/file-operations.js';
import { TechStack } from './tech-detector.js';

/**
 * Configuration file generators for MCP and AgentWeaver
 */

export interface McpServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface McpConfig {
  mcpServers: Record<string, McpServerConfig>;
}

export interface AgentWeaverConfig {
  version: string;
  techStack: {
    mode: 'strict' | 'flexible' | 'adaptive';
    frontend?: {
      framework?: string;
      language?: string;
      styling?: string;
      uiLibrary?: string;
      stateManagement?: string;
      routing?: string;
    };
    backend?: {
      framework?: string;
      language?: string;
      apiStyle?: string;
      validation?: string;
    };
    database?: {
      primary?: string;
      orm?: string;
      cache?: string;
      migrations?: string;
    };
    testing?: {
      unit?: string;
      e2e?: string;
      coverage?: {
        enabled: boolean;
        threshold?: number;
      };
    };
    deployment?: {
      platform?: string;
      containerization?: string;
      cicd?: string;
    };
  };
  constraints?: {
    allowedPackages?: string[];
    forbiddenPackages?: string[];
    versionPinning?: boolean;
    securityPolicy?: string;
  };
}

export class ConfigGenerator {
  /**
   * Generates .mcp.json configuration
   */
  static generateMcpConfig(options: {
    includeGithub?: boolean;
    includeContext7?: boolean;
    includeSequential?: boolean;
    includePlaywright?: boolean;
    includeShadcn?: boolean;
    includeSupabase?: boolean;
  }): McpConfig {
    const config: McpConfig = { mcpServers: {} };

    // GitHub MCP Server
    if (options.includeGithub) {
      config.mcpServers.github = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-github'],
        env: {
          GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_TOKEN}',
        },
      };
    }

    // Context7 MCP Server (Documentation lookup)
    if (options.includeContext7) {
      config.mcpServers.context7 = {
        command: 'npx',
        args: ['-y', '@context7/mcp-server'],
      };
    }

    // Sequential Thinking MCP Server
    if (options.includeSequential) {
      config.mcpServers['sequential-thinking'] = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
      };
    }

    // Playwright MCP Server
    if (options.includePlaywright) {
      config.mcpServers.playwright = {
        command: 'npx',
        args: ['-y', '@executeautomation/playwright-mcp-server'],
      };
    }

    // shadcn-ui MCP Server
    if (options.includeShadcn) {
      config.mcpServers['shadcn-ui'] = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-shadcn'],
      };
    }

    // Supabase MCP Server
    if (options.includeSupabase) {
      config.mcpServers.supabase = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-supabase'],
        env: {
          SUPABASE_URL: '${SUPABASE_URL}',
          SUPABASE_SERVICE_ROLE_KEY: '${SUPABASE_SERVICE_ROLE_KEY}',
        },
      };
    }

    return config;
  }

  /**
   * Generates agentweaver.config.yml configuration
   */
  static generateAgentWeaverConfig(
    detectedTech: TechStack,
    mode: 'strict' | 'flexible' | 'adaptive' = 'flexible'
  ): AgentWeaverConfig {
    const config: AgentWeaverConfig = {
      version: '0.1.0',
      techStack: {
        mode,
      },
    };

    // Frontend configuration
    if (detectedTech.frontend) {
      config.techStack.frontend = {
        framework: detectedTech.frontend.framework,
        language: detectedTech.frontend.language,
        styling: detectedTech.frontend.styling,
        uiLibrary: detectedTech.frontend.uiLibrary,
        stateManagement: detectedTech.frontend.stateManagement,
        routing: detectedTech.frontend.routing,
      };
    }

    // Backend configuration
    if (detectedTech.backend) {
      config.techStack.backend = {
        framework: detectedTech.backend.framework,
        language: detectedTech.backend.language,
        apiStyle: detectedTech.backend.apiStyle,
        validation: detectedTech.backend.validation,
      };
    }

    // Database configuration
    if (detectedTech.database) {
      config.techStack.database = {
        primary: detectedTech.database.primary,
        orm: detectedTech.database.orm,
        cache: detectedTech.database.cache,
        migrations: detectedTech.database.migrations,
      };
    }

    // Testing configuration
    if (detectedTech.testing) {
      config.techStack.testing = {
        unit: detectedTech.testing.unit,
        e2e: detectedTech.testing.e2e,
        coverage: {
          enabled: detectedTech.testing.coverage || false,
          threshold: 80,
        },
      };
    }

    // Deployment configuration
    if (detectedTech.deployment) {
      config.techStack.deployment = {
        platform: detectedTech.deployment.platform,
        containerization: detectedTech.deployment.containerization,
        cicd: detectedTech.deployment.cicd,
      };
    }

    // Add constraints for strict mode
    if (mode === 'strict') {
      config.constraints = {
        versionPinning: true,
        securityPolicy: 'high',
      };
    }

    return config;
  }

  /**
   * Writes MCP configuration to file
   */
  static async writeMcpConfig(filePath: string, config: McpConfig): Promise<void> {
    await writeJsonFile(filePath, config, true);
  }

  /**
   * Writes AgentWeaver configuration to file
   */
  static async writeAgentWeaverConfig(
    filePath: string,
    config: AgentWeaverConfig
  ): Promise<void> {
    const yamlContent = this.generateYamlWithComments(config);
    await writeFile(filePath, yamlContent);
  }

  /**
   * Generates YAML content with helpful comments
   */
  private static generateYamlWithComments(config: AgentWeaverConfig): string {
    const lines: string[] = [];

    lines.push('# AgentWeaver Configuration');
    lines.push('# This file defines your project\'s tech stack for AI agents');
    lines.push('');
    lines.push(`version: '${config.version}'`);
    lines.push('');
    lines.push('techStack:');
    lines.push('  # Mode: strict (enforce), flexible (prefer), adaptive (auto-detect)');
    lines.push(`  mode: ${config.techStack.mode}`);
    lines.push('');

    // Frontend section
    if (config.techStack.frontend) {
      lines.push('  # Frontend Configuration');
      lines.push('  frontend:');
      if (config.techStack.frontend.framework) {
        lines.push(`    framework: ${config.techStack.frontend.framework}`);
      }
      if (config.techStack.frontend.language) {
        lines.push(`    language: ${config.techStack.frontend.language}`);
      }
      if (config.techStack.frontend.styling) {
        lines.push(`    styling: ${config.techStack.frontend.styling}`);
      }
      if (config.techStack.frontend.uiLibrary) {
        lines.push(`    uiLibrary: ${config.techStack.frontend.uiLibrary}`);
      }
      if (config.techStack.frontend.stateManagement) {
        lines.push(`    stateManagement: ${config.techStack.frontend.stateManagement}`);
      }
      if (config.techStack.frontend.routing) {
        lines.push(`    routing: ${config.techStack.frontend.routing}`);
      }
      lines.push('');
    }

    // Backend section
    if (config.techStack.backend) {
      lines.push('  # Backend Configuration');
      lines.push('  backend:');
      if (config.techStack.backend.framework) {
        lines.push(`    framework: ${config.techStack.backend.framework}`);
      }
      if (config.techStack.backend.language) {
        lines.push(`    language: ${config.techStack.backend.language}`);
      }
      if (config.techStack.backend.apiStyle) {
        lines.push(`    apiStyle: ${config.techStack.backend.apiStyle}`);
      }
      if (config.techStack.backend.validation) {
        lines.push(`    validation: ${config.techStack.backend.validation}`);
      }
      lines.push('');
    }

    // Database section
    if (config.techStack.database) {
      lines.push('  # Database Configuration');
      lines.push('  database:');
      if (config.techStack.database.primary) {
        lines.push(`    primary: ${config.techStack.database.primary}`);
      }
      if (config.techStack.database.orm) {
        lines.push(`    orm: ${config.techStack.database.orm}`);
      }
      if (config.techStack.database.cache) {
        lines.push(`    cache: ${config.techStack.database.cache}`);
      }
      if (config.techStack.database.migrations) {
        lines.push(`    migrations: ${config.techStack.database.migrations}`);
      }
      lines.push('');
    }

    // Testing section
    if (config.techStack.testing) {
      lines.push('  # Testing Configuration');
      lines.push('  testing:');
      if (config.techStack.testing.unit) {
        lines.push(`    unit: ${config.techStack.testing.unit}`);
      }
      if (config.techStack.testing.e2e) {
        lines.push(`    e2e: ${config.techStack.testing.e2e}`);
      }
      if (config.techStack.testing.coverage) {
        lines.push('    coverage:');
        lines.push(`      enabled: ${config.techStack.testing.coverage.enabled}`);
        if (config.techStack.testing.coverage.threshold) {
          lines.push(`      threshold: ${config.techStack.testing.coverage.threshold}`);
        }
      }
      lines.push('');
    }

    // Deployment section
    if (config.techStack.deployment) {
      lines.push('  # Deployment Configuration');
      lines.push('  deployment:');
      if (config.techStack.deployment.platform) {
        lines.push(`    platform: ${config.techStack.deployment.platform}`);
      }
      if (config.techStack.deployment.containerization) {
        lines.push(`    containerization: ${config.techStack.deployment.containerization}`);
      }
      if (config.techStack.deployment.cicd) {
        lines.push(`    cicd: ${config.techStack.deployment.cicd}`);
      }
      lines.push('');
    }

    // Constraints section (for strict mode)
    if (config.constraints) {
      lines.push('# Constraints (for strict mode)');
      lines.push('constraints:');
      if (config.constraints.versionPinning !== undefined) {
        lines.push(`  versionPinning: ${config.constraints.versionPinning}`);
      }
      if (config.constraints.securityPolicy) {
        lines.push(`  securityPolicy: ${config.constraints.securityPolicy}`);
      }
      if (config.constraints.allowedPackages) {
        lines.push('  allowedPackages:');
        config.constraints.allowedPackages.forEach((pkg) => {
          lines.push(`    - ${pkg}`);
        });
      }
      if (config.constraints.forbiddenPackages) {
        lines.push('  forbiddenPackages:');
        config.constraints.forbiddenPackages.forEach((pkg) => {
          lines.push(`    - ${pkg}`);
        });
      }
    }

    return lines.join('\n');
  }

  /**
   * Generates .env.example file with required environment variables
   */
  static generateEnvExample(mcpConfig: McpConfig): string {
    const lines: string[] = [];
    lines.push('# Environment Variables for AgentWeaver CLI');
    lines.push('# Copy this file to .env and fill in your values');
    lines.push('');

    // Extract required env vars from MCP config
    const envVars = new Set<string>();

    for (const [, serverConfig] of Object.entries(mcpConfig.mcpServers)) {
      if (serverConfig.env) {
        Object.keys(serverConfig.env).forEach((key) => envVars.add(key));
      }
    }

    // Add comments for each env var
    if (envVars.has('GITHUB_TOKEN')) {
      lines.push('# GitHub Personal Access Token');
      lines.push('# Get it from: https://github.com/settings/tokens');
      lines.push('GITHUB_TOKEN=');
      lines.push('');
    }

    if (envVars.has('SUPABASE_URL')) {
      lines.push('# Supabase Project URL');
      lines.push('SUPABASE_URL=');
      lines.push('');
    }

    if (envVars.has('SUPABASE_SERVICE_ROLE_KEY')) {
      lines.push('# Supabase Service Role Key (keep secret!)');
      lines.push('SUPABASE_SERVICE_ROLE_KEY=');
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generates CLAUDE.md with project context and agent/skill references
   */
  static generateClaudeMd(
    techStack: TechStack,
    agents: string[],
    skills: string[]
  ): string {
    const lines: string[] = [];

    lines.push('# Project Context for Claude Code');
    lines.push('');
    lines.push('> **Auto-generated by AgentWeaver CLI**');
    lines.push('> This file automatically loads agent definitions and skills into Claude Code context.');
    lines.push('');

    // File References - Load agents and skills into context
    lines.push('<!-- Agent Definitions (auto-loaded by Claude Code) -->');
    if (agents.length > 0) {
      agents.forEach((agent) => {
        lines.push(`@agents/${agent}.md`);
      });
    }
    lines.push('');

    // Skills References
    if (skills.length > 0) {
      lines.push('<!-- Skill Definitions (auto-loaded by Claude Code) -->');
      skills.forEach((skill) => {
        lines.push(`@skills/${skill}/SKILL.md`);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('');

    // Project Overview
    lines.push('## 📋 Project Overview');
    lines.push('');
    if (techStack.frontend?.framework) {
      lines.push(`**Frontend**: ${techStack.frontend.framework}${techStack.frontend.language ? ` (${techStack.frontend.language})` : ''}`);
    }
    if (techStack.backend?.framework) {
      lines.push(`**Backend**: ${techStack.backend.framework}${techStack.backend.language ? ` (${techStack.backend.language})` : ''}`);
    }
    if (techStack.database?.primary) {
      lines.push(`**Database**: ${techStack.database.primary}${techStack.database.orm ? ` with ${techStack.database.orm}` : ''}`);
    }
    lines.push('');

    // Available Agents
    lines.push('## 🤖 Available Agents');
    lines.push('');
    lines.push('This project has specialized AI agents in `.claude/agents/` directory:');
    lines.push('');

    if (agents.length > 0) {
      agents.forEach((agent) => {
        const agentInfo = getAgentInfo(agent);
        lines.push(`### @${agent}`);
        lines.push(`${agentInfo.description}`);
        lines.push('');
        lines.push(`**Usage**: \`@${agent} [your request]\``);
        lines.push('');
        if (agentInfo.triggers.length > 0) {
          lines.push('**Auto-invoked for**: ' + agentInfo.triggers.join(', '));
          lines.push('');
        }
      });
    } else {
      lines.push('No agents installed yet. Run `agentweaver init` to install agents.');
      lines.push('');
    }

    // Available Skills
    lines.push('## 🎯 Available Skills');
    lines.push('');
    lines.push('Reusable patterns and code templates in `.claude/skills/` directory:');
    lines.push('');

    if (skills.length > 0) {
      skills.forEach((skill) => {
        const skillInfo = getSkillInfo(skill);
        lines.push(`- **${skillInfo.title}**: ${skillInfo.description}`);
      });
      lines.push('');
      lines.push('Skills are automatically suggested by Claude Code when relevant.');
    } else {
      lines.push('No skills installed yet. Run `agentweaver init` to install skills.');
    }
    lines.push('');

    // Tech Stack Configuration
    lines.push('## ⚙️ Tech Stack Configuration');
    lines.push('');
    lines.push('Read `.claude/agentweaver.config.yml` for complete tech stack details and constraints.');
    lines.push('');
    lines.push('**Important**: Agents respect the tech stack configuration. Prefer the configured technologies unless there\'s a strong justification for alternatives.');
    lines.push('');

    // Working with Agents
    lines.push('## 💡 Working with Agents');
    lines.push('');
    lines.push('### Automatic Invocation (Recommended)');
    lines.push('Simply ask for what you need, and Claude Code will automatically invoke the appropriate agent:');
    lines.push('');
    lines.push('```markdown');
    lines.push('"Build a REST API for user authentication"');
    lines.push('→ Automatically invokes @backend-dev');
    lines.push('');
    lines.push('"Create a responsive navigation component"');
    lines.push('→ Automatically invokes @frontend-dev');
    lines.push('```');
    lines.push('');
    lines.push('### Manual Invocation');
    lines.push('For explicit control, use `@agent-name` syntax:');
    lines.push('');
    lines.push('```markdown');
    lines.push('@backend-dev implement JWT authentication');
    lines.push('@frontend-dev create dashboard layout');
    lines.push('@qa-tester write E2E tests for login');
    lines.push('```');
    lines.push('');

    // Best Practices
    lines.push('## 📚 Best Practices');
    lines.push('');
    lines.push('1. **Check agents first**: Before starting a task, review available agents to leverage specialized expertise');
    lines.push('2. **Use skills**: Reference `.claude/skills/` for proven patterns and templates');
    lines.push('3. **Follow tech stack**: Respect the technologies defined in `agentweaver.config.yml`');
    lines.push('4. **Read MCP config**: Check `.claude/.mcp.json` for available MCP server integrations');
    lines.push('');

    // File Structure
    lines.push('## 📁 Project Structure');
    lines.push('');
    lines.push('```');
    lines.push('.claude/');
    lines.push('├── agents/              # AI agent templates');
    lines.push('└── skills/              # Reusable patterns');
    lines.push('');
    lines.push('.mcp.json               # MCP server configuration');
    lines.push('agentweaver.config.yml  # Tech stack configuration');
    lines.push('CLAUDE.md               # This file');
    lines.push('```');
    lines.push('');

    lines.push('---');
    lines.push('');
    lines.push('*Generated by [AgentWeaver CLI](https://github.com/CodeLift-LLC/AgentWeaver-CLI)*');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Writes CLAUDE.md to file
   */
  static async writeClaudeMd(filePath: string, content: string): Promise<void> {
    await writeFile(filePath, content);
  }
}

/**
 * Helper function to get agent information
 */
function getAgentInfo(agentName: string): { description: string; triggers: string[] } {
  const agentInfoMap: Record<string, { description: string; triggers: string[] }> = {
    'backend-dev': {
      description: 'Expert Backend Developer specializing in server-side development, API design, database architecture, and performance optimization.',
      triggers: ['API development', 'database operations', 'authentication', 'server-side logic'],
    },
    'frontend-dev': {
      description: 'Expert Frontend Developer specializing in UI/UX, responsive design, accessibility, and performance optimization.',
      triggers: ['UI components', 'responsive design', 'accessibility', 'frontend performance'],
    },
    'qa-tester': {
      description: 'Quality Assurance Specialist focusing on test automation, E2E testing, and quality standards.',
      triggers: ['testing', 'quality assurance', 'E2E tests', 'test automation'],
    },
    'tech-lead': {
      description: 'Technical Leadership specialist for architecture, code review, and technical decisions.',
      triggers: ['architecture', 'code review', 'technical decisions', 'system design'],
    },
    'devops': {
      description: 'DevOps Engineer specializing in CI/CD, infrastructure, containerization, and deployment.',
      triggers: ['deployment', 'CI/CD', 'infrastructure', 'Docker', 'monitoring'],
    },
    'docs-writer': {
      description: 'Technical Documentation Specialist for README files, API docs, and user guides.',
      triggers: ['documentation', 'README', 'API docs', 'user guides'],
    },
    'product-owner': {
      description: 'Product Management specialist for requirements, user stories, and backlog management.',
      triggers: ['requirements', 'user stories', 'product planning', 'backlog'],
    },
    'scrum-master': {
      description: 'Agile Project Management specialist for sprint planning and impediment removal.',
      triggers: ['sprint planning', 'agile ceremonies', 'team coordination'],
    },
  };

  return agentInfoMap[agentName] || { description: 'Specialized agent', triggers: [] };
}

/**
 * Helper function to get skill information
 */
function getSkillInfo(skillName: string): { title: string; description: string } {
  const skillInfoMap: Record<string, { title: string; description: string }> = {
    'api-pagination': {
      title: 'API Pagination',
      description: 'Cursor and offset-based pagination patterns for REST APIs',
    },
    'ui-form-validation': {
      title: 'UI Form Validation',
      description: 'Accessible form validation with React Hook Form and Zod',
    },
    'database-optimization': {
      title: 'Database Optimization',
      description: 'Query optimization, indexing strategies, and N+1 prevention',
    },
  };

  return skillInfoMap[skillName] || { title: skillName, description: 'Reusable pattern' };
}
