import path from 'path';
import {
  copyFile,
  ensureDirectory,
  listFiles,
  readFile,
  pathExists,
} from '../utils/file-operations.js';
import { parseAgentFile, AgentFrontmatter } from '../utils/yaml-parser.js';

/**
 * Agent installer for copying and validating agent templates
 */

export interface AgentInfo {
  name: string;
  fileName: string;
  frontmatter: AgentFrontmatter;
  validated: boolean;
}

export interface InstallOptions {
  targetDirectory: string;
  agentsToInstall?: string[]; // If not provided, install all
  overwrite?: boolean;
}

export interface InstallResult {
  installed: AgentInfo[];
  skipped: string[];
  errors: Array<{ agent: string; error: string }>;
}

export class AgentInstaller {
  private sourceDirectory: string;

  constructor(sourceDirectory: string) {
    this.sourceDirectory = sourceDirectory;
  }

  /**
   * Lists all available agents in the source directory
   */
  async listAvailableAgents(): Promise<AgentInfo[]> {
    const files = await listFiles(this.sourceDirectory);
    const agentFiles = files.filter((file) => file.endsWith('.md'));

    const agents: AgentInfo[] = [];

    for (const fileName of agentFiles) {
      try {
        const filePath = path.join(this.sourceDirectory, fileName);
        const content = await readFile(filePath);
        const parsed = parseAgentFile(content, filePath);

        agents.push({
          name: parsed.frontmatter.name,
          fileName,
          frontmatter: parsed.frontmatter,
          validated: true,
        });
      } catch (error) {
        // Skip invalid agents but log them
        console.warn(`Warning: Invalid agent file ${fileName}:`, (error as Error).message);
      }
    }

    return agents;
  }

  /**
   * Validates an agent file before installation
   */
  async validateAgent(fileName: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const filePath = path.join(this.sourceDirectory, fileName);
      const content = await readFile(filePath);
      parseAgentFile(content, filePath);

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Installs agents to the target directory
   */
  async installAgents(options: InstallOptions): Promise<InstallResult> {
    const result: InstallResult = {
      installed: [],
      skipped: [],
      errors: [],
    };

    // Get list of agents to install
    const availableAgents = await this.listAvailableAgents();
    let agentsToInstall = availableAgents;

    if (options.agentsToInstall && options.agentsToInstall.length > 0) {
      agentsToInstall = availableAgents.filter((agent) =>
        options.agentsToInstall!.includes(agent.name)
      );
    }

    // Ensure target directory exists
    await ensureDirectory(options.targetDirectory);

    // Install each agent
    for (const agent of agentsToInstall) {
      const targetPath = path.join(options.targetDirectory, agent.fileName);

      // Check if file already exists
      if (!options.overwrite && (await pathExists(targetPath))) {
        result.skipped.push(agent.name);
        continue;
      }

      try {
        const sourcePath = path.join(this.sourceDirectory, agent.fileName);
        await copyFile(sourcePath, targetPath);
        result.installed.push(agent);
      } catch (error) {
        result.errors.push({
          agent: agent.name,
          error: (error as Error).message,
        });
      }
    }

    return result;
  }

  /**
   * Gets information about a specific agent
   */
  async getAgentInfo(agentName: string): Promise<AgentInfo | null> {
    const agents = await this.listAvailableAgents();
    return agents.find((agent) => agent.name === agentName) || null;
  }

  /**
   * Filters agents by category (based on naming convention)
   */
  async getAgentsByCategory(category: 'development' | 'management' | 'all'): Promise<AgentInfo[]> {
    const allAgents = await this.listAvailableAgents();

    if (category === 'all') {
      return allAgents;
    }

    const developmentAgents = [
      'backend-dev',
      'frontend-dev',
      'qa-tester',
      'tech-lead',
      'devops',
      'docs-writer',
      'debugger',
    ];

    const managementAgents = ['product-owner', 'scrum-master'];

    if (category === 'development') {
      return allAgents.filter((agent) => developmentAgents.includes(agent.name));
    }

    if (category === 'management') {
      return allAgents.filter((agent) => managementAgents.includes(agent.name));
    }

    return [];
  }
}
