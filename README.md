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

### 🤖 **9 Pre-Built Development Agent Templates**
- **backend-dev** - Backend development, APIs, databases
- **frontend-dev** - UI development, accessibility, performance
- **qa-tester** - Testing automation, quality assurance
- **tech-lead** - Architecture, code review, technical decisions
- **devops** - CI/CD, infrastructure, deployment
- **debugger** - Systematic debugging, error investigation, root cause analysis
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
│   ├── agents/                  # 8 AI agent templates
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── qa-tester.md
│   │   └── ...
│   ├── skills/                  # 3 reusable skill patterns
│   │   ├── api-pagination/
│   │   ├── ui-form-validation/
│   │   └── database-optimization/
│   ├── CLAUDE.md                # Project context (read by Claude Code)
│   ├── .mcp.json                # MCP server configuration
│   └── agentweaver.config.yml   # Tech stack configuration
└── .env.example                 # Environment variables template
```

## 🎮 Using Your Agents

### Automatic Invocation (Recommended)

Agents are configured to be **automatically invoked** by Claude Code when you ask for tasks they specialize in:

```markdown
"Build a REST API for user authentication"
→ Claude Code automatically invokes @backend-dev

"Create a responsive navigation component"
→ Claude Code automatically invokes @frontend-dev

"Write tests for the login flow"
→ Claude Code automatically invokes @qa-tester
```

**How it works:**
- Each agent has a `description` field with triggers (e.g., "Use PROACTIVELY when backend code changes...")
- Claude Code matches your request to the appropriate agent
- The agent is invoked automatically with full context

### Manual Invocation

You can also explicitly request specific agents using `@agent-name`:

```markdown
@backend-dev implement user authentication with JWT

@frontend-dev create a responsive dashboard layout with Tailwind

@qa-tester write E2E tests for the login flow

@tech-lead review the authentication architecture

@debugger investigate why users are getting 500 errors on login
```

### When to Use Each Method

**Automatic** (Just ask naturally):
- ✅ Faster - no need to remember agent names
- ✅ Claude picks the best agent for the task
- ✅ Works across conversations

**Manual** (Use `@agent-name`):
- ✅ Precise control over which agent handles the task
- ✅ Useful when you want a specific perspective
- ✅ Override automatic selection if needed

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

## 🔧 Troubleshooting

### Agents Not Automatically Invoked

If agents aren't being invoked automatically:

1. **Verify Installation**
   ```bash
   ls -la .claude/agents/
   # Should show: backend-dev.md, frontend-dev.md, etc.
   ```

2. **Check Agent Files**
   ```bash
   head -n 5 .claude/agents/backend-dev.md
   # Should show frontmatter with: name, description, tools, model
   ```

3. **Restart Claude Code**
   - Close and reopen Claude Code
   - Agents are loaded when Claude Code starts

4. **Use Manual Invocation**
   - Try explicit invocation: `@backend-dev build an API`
   - If manual works but automatic doesn't, the agent is installed correctly

5. **Check Description Triggers**
   - Each agent's `description` includes "Use PROACTIVELY when..."
   - Claude Code matches your request against these triggers

### Agents Not Found (Manual Invocation)

If `@agent-name` shows "agent not found":

1. **Check File Names**
   - Agent files must match their `name` field
   - Example: `backend-dev.md` must have `name: backend-dev`

2. **Verify Directory Structure**
   ```
   .claude/
   └── agents/
       ├── backend-dev.md  ✅ Correct
       └── frontend/
           └── dev.md      ❌ Wrong - must be at agents/ root level
   ```

3. **Check Frontmatter Format**
   ```markdown
   ---
   name: backend-dev
   description: Expert Backend Developer...
   ---
   ```
   - YAML must be valid (use proper indentation)
   - Description must not be empty

### Skills Not Available

If skills aren't showing up:

1. **Check Installation**
   ```bash
   ls -la .claude/skills/
   # Should show: api-pagination/, ui-form-validation/, database-optimization/
   ```

2. **Verify Structure**
   ```
   .claude/skills/
   └── api-pagination/
       ├── SKILL.md          ✅ Required
       ├── templates/        ✅ Optional
       └── examples/         ✅ Optional
   ```

### MCP Servers Not Working

If MCP servers aren't connecting:

1. **Check Configuration**
   ```bash
   cat .mcp.json
   # Should show configured servers
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API tokens
   ```

3. **Verify Tokens**
   - GitHub: Generate at [github.com/settings/tokens](https://github.com/settings/tokens)
   - Supabase: Get from your project settings

### Still Having Issues?

- **Check Claude Code Version**: Ensure you're using the latest version
- **Review Logs**: Check Claude Code logs for errors
- **Open an Issue**: [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- **Manual Invocation**: Always works as fallback (`@agent-name task`)

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
