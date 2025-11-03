# AgentWeaver CLI - Technical Architecture

**Simple Agent Library Installer for Claude Code Projects**

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [CLI Architecture](#2-cli-architecture)
3. [Agent Template Structure](#3-agent-template-structure)
4. [Tech Stack Detection](#4-tech-stack-detection)
5. [Configuration Management](#5-configuration-management)
6. [MCP Server Setup](#6-mcp-server-setup)
7. [File Installation Process](#7-file-installation-process)
8. [Update & Version Management](#8-update--version-management)
9. [Implementation Guide](#9-implementation-guide)

---

## 1. System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AgentWeaver CLI                          │
│                  (One-Time Installer)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Command    │  │  Template    │  │    Config    │    │
│  │   Parser     │  │   Library    │  │  Generator   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                               │
└────────────────────────────┼───────────────────────────────┘
                             │
                             ▼ (Copies files to project)
              ┌──────────────────────────────┐
              │       User's Project         │
              │                              │
              │  ┌────────────────────────┐  │
              │  │ .claude/               │  │
              │  │   ├── agents/         │  │
              │  │   │   ├── backend-dev.md
              │  │   │   ├── frontend-dev.md
              │  │   │   └── ...         │  │
              │  │   ├── skills/         │  │
              │  │   └── CLAUDE.md       │  │
              │  │                       │  │
              │  │ .mcp.json              │  │
              │  │ agentweaver.config.yml │  │
              │  └────────────────────────┘  │
              └──────────────┬───────────────┘
                             │
                             ▼ (User invokes agents)
              ┌──────────────────────────────┐
              │       Claude Code            │
              │                              │
              │  User types:                 │
              │  @backend-dev build login API│
              │                              │
              │  Agent reads:                │
              │  - .claude/agents/backend-dev.md
              │  - .mcp.json               │
              │  - agentweaver.config.yml  │
              │                              │
              │  Then generates code         │
              └──────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **CLI Interface** | Parse commands, handle user interaction | Commander.js, Inquirer.js |
| **Template Library** | Store 19 pre-built agent `.md` files | Bundled markdown files |
| **Config Generator** | Create `.mcp.json` and `agentweaver.config.yml` | Template engines, YAML/JSON writers |
| **Tech Stack Detector** | Scan project files to detect frameworks | File system scanning, package.json parsing |
| **File Copier** | Copy templates to project directories | fs-extra |
| **Version Manager** | Check for updates, manage agent versions | npm API, semantic versioning |

**Key Principle**: AgentWeaver is a **file installer**, not a runtime orchestrator. After installation, it's not involved in agent execution.

---

## 2. CLI Architecture

### 2.1 Command Structure

```typescript
// cli/index.ts
import { Command } from 'commander';

const program = new Command();

program
  .name('agentweaver')
  .description('Pre-built agent library installer for Claude Code')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize AgentWeaver in current project')
  .option('--all', 'Install all agents')
  .option('--dev-only', 'Install development agents only')
  .option('--no-detect', 'Skip tech stack detection')
  .action(initCommand);

program
  .command('add <agent-name>')
  .description('Add a specific agent to project')
  .action(addCommand);

program
  .command('list')
  .description('List all available agents')
  .action(listCommand);

program
  .command('update')
  .description('Update agent templates to latest version')
  .action(updateCommand);

program
  .command('config')
  .description('Manage tech stack configuration')
  .action(configCommand);

program
  .command('detect')
  .description('Detect project tech stack')
  .action(detectCommand);

program
  .command('validate')
  .description('Validate project against tech stack config')
  .action(validateCommand);

program.parse();
```

### 2.2 Directory Structure

```
agentweaver-cli/
├── package.json
├── src/
│   ├── cli/
│   │   ├── index.ts              # CLI entry point
│   │   └── commands/
│   │       ├── init.ts
│   │       ├── add.ts
│   │       ├── list.ts
│   │       ├── update.ts
│   │       ├── config.ts
│   │       ├── detect.ts
│   │       └── validate.ts
│   ├── lib/
│   │   ├── agent-installer.ts    # Copy agent files
│   │   ├── skills-installer.ts   # Copy skill directories
│   │   ├── config-generator.ts   # Generate configs
│   │   ├── tech-detector.ts      # Detect tech stack
│   │   ├── mcp-generator.ts      # Generate .mcp.json
│   │   └── version-manager.ts    # Version management
│   ├── templates/
│   │   ├── agents/               # 19 agent .md files
│   │   │   ├── backend-dev.md
│   │   │   ├── frontend-dev.md
│   │   │   └── ...
│   │   ├── skills/               # Skills as directories
│   │   │   ├── api-pagination/
│   │   │   │   ├── SKILL.md
│   │   │   │   ├── reference.md
│   │   │   │   └── templates/
│   │   │   ├── database-optimization/
│   │   │   │   ├── SKILL.md
│   │   │   │   └── queries/
│   │   │   └── ...
│   │   ├── mcp.json.hbs          # MCP config template
│   │   └── config.yml.hbs        # Tech stack config
│   └── utils/
│       ├── file-utils.ts
│       ├── yaml-parser.ts        # Parse/validate YAML frontmatter
│       └── logger.ts
└── dist/                         # Compiled output
```

---

## 3. Agent Template Structure

### Official Claude Code Sub-Agent Format

Each agent follows the official Claude Code sub-agent specification with YAML frontmatter:

```markdown
---
name: backend-dev
description: Expert backend developer for API development, database design, server-side logic, authentication, and performance optimization. Use PROACTIVELY when tasks involve backend code, APIs, databases, or server architecture.
tools: Read, Write, Edit, Bash
model: sonnet
---

You are an expert backend developer specializing in building robust, scalable APIs and database systems.

## Tech Stack Context

**IMPORTANT**: Always read `agentweaver.config.yml` at project root to understand constraints:

- Backend Framework: {{techStack.backend.framework}}
- Language: {{techStack.backend.language}}
- Database: {{techStack.database.primary}}
- ORM: {{techStack.database.orm}}
- API Style: {{techStack.backend.apiStyle}}
- Enforcement Mode: {{techStack.mode}}

## Automatic Invocation Triggers

Claude will **automatically delegate** to you when detecting:

**Keywords**: "API", "backend", "server", "database", "authentication", "endpoint", "schema", "migration", "query", "performance", "scalability"

**File Patterns**: `*/api/*`, `*/routes/*`, `*/controllers/*`, `*/models/*`, `*/services/*`, `*/middleware/*`

**Language Files**: `.py`, `.js`, `.ts`, `.go`, `.rb`, `.java` (in backend contexts)

**Database Files**: `schema.prisma`, `*.sql`, `migrations/*`, `seeds/*`

## Responsibilities

- Design RESTful and GraphQL APIs
- Implement authentication and authorization
- Create optimized database schemas
- Write and optimize queries
- Ensure ≥80% test coverage
- Performance profiling and optimization

## MCP Server Access

You have access to these MCP servers (configured in project's `.mcp.json`):
- **github**: Repository operations, issue tracking
- **supabase**: Database management, auth
- **sequential-thinking**: Complex problem decomposition

## Handoff Protocol

When tasks require other expertise:
- UI/UX concerns → Handoff to `@frontend-dev`
- Infrastructure → Handoff to `@devops`
- Security audits → Handoff to `@security-engineer`

## Code Style

Follow project conventions in `agentweaver.config.yml`. In **strict mode**, reject alternative technologies. In **flexible mode**, suggest alternatives with justification.
```

### Key YAML Frontmatter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | ✅ | Agent identifier (matches filename) | `backend-dev` |
| `description` | ✅ | Trigger for automatic delegation | `Expert backend developer...Use PROACTIVELY when...` |
| `tools` | ❌ | Restrict available tools | `Read, Write, Edit, Bash` |
| `model` | ❌ | Override model (sonnet/opus/haiku/inherit) | `sonnet` |

**Critical**: The `description` field serves dual purposes:
1. Human-readable explanation of agent's role
2. **Automatic delegation trigger** - Claude analyzes user requests and matches against descriptions

**"Use PROACTIVELY" Keyword**: Including this phrase in the description encourages Claude to automatically invoke the agent without explicit `@agent-name` syntax.

### 3.2 Automatic Delegation Mechanism

**How It Works**:

1. **User Query Analysis**: Claude analyzes the user's request for keywords, file paths, and context
2. **Agent Matching**: Compares request against all agent `description` fields
3. **Confidence Scoring**: Calculates match confidence based on multiple factors
4. **Automatic Invocation**: If confidence threshold met, delegates to agent automatically

**Example Automatic Delegation**:

```
User: "I need to add pagination to the products API endpoint"

Claude's Analysis:
✅ Keywords: "pagination", "API", "endpoint"
✅ File context: working in backend/routes/
✅ Agent match: backend-dev (description mentions "API development")
✅ Confidence: 95%

Result: Automatically invokes @backend-dev without user typing it
```

**Explicit vs Automatic Invocation**:

```typescript
// Explicit - user types @agent-name
@backend-dev create authentication API

// Automatic - Claude detects and delegates
User: "create authentication API"
→ Claude automatically uses @backend-dev based on description match
```

### 3.3 Model Selection Strategy

AgentWeaver templates use these model configurations:

| Model | Use Case | Agents |
|-------|----------|--------|
| `sonnet` | Balanced performance, general development | backend-dev, frontend-dev, qa-tester |
| `opus` | Complex reasoning, architecture decisions | tech-lead, devops |
| `haiku` | Fast execution, simple tasks | docs-writer, sdr |
| `inherit` | Use parent Claude's model | Most marketing agents |

**Implementation**:

```yaml
# Complex agent requiring deep reasoning
---
name: tech-lead
model: opus
description: Senior technical leader...
---

# Fast documentation updates
---
name: docs-writer
model: haiku
description: Technical documentation specialist...
---
```

### 3.4 Tool Restrictions

Restrict tools to enforce security and operational boundaries:

```yaml
# Restrict tools for safety
---
name: sales-engineer
tools: Read, WebSearch
description: Pre-sales technical consultant...
---
# Cannot use Write, Edit, or Bash - read-only access

# Full tool access
---
name: backend-dev
tools: Read, Write, Edit, Bash, Task
description: Expert backend developer...
---
# Can modify code and execute commands
```

---

## 4. Tech Stack Detection

```typescript
export class TechStackDetector {
  async detect(projectPath: string): Promise<TechStackConfig> {
    const manifests = await this.scanManifests(projectPath);

    return {
      frontend: await this.detectFrontend(manifests),
      backend: await this.detectBackend(manifests),
      database: await this.detectDatabase(manifests),
      testing: await this.detectTesting(manifests)
    };
  }

  private async detectFrontend(manifests): Promise<FrontendConfig> {
    const pkg = manifests.packageJson;

    let framework: string;
    if (pkg.dependencies?.['next']) framework = 'nextjs';
    else if (pkg.dependencies?.['react']) framework = 'react';
    else if (pkg.dependencies?.['vue']) framework = 'vue';

    return { framework, /* ... */ };
  }
}
```

---

## 5. Configuration Management

### Project-Level Configuration

```yaml
# agentweaver.config.yml
techStack:
  mode: flexible  # strict | flexible | adaptive

  frontend:
    framework: nextjs
    language: typescript
    styling: tailwind
    uiLibrary: shadcn-ui

  backend:
    framework: fastapi
    language: python

  database:
    primary: postgresql
    orm: prisma

  testing:
    unit: jest
    e2e: playwright
```

---

## 6. MCP Server Setup

### Project-Level `.mcp.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/sequential-thinking-mcp-server"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

**Why Project-Level?**
- Each project can have different MCP servers
- Environment variables scoped to project
- Team members get consistent configuration

---

## 7. File Installation Process

### 7.1 Agent Installation

```typescript
export class AgentInstaller {
  async install(agents: string[]): Promise<void> {
    // Create .claude directory structure
    await this.createDirectoryStructure();

    // Copy agent files with official format
    for (const agent of agents) {
      await this.copyAgent(agent);
    }

    // Copy skills library (directories, not flat files)
    await this.copySkillDirectories();

    // Generate project configs
    await this.generateConfigs();
  }

  private async createDirectoryStructure(): Promise<void> {
    const dirs = [
      '.claude/agents',
      '.claude/skills'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.projectPath, dir));
    }
  }

  private async copyAgent(agentName: string): Promise<void> {
    const source = path.join(this.templatePath, 'agents', `${agentName}.md`);
    const dest = path.join(this.projectPath, '.claude/agents', `${agentName}.md`);

    // Validate agent has required YAML frontmatter
    await this.validateAgentFormat(source);

    await fs.copy(source, dest);
    console.log(`✅ Installed agent: ${agentName}`);
  }

  private async validateAgentFormat(agentPath: string): Promise<void> {
    const content = await fs.readFile(agentPath, 'utf-8');
    const frontmatter = this.extractFrontmatter(content);

    // Required fields per official spec
    if (!frontmatter.name) {
      throw new Error(`Agent ${agentPath} missing required 'name' field`);
    }
    if (!frontmatter.description) {
      throw new Error(`Agent ${agentPath} missing required 'description' field`);
    }

    // Validate description includes automatic delegation hints
    if (!frontmatter.description.includes('Use PROACTIVELY')) {
      console.warn(`⚠️  Agent ${frontmatter.name} missing "Use PROACTIVELY" in description - won't auto-delegate`);
    }
  }
}
```

### 7.2 Skills Installation

Skills are **directories** with required `SKILL.md` file:

```typescript
export class SkillsInstaller {
  async copySkillDirectories(): Promise<void> {
    const skillsSource = path.join(this.templatePath, 'skills');
    const skillsDest = path.join(this.projectPath, '.claude/skills');

    // Each skill is a directory
    const skillDirs = await fs.readdir(skillsSource);

    for (const skillDir of skillDirs) {
      await this.installSkill(skillDir, skillsSource, skillsDest);
    }
  }

  private async installSkill(
    skillName: string,
    source: string,
    dest: string
  ): Promise<void> {
    const skillSourcePath = path.join(source, skillName);
    const skillDestPath = path.join(dest, skillName);

    // Validate skill has required SKILL.md
    const skillMdPath = path.join(skillSourcePath, 'SKILL.md');
    if (!await fs.pathExists(skillMdPath)) {
      throw new Error(`Skill ${skillName} missing required SKILL.md file`);
    }

    // Validate SKILL.md has correct frontmatter
    await this.validateSkillFormat(skillMdPath);

    // Copy entire skill directory
    await fs.copy(skillSourcePath, skillDestPath);
    console.log(`✅ Installed skill: ${skillName}`);
  }

  private async validateSkillFormat(skillMdPath: string): Promise<void> {
    const content = await fs.readFile(skillMdPath, 'utf-8');
    const frontmatter = this.extractFrontmatter(content);

    // Required fields per official spec
    if (!frontmatter.name) {
      throw new Error(`Skill ${skillMdPath} missing required 'name' field`);
    }
    if (!frontmatter.description) {
      throw new Error(`Skill ${skillMdPath} missing required 'description' field`);
    }

    // Optional but recommended fields
    if (!frontmatter['allowed-tools']) {
      console.warn(`⚠️  Skill ${frontmatter.name} has no 'allowed-tools' restriction`);
    }
  }

  private extractFrontmatter(content: string): Record<string, any> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      throw new Error('Missing YAML frontmatter');
    }
    return yaml.parse(match[1]);
  }
}
```

### 7.3 Skills Directory Structure

```typescript
// Template library structure
templates/skills/
├── api-pagination/
│   ├── SKILL.md              # Required: main skill definition
│   ├── reference.md          # Optional: examples and documentation
│   └── templates/
│       ├── cursor.py         # Optional: code templates
│       └── offset.py
├── database-optimization/
│   ├── SKILL.md
│   ├── reference.md
│   └── queries/
│       └── explain-analyze.sql
└── react-patterns/
    ├── SKILL.md
    ├── reference.md
    └── components/
        └── compound-component.tsx

// After installation in user's project
.claude/skills/
├── api-pagination/
│   ├── SKILL.md
│   ├── reference.md
│   └── templates/
│       ├── cursor.py
│       └── offset.py
└── ...
```

### 7.4 Example SKILL.md Generation

```typescript
export function generateSkillMd(skill: SkillDefinition): string {
  return `---
name: ${skill.name}
description: ${skill.description} Use when ${skill.triggers.join(', ')}.
allowed-tools: ${skill.allowedTools.join(', ')}
---

# ${skill.name}

${skill.longDescription}

## When to Use

${skill.useCases.map(uc => `- ${uc}`).join('\n')}

## Implementation Steps

${skill.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Examples

${skill.examples.map(ex => `### ${ex.title}\n\n\`\`\`${ex.language}\n${ex.code}\n\`\`\`\n\n${ex.explanation}`).join('\n\n')}

## Best Practices

${skill.bestPractices.map(bp => `- ${bp}`).join('\n')}

## Common Pitfalls

${skill.pitfalls.map(p => `- ⚠️ ${p.warning}\n  - Solution: ${p.solution}`).join('\n\n')}

## Related Skills

${skill.relatedSkills.map(rs => `- [${rs}](../${rs}/SKILL.md)`).join('\n')}
`;
}
```

---

## 8. Update & Version Management

```typescript
export class VersionManager {
  async checkForUpdates(): Promise<UpdateInfo[]> {
    const installed = await this.getInstalledAgents();
    const latest = await this.getLatestVersions();

    return installed
      .filter(agent => semver.gt(latest[agent.name], agent.version))
      .map(agent => ({
        name: agent.name,
        currentVersion: agent.version,
        latestVersion: latest[agent.name]
      }));
  }

  async updateAgent(agentName: string): Promise<void> {
    await this.backupAgent(agentName);
    await this.installLatestVersion(agentName);
  }
}
```

---

## 9. Implementation Guide

### Core Dependencies

```json
{
  "name": "agentweaver-cli",
  "version": "0.1.0",
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.2.0",
    "fs-extra": "^11.2.0",
    "handlebars": "^4.7.8",
    "js-yaml": "^4.1.0",
    "chalk": "^5.3.0",
    "semver": "^7.5.4",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/fs-extra": "^11.0.0",
    "@types/inquirer": "^9.0.0",
    "vitest": "^1.0.0"
  }
}
```

**Key Libraries**:
- **commander**: CLI command parsing
- **inquirer**: Interactive prompts for user input
- **fs-extra**: Enhanced file system operations
- **handlebars**: Template engine for config generation
- **js-yaml**: YAML parsing for config files
- **gray-matter**: Parse YAML frontmatter from markdown files
- **chalk**: Terminal color output
- **semver**: Semantic version management

### Build & Publish

```bash
# Build
npm run build

# Test locally
npm link
agentweaver --version

# Publish
npm publish
```

---

## Appendix: Example Workflows

### Workflow 1: Explicit Agent Invocation

```bash
# 1. Install AgentWeaver in project
cd my-fastapi-project
agentweaver init

# 2. AgentWeaver creates:
#    - .claude/agents/*.md (agent templates with official format)
#    - .claude/skills/* (skill directories with SKILL.md)
#    - .mcp.json (project-level MCP config)
#    - agentweaver.config.yml (tech stack config)

# 3. User opens Claude Code in VSCode

# 4. User explicitly invokes agent:
@backend-dev build login API with JWT authentication

# 5. Claude Code:
#    - Reads .claude/agents/backend-dev.md
#    - Sees YAML frontmatter: model=sonnet, tools=Read,Write,Edit,Bash
#    - Reads agentweaver.config.yml (sees FastAPI, PostgreSQL)
#    - Accesses MCP servers (GitHub, Supabase, Sequential)
#    - Generates code following tech stack constraints

# 6. AgentWeaver is NOT involved after step 2
```

### Workflow 2: Automatic Agent Delegation

```bash
# Same setup as Workflow 1, but user doesn't type @agent-name

# User simply asks:
"I need to add pagination to the products API"

# Claude Code automatically:
# 1. Analyzes request:
#    - Keywords: "pagination", "products", "API"
#    - Current file context: backend/routes/products.py
#    - Tech stack: FastAPI (from agentweaver.config.yml)
#
# 2. Searches agent descriptions:
#    - backend-dev.md description: "...API development...Use PROACTIVELY when tasks involve...APIs..."
#    - Confidence score: 95%
#
# 3. Auto-invokes @backend-dev:
#    - Backend agent reads agentweaver.config.yml
#    - Sees backend.framework: fastapi
#    - Looks for pagination skill in .claude/skills/api-pagination/
#    - Reads SKILL.md for cursor-based and offset-based patterns
#    - Implements pagination following FastAPI conventions

# Result: User gets pagination implementation without explicitly typing @backend-dev
```

### Workflow 3: Skills Usage

```bash
# User (or auto-delegated agent) needs specific skill

# Explicit skill invocation:
@backend-dev use the api-pagination skill to add pagination to /products

# Claude Code:
# 1. Agent reads .claude/skills/api-pagination/SKILL.md
# 2. SKILL.md has YAML frontmatter:
#    name: api-pagination
#    description: Implement cursor-based and offset-based pagination...
#    allowed-tools: Read, Write, Edit
#
# 3. Agent reads skill content:
#    - Implementation steps
#    - Code examples in templates/ directory
#    - Best practices and common pitfalls
#
# 4. Applies skill following project's tech stack
```

### Workflow 4: Cross-Agent Handoff

```bash
# User asks for full-stack feature:
"Add user authentication with login UI"

# Claude Code workflow:
# 1. Analyzes request: requires both backend and frontend work
#
# 2. Auto-delegates to @backend-dev first:
#    - Creates authentication API
#    - Sets up JWT tokens
#    - Creates database migrations
#
# 3. @backend-dev hands off to @frontend-dev:
#    - Reads handoff protocol in agent template
#    - Message: "API complete at /api/auth/login, needs UI"
#
# 4. @frontend-dev auto-invoked:
#    - Reads tech stack: frontend.framework=nextjs, uiLibrary=shadcn-ui
#    - Accesses shadcn-ui MCP server
#    - Creates login form component
#    - Integrates with backend API
#
# Result: Full authentication flow implemented with automatic agent coordination
```
