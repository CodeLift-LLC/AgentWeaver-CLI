# AgentWeaver CLI

> **Pre-built AI Agent Library Installer for Claude Code**

AgentWeaver CLI is a command-line tool that sets up production-ready AI agent templates and reusable skill patterns for your Claude Code projects. Get started with intelligent development agents in seconds.

[![npm version](https://badge.fury.io/js/agentweaver-cli.svg)](https://www.npmjs.com/package/agentweaver-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

```bash
# Install globally
npm install -g agentweaver-cli

# Or use with npx (no installation)
npx agentweaver-cli init

# Initialize in your project
cd your-project
agentweaver init
```

## ✨ What You Get

### 🤖 **8 Pre-Built Agent Templates**
- **backend-dev** - Backend development, APIs, databases
- **frontend-dev** - UI development, accessibility, performance
- **qa-tester** - Testing automation, quality assurance
- **tech-lead** - Architecture, code review, technical decisions
- **devops** - CI/CD, infrastructure, deployment
- **product-owner** - Requirements, user stories, backlog
- **scrum-master** - Agile ceremonies, impediment removal
- **docs-writer** - Technical documentation, API docs

### 📚 **3 Reusable Skills Library**
- **API Pagination** - Cursor & offset-based pagination patterns
- **UI Form Validation** - Accessible form validation with React Hook Form + Zod
- **Database Optimization** - Query optimization, indexing, N+1 prevention

### ⚙️ **Intelligent Configuration**
- **Tech Stack Detection** - Auto-detects your frontend, backend, database, testing frameworks
- **MCP Server Setup** - Configures GitHub, Context7, Sequential Thinking, Playwright, and more
- **Agent Configuration** - Creates `agentweaver.config.yml` with your tech stack

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g agentweaver-cli
```

### Using npx (No installation required)
```bash
npx agentweaver-cli init
```

### Local Installation
```bash
npm install --save-dev agentweaver-cli
```

## 🎯 Usage

### Interactive Setup (Recommended)
```bash
agentweaver init
```

This will:
1. 🔍 Detect your project's tech stack
2. 📋 Ask which agents and skills you want
3. ⚙️ Configure MCP servers
4. 📝 Generate configuration files
5. ✅ Install everything to `.claude/`

### Quick Setup (Skip Prompts)
```bash
agentweaver init --yes
```

### Custom Installation
```bash
# Install specific agents
agentweaver init --agents backend-dev,frontend-dev,qa-tester

# Install specific skills
agentweaver init --skills api-pagination,ui-form-validation

# Skip MCP configuration
agentweaver init --no-mcp

# Set tech stack mode
agentweaver init --mode strict
```

## 📁 What Gets Created

```
your-project/
├── .claude/
│   ├── agents/              # 8 AI agent templates
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── qa-tester.md
│   │   └── ...
│   └── skills/              # 3 reusable skill patterns
│       ├── api-pagination/
│       ├── ui-form-validation/
│       └── database-optimization/
├── .mcp.json                # MCP server configuration
├── .env.example             # Environment variables template
└── agentweaver.config.yml   # Tech stack configuration
```

## 🎮 Using Your Agents

Once installed, use agents directly in Claude Code:

```markdown
@backend-dev implement user authentication with JWT

@frontend-dev create a responsive dashboard layout with Tailwind

@qa-tester write E2E tests for the login flow

@tech-lead review the authentication architecture
```

## ⚙️ Configuration

### Tech Stack Modes

**Flexible** (Default) - Prefer detected stack, allow alternatives
```yaml
techStack:
  mode: flexible
  frontend:
    framework: nextjs
    language: typescript
```

**Strict** - Enforce only specified technologies
```yaml
techStack:
  mode: strict
  constraints:
    versionPinning: true
```

**Adaptive** - Auto-detect and adapt to project patterns
```yaml
techStack:
  mode: adaptive
```

### MCP Server Configuration

AgentWeaver can configure these MCP servers:
- **GitHub** - Repository operations, issues, PRs
- **Context7** - Documentation lookup
- **Sequential Thinking** - Complex analysis
- **Playwright** - E2E testing
- **shadcn/ui** - UI components
- **Supabase** - Database operations

## 🛠️ Development

### Building from Source
```bash
git clone https://github.com/CodeLift-LLC/AgentWeaver-CLI.git
cd AgentWeaver-CLI
npm install
npm run build
```

### Running Locally
```bash
npm link
agentweaver init
```

### Running Tests
```bash
npm test
npm run test:coverage
```

## 📖 Documentation

- [Agent Template Guide](docs/agent-templates.md)
- [Skills Library Reference](docs/skills-library.md)
- [Configuration Options](docs/configuration.md)
- [Creating Custom Agents](docs/custom-agents.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Creating Custom Agents

Create a new `.md` file with YAML frontmatter:

```markdown
---
name: my-agent
description: Custom agent description. Use PROACTIVELY when...
tools: Read, Write, Edit
model: sonnet
---

# My Custom Agent

Your agent instructions here...
```

### Creating Custom Skills

Create a directory with a `SKILL.md` file:

```markdown
---
name: My Skill
description: Skill description
allowed-tools:
  - Read
  - Write
tags:
  - api
  - backend
---

# My Skill

Skill documentation and patterns...
```

## 📝 License

MIT © [CodeLift LLC](https://github.com/CodeLift-LLC)

## 🔗 Links

- [GitHub Repository](https://github.com/CodeLift-LLC/AgentWeaver-CLI)
- [npm Package](https://www.npmjs.com/package/agentweaver-cli)
- [Issue Tracker](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- [Documentation](https://github.com/CodeLift-LLC/AgentWeaver-CLI/tree/main/docs)

## 🌟 Support

If you find AgentWeaver CLI helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs via [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- 💡 Suggest new features
- 📢 Share with your team

---

Made with ❤️ by [CodeLift LLC](https://www.codelift.codes)
