import { writeJsonFile, writeFile, readFile } from '../utils/file-operations.js';
import { TechStack } from './tech-detector.js';
import Handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration file generators for MCP and AgentWeaver
 */

export interface McpServerConfig {
  type?: string;
  command?: string;
  args?: string[];
  url?: string;
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
    includeFetch?: boolean;
    includeSocket?: boolean;
  }): McpConfig {
    const config: McpConfig = { mcpServers: {} };

    // GitHub MCP Server
    if (options.includeGithub) {
      config.mcpServers.github = {
        command: 'cmd',
        args: ['/c', 'npx', '-y', '@modelcontextprotocol/server-github'],
        env: {
          GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_TOKEN}',
        },
      };
    }

    // Fetch MCP Server
    if (options.includeFetch) {
      config.mcpServers.fetch = {
        type: 'stdio',
        command: 'cmd',
        args: ['/c', 'npx', '-y', '@kazuph/mcp-fetch@latest'],
        env: {},
      };
    }

    // Context7 MCP Server (Documentation lookup) - HTTP type
    if (options.includeContext7) {
      config.mcpServers.context7 = {
        type: 'http',
        url: 'https://mcp.context7.com/mcp',
      };
    }

    // Sequential Thinking MCP Server
    if (options.includeSequential) {
      config.mcpServers['sequential-thinking'] = {
        command: 'cmd',
        args: ['/c', 'npx', '-y', '@modelcontextprotocol/server-sequential-thinking@latest'],
      };
    }

    // Playwright MCP Server
    if (options.includePlaywright) {
      config.mcpServers.playwright = {
        type: 'stdio',
        command: 'cmd',
        args: ['/c', 'npx', '@playwright/mcp@latest'],
        env: {},
      };
    }

    // shadcn-ui MCP Server
    if (options.includeShadcn) {
      config.mcpServers['shadcn-ui-server'] = {
        command: 'cmd',
        args: ['/c', 'npx', '-y', '@heilgar/shadcn-ui-mcp-server'],
      };
    }

    // Socket MCP Server - HTTP type
    if (options.includeSocket) {
      config.mcpServers.socket = {
        type: 'http',
        url: 'https://mcp.socket.dev/',
      };
    }

    // Supabase MCP Server
    if (options.includeSupabase) {
      config.mcpServers.supabase = {
        command: 'cmd',
        args: ['/c', 'npx', '-y', '@modelcontextprotocol/server-supabase'],
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
    // Check for GITHUB_PERSONAL_ACCESS_TOKEN which maps to GITHUB_TOKEN
    if (envVars.has('GITHUB_PERSONAL_ACCESS_TOKEN') || envVars.has('GITHUB_TOKEN')) {
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
   * Generates CLAUDE.md with project context and agent/skill references using Handlebars template
   */
  static async generateClaudeMd(
    projectName: string,
    techStack: TechStack,
    agents: string[],
    skills: string[]
  ): Promise<string> {
    try {
      // Read the template file
      const templatePath = path.join(__dirname, '../../templates/CLAUDE.md.hbs');
      const templateContent = await readFile(templatePath);

      // Compile the Handlebars template
      const template = Handlebars.compile(templateContent);

      // Prepare template data
      const data = {
        projectName: projectName || 'My Project',
        version: '0.1.0',
        generatedDate: new Date().toISOString().split('T')[0],
        techStack: {
          mode: 'flexible',
          frontend: {
            framework: techStack.frontend?.framework || 'Not configured',
            language: techStack.frontend?.language || 'Not configured',
            styling: techStack.frontend?.styling || 'Not configured',
            uiLibrary: techStack.frontend?.uiLibrary || 'Not configured',
          },
          backend: {
            framework: techStack.backend?.framework || 'Not configured',
            language: techStack.backend?.language || 'Not configured',
            apiStyle: techStack.backend?.apiStyle || 'REST',
          },
          database: {
            primary: techStack.database?.primary || 'Not configured',
            orm: techStack.database?.orm || 'Not configured',
          },
          testing: {
            unit: techStack.testing?.unit || 'Not configured',
            e2e: techStack.testing?.e2e || 'Not configured',
          },
          deployment: {
            platform: techStack.deployment?.platform || 'Not configured',
            cicd: techStack.deployment?.cicd || 'Not configured',
          },
        },
        agents,
        skills,
      };

      // Render the template
      return template(data);
    } catch (error) {
      // Fallback to simple generation if template fails
      console.warn('Warning: Could not load CLAUDE.md template, using fallback');
      return this.generateSimpleClaudeMd(projectName, techStack, agents, skills);
    }
  }

  /**
   * Fallback method for generating CLAUDE.md without template
   */
  private static generateSimpleClaudeMd(
    projectName: string,
    techStack: TechStack,
    agents: string[],
    skills: string[]
  ): string {
    const lines: string[] = [];

    lines.push(`# ${projectName} - Claude Code Project Guide`);
    lines.push('');
    lines.push('**Generated by AgentWeaver CLI**');
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
    lines.push('## 🤖 Available Agents (' + agents.length + ')');
    lines.push('');
    if (agents.length > 0) {
      agents.forEach((agent) => {
        lines.push(`- @${agent}`);
      });
    }
    lines.push('');

    // Available Skills
    lines.push('## 🎓 Available Skills (' + skills.length + ')');
    lines.push('');
    if (skills.length > 0) {
      skills.forEach((skill) => {
        lines.push(`- ${skill}`);
      });
    }
    lines.push('');

    lines.push('---');
    lines.push('');
    lines.push('*For more details, see `.claude/agents/` and `.claude/skills/` directories.*');
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

