# CLI Reference

Complete reference for all AgentWeaver CLI commands, options, and usage patterns.

---

## Table of Contents

1. [Command Overview](#command-overview)
2. [agentweaver init](#agentweaver-init)
3. [agentweaver templates](#agentweaver-templates)
4. [agentweaver validate](#agentweaver-validate)
5. [agentweaver regenerate-docs](#agentweaver-regenerate-docs)
6. [Global Options](#global-options)
7. [Environment Variables](#environment-variables)
8. [Configuration Files](#configuration-files)
9. [Exit Codes](#exit-codes)

---

## Command Overview

```bash
agentweaver [command] [options]
```

| Command | Description |
|---------|-------------|
| `init` | Initialize AgentWeaver in a project (with optional template) |
| `templates` | List available tech stack templates |
| `validate` | Validate template packs for correctness |
| `regenerate-docs` | Regenerate documentation from config |
| `--version` | Show version number |
| `--help` | Show help information |

---

## agentweaver init

Initialize AgentWeaver in your project, optionally using a tech stack template.

### Synopsis

```bash
agentweaver init [options]
```

### Description

The `init` command sets up AgentWeaver in your project by:

1. **Optional:** Installing a complete tech stack template
2. Detecting your existing tech stack (or using template's stack)
3. Installing AI agent templates
4. Installing reusable skill patterns with framework-specific code
5. Configuring MCP servers
6. Generating configuration files

### Options

#### `--template <template-id>`

Install a specific tech stack template.

**Examples:**
```bash
# Start with Next.js MVP template
agentweaver init --template nextjs-mvp

# Start with NestJS backend
agentweaver init --template nestjs-backend

# Start with FastAPI backend
agentweaver init --template fastapi-backend

# Start with full-stack monorepo
agentweaver init --template nextjs-nestjs-monorepo
```

**Available templates:**
- `nextjs-mvp` - Next.js + Supabase + AI integration
- `nestjs-backend` - NestJS REST API
- `fastapi-backend` - FastAPI Python API
- `nextjs-nestjs-monorepo` - Full-stack TypeScript monorepo
- `nextjs-fastapi-monorepo` - Next.js + FastAPI monorepo

Use `agentweaver templates` to see all available templates with details.

#### `-y, --yes`

Skip all prompts and use default options.

**Defaults when using `--yes`:**
- Agents: Development agents only (8 agents)
- Skills: All skills
- MCP servers: github, fetch, context7, sequential
- Mode: flexible

**Examples:**
```bash
# Quick setup with defaults
agentweaver init --yes

# Quick setup with template
agentweaver init --yes --template nextjs-mvp

# Quick setup with specific mode
agentweaver init --yes --mode strict
```

#### `--agents <agent-list>`

Specify which agents to install (comma-separated).

**Examples:**
```bash
# Install specific agents
agentweaver init --agents backend-dev,frontend-dev,qa-tester

# Install only backend agents
agentweaver init --agents backend-dev,devops,debugger

# Install all marketing agents
agentweaver init --agents marketing-manager,content-writer,seo-specialist

# Install single agent
agentweaver init --agents backend-dev
```

**Available agents:**

**Development (8):**
- `backend-dev` - Backend development, APIs, databases
- `frontend-dev` - Frontend development, React/Vue
- `ui-ux-dev` - Advanced UI/UX, animations
- `qa-tester` - Testing, quality assurance
- `tech-lead` - Architecture, code review
- `devops` - CI/CD, infrastructure
- `debugger` - Debugging, troubleshooting
- `docs-writer` - Documentation

**Product (2):**
- `product-owner` - Requirements, user stories
- `scrum-master` - Agile processes

**Marketing (6):**
- `marketing-manager` - Marketing strategy
- `content-writer` - Content creation
- `seo-specialist` - SEO optimization
- `growth-marketer` - Growth hacking
- `social-media` - Social media
- `product-marketer` - Product marketing

**Sales (5):**
- `sales-manager` - Sales strategy
- `sdr` - Sales development
- `account-exec` - Account management
- `customer-success` - Customer success
- `sales-engineer` - Sales engineering

If omitted, you'll be prompted interactively.

#### `--skills <skill-list>`

Specify which skills to install (comma-separated).

**Examples:**
```bash
# Install specific skills
agentweaver init --skills api-pagination,database-optimization,ui-form-validation

# Install only API skills
agentweaver init --skills api-pagination,api-authentication,api-error-handling

# Install only testing skills
agentweaver init --skills test-unit-patterns,test-e2e-workflows,test-mocking

# Skip skills entirely
agentweaver init --skills none
```

**Available skills (30+):**

**API:**
- `api-pagination`
- `api-authentication`
- `api-error-handling`
- `api-rate-limiting`
- `api-versioning`

**UI:**
- `ui-form-validation`
- `ui-accessibility`
- `ui-responsive-design`
- `ui-state-management`
- `ui-animations`

**Database:**
- `database-optimization`
- `db-migrations`
- `db-indexes`
- `db-transactions`

**Testing:**
- `test-unit-patterns`
- `test-e2e-workflows`
- `test-mocking`
- `test-coverage`
- `tdd-test-driven-development`

**Architecture:**
- `clean-architecture`
- `ddd-domain-driven-design`
- `vertical-slice-architecture`
- `solid-principles`
- `design-patterns`
- `clean-code`

**Deployment:**
- `deploy-docker`
- `deploy-ci-cd`
- `deploy-environment-config`
- `deploy-monitoring`

**Design:**
- `design-systems`
- `component-generation`

If omitted, you'll be prompted interactively (default: install all).

#### `--no-mcp`

Skip MCP server configuration entirely.

**Examples:**
```bash
# Install agents but skip MCP setup
agentweaver init --no-mcp

# Useful for air-gapped environments
agentweaver init --no-mcp --yes
```

**When to use:**
- You don't use MCP servers
- You'll configure MCP manually later
- Air-gapped/offline environment

#### `--mode <mode>`

Set tech stack enforcement mode.

**Values:**
- `flexible` - Prefer detected stack, allow alternatives (default)
- `strict` - Enforce detected stack only, no alternatives
- `adaptive` - Auto-detect and adapt to any stack

**Examples:**
```bash
# Flexible mode (recommended)
agentweaver init --mode flexible

# Strict mode (enterprise)
agentweaver init --mode strict

# Adaptive mode (brownfield projects)
agentweaver init --mode adaptive
```

**Mode comparison:**

| Feature | Flexible | Strict | Adaptive |
|---------|----------|--------|----------|
| Suggests alternatives | ✅ Yes | ❌ No | ✅ Yes |
| Enforces tech stack | ⚠️ Preferred | ✅ Required | ❌ No |
| Auto-adapts to changes | ❌ No | ❌ No | ✅ Yes |
| Best for | Most projects | Enterprise | Brownfield |

### Interactive Prompts

When running without `--yes`, you'll be prompted:

```bash
$ agentweaver init

🚀 AgentWeaver CLI - Setup Wizard

? Start with a pre-configured tech stack template? (y/N)
  # Options: Yes → template selection | No → detect existing

? Select a tech stack template:
  Skip - Detect existing project
  Next.js Full-Stack MVP - Rapid prototyping with Next.js + Supabase
  NestJS Backend - REST API with NestJS + PostgreSQL
  ...

# If template selected:
🎨 Customize features:

? Select features to include:
  ✓ Authentication (Supabase Auth)
  ○ AI Integration (OpenAI SDK + Langfuse)
  ○ Vector Search (pgvector)
  ...

📊 Detected Technologies:
  Architecture: monolith (monoglot)
  1. typescript (nextjs) - 95% confidence

? Which agents would you like to install?
  All agents (21 total agents)
  Development agents only (8 agents)
  Custom selection

# If custom:
? Select agents to install:
  ✓ backend-dev - Expert Backend Developer...
  ✓ frontend-dev - Expert Frontend Developer...
  ...

? Install reusable skills library? (Y/n)

? Configure MCP servers (.mcp.json)? (Y/n)

# If yes:
? Select MCP servers to configure:
  ✓ GitHub (repository operations)
  ✓ Fetch (web content fetching)
  ✓ Context7 (documentation lookup)
  ✓ Sequential Thinking (complex analysis)
  ○ Playwright (E2E testing)
  ○ shadcn/ui (UI components)
  ○ Socket (security scanning)
  ○ Supabase (database)

? Tech stack mode:
  Flexible - Prefer detected stack, allow alternatives (recommended)
  Strict - Enforce detected stack only
  Adaptive - Auto-detect and adapt
```

### Examples

#### Basic initialization

```bash
# Interactive setup (recommended for first-time)
agentweaver init

# Quick setup with defaults
agentweaver init --yes

# Setup in specific directory
cd my-project && agentweaver init
```

#### With tech stack template

```bash
# New Next.js MVP project
mkdir my-saas
cd my-saas
agentweaver init --template nextjs-mvp

# New NestJS API
mkdir my-api
cd my-api
agentweaver init --template nestjs-backend --yes

# With feature customization (interactive)
agentweaver init --template nextjs-mvp
# Then select features interactively
```

#### Custom agent selection

```bash
# Backend-only project
agentweaver init --agents backend-dev,devops,qa-tester

# Frontend-only project
agentweaver init --agents frontend-dev,ui-ux-dev,qa-tester

# Marketing project
agentweaver init --agents content-writer,seo-specialist,social-media

# Minimal setup
agentweaver init --agents backend-dev --skills api-pagination,database-optimization
```

#### Different tech stack modes

```bash
# Flexible (default) - for most projects
agentweaver init --mode flexible

# Strict - for enterprise projects
agentweaver init --mode strict --yes

# Adaptive - for existing/brownfield projects
cd existing-project
agentweaver init --mode adaptive
```

#### Advanced combinations

```bash
# Minimal backend setup with strict mode
agentweaver init \
  --agents backend-dev,qa-tester \
  --skills api-pagination,database-optimization \
  --mode strict \
  --no-mcp

# Full-stack with all bells and whistles
agentweaver init \
  --template nextjs-nestjs-monorepo \
  --yes

# Quick backend API without prompts
agentweaver init \
  --template nestjs-backend \
  --yes \
  --mode flexible
```

### Output

After successful initialization:

```
✅ Installation complete!

📁 Created:
  .claude/
  ├── agents/                (8 agents)
  ├── skills/                (30 skills)
  ├── CLAUDE.md              (Project context)
  ├── WORKFLOWS.md           (Agent workflows)
  ├── agentweaver.config.yml (Tech stack config)
  └── tech-stack.md          (Tech stack overview)
  .mcp.json                  (MCP servers at root)
  .env.example               (Environment variables)
  .gitignore                 (Updated to exclude .claude/)

🎯 Next steps:

  1. Copy .env.example to .env and fill in your credentials:
     - GITHUB_TOKEN (from https://github.com/settings/tokens)

  2. Restart Claude Code to load the new agents

  3. Open .claude/CLAUDE.md to see all available agents and their usage

  4. Start using your agents:
     "Build a REST API for users"  (automatic invocation)
     @backend-dev implement authentication  (manual invocation)

📚 Documentation: https://github.com/CodeLift-LLC/AgentWeaver-CLI
```

### Files Created

| File | Location | Description |
|------|----------|-------------|
| `CLAUDE.md` | `.claude/` | Project overview for Claude Code |
| `WORKFLOWS.md` | `.claude/` | Agent collaboration workflows |
| `agentweaver.config.yml` | `.claude/` | Tech stack configuration |
| `tech-stack.md` | `.claude/` | Human-readable tech stack docs |
| `*.md` | `.claude/agents/` | Individual agent templates |
| `SKILL.md` | `.claude/skills/*/` | Skill documentation |
| `manifest.json` | `.claude/skills/*/templates/*/` | Template pack metadata |
| `.mcp.json` | project root | MCP server configuration |
| `.env.example` | project root | Environment variable template |

---

## agentweaver templates

List all available tech stack templates.

### Synopsis

```bash
agentweaver templates
```

### Description

Displays detailed information about all available tech stack templates, including:
- Template name and description
- Tech stack components (framework, language, database)
- Default and optional features
- Complexity level
- Architecture pattern
- Usage example

### Options

None.

### Examples

```bash
# List all templates
agentweaver templates
```

### Output

```
📦 Available Tech Stack Templates

1. Next.js Full-Stack MVP
   ID: nextjs-mvp
   Rapid prototyping stack with Next.js 15, Supabase, Drizzle ORM...

   Tech Stack:
     Framework: nextjs
     Language: typescript
     Database: supabase
     ORM: drizzle
     Package Manager: pnpm

   Features:
     ✓ Default: authentication, fileStorage, realtime
     ⚙ Optional: aiIntegration, payments, email, analytics

   Details:
     Complexity: beginner
     Architecture: vertical-slice
     Files: 45
     Docker Services: 2

   Usage:
     agentweaver init --template nextjs-mvp

   ─────────────────────────────────────────

2. NestJS Backend
   ...

💡 Tip:
  Run `agentweaver init` for interactive template selection
  See TEMPLATES.md for detailed documentation
```

### See Also

- `agentweaver init --template <template-id>` - Initialize with template
- [TEMPLATES.md](TEMPLATES.md) - Detailed template documentation

---

## agentweaver validate

Validate template packs for correctness.

### Synopsis

```bash
agentweaver validate [options]
```

### Description

Validates template pack manifests and files to ensure:
- Manifest schema is valid
- All source files exist
- Variables are properly defined
- Version compatibility is correct
- Best practices are followed

### Options

#### `--skill <skill-name>`

Validate template packs for a specific skill.

**Examples:**
```bash
# Validate api-pagination template packs
agentweaver validate --skill api-pagination

# Validate database-optimization template packs
agentweaver validate --skill database-optimization

# Validate ui-form-validation template packs
agentweaver validate --skill ui-form-validation
```

#### `--pack <pack-directory>`

Validate a specific template pack directory.

**Examples:**
```bash
# Validate a specific pack by path
agentweaver validate --pack src/templates/skills/api-pagination/templates/express-typescript

# Validate fastapi pagination pack
agentweaver validate --pack src/templates/skills/api-pagination/templates/fastapi
```

#### `-v, --verbose`

Show detailed validation information.

**Examples:**
```bash
# Verbose validation of all packs
agentweaver validate --verbose

# Verbose validation of specific skill
agentweaver validate --skill api-pagination --verbose

# Verbose validation of specific pack
agentweaver validate --pack src/templates/skills/api-pagination/templates/spring-boot --verbose
```

### Examples

#### Validate all template packs

```bash
agentweaver validate
```

**Output:**
```
🔍 AgentWeaver Template Pack Validator

Validating all template packs...

api-pagination:
  ✅ aspnet-core-pagination
  ✅ express-typescript-pagination
  ✅ fastapi-pagination
  ✅ gin-pagination
  ✅ laravel-pagination
  ✅ rails-pagination
  ✅ spring-boot-pagination

ui-form-validation:
  ✅ react-hook-form

database-optimization:
  ✅ postgresql-optimization

📊 Summary:
  ✅ Valid: 9
  ❌ Invalid: 0
```

#### Validate specific skill

```bash
agentweaver validate --skill api-pagination
```

**Output:**
```
🔍 AgentWeaver Template Pack Validator

Found 7 template pack(s) for api-pagination:

  ✅ aspnet-core-pagination
  ✅ express-typescript-pagination
  ✅ fastapi-pagination
  ✅ gin-pagination
  ✅ laravel-pagination
  ✅ rails-pagination
  ✅ spring-boot-pagination

📊 Summary:
  ✅ Valid: 7
```

#### Validate with verbose output

```bash
agentweaver validate --skill api-pagination --verbose
```

**Output:**
```
🔍 AgentWeaver Template Pack Validator

Validating: express-typescript-pagination

✅ Manifest exists
✅ Manifest is valid JSON
✅ Required fields present:
    - name: express-typescript-pagination
    - version: 1.0.0
    - description: API pagination for Express + TypeScript
    - applicability.language: typescript
    - applicability.framework: [express]
✅ All source files exist:
    - cursor-pagination.ts
    - offset-pagination.ts
    - pagination.types.ts
✅ All variables defined:
    - srcPath (default: src)
    - maxPageSize (default: 100)
✅ Version compatibility: >=4.0.0
✅ Best practices followed

✅ express-typescript-pagination is valid

...
```

#### Validate specific pack

```bash
agentweaver validate --pack src/templates/skills/api-pagination/templates/fastapi --verbose
```

### Exit Codes

- `0` - All validations passed
- `1` - Validation errors found

### See Also

- [TEMPLATE_PACK_GUIDE.md](../TEMPLATE_PACK_GUIDE.md) - Creating template packs
- `agentweaver init` - Install validated template packs

---

## agentweaver regenerate-docs

Regenerate documentation files from current configuration.

### Synopsis

```bash
agentweaver regenerate-docs
```

### Description

Regenerates `.claude/tech-stack.md` from `.claude/agentweaver.config.yml`.

Useful after manually editing configuration to update documentation.

### Options

None.

### Examples

```bash
# After editing agentweaver.config.yml
agentweaver regenerate-docs
```

### Output

```
✅ Documentation regenerated

Updated:
  .claude/tech-stack.md
```

### Workflow

1. Edit `.claude/agentweaver.config.yml`:
   ```yaml
   techStack:
     frontend:
       framework: nextjs  # Changed from react
       version: "15.0.0"  # Added version
   ```

2. Run regenerate:
   ```bash
   agentweaver regenerate-docs
   ```

3. View updated docs:
   ```bash
   cat .claude/tech-stack.md
   ```

### See Also

- `.claude/agentweaver.config.yml` - Source configuration
- `.claude/tech-stack.md` - Generated documentation

---

## Global Options

These options work with all commands.

### `--version`

Show version number.

```bash
agentweaver --version
# Output: 0.1.0
```

### `--help`

Show help information.

```bash
# General help
agentweaver --help

# Command-specific help
agentweaver init --help
agentweaver templates --help
agentweaver validate --help
```

---

## Environment Variables

AgentWeaver respects these environment variables:

### `GITHUB_TOKEN`

GitHub Personal Access Token for GitHub MCP server.

**Required for:**
- GitHub MCP server operations
- Repository interactions
- Issue/PR management

**Get token from:**
https://github.com/settings/tokens

**Scopes needed:**
- `repo` - Full repository access
- `read:user` - Read user profile

**Usage:**
```bash
export GITHUB_TOKEN=ghp_your_token_here
agentweaver init
```

### `SUPABASE_URL`

Supabase project URL for Supabase MCP server.

**Required for:**
- Supabase MCP server
- Database operations

**Get from:**
Supabase project settings → API → Project URL

**Usage:**
```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
agentweaver init
```

### `SUPABASE_SERVICE_ROLE_KEY`

Supabase service role key for admin operations.

**Required for:**
- Supabase MCP server
- Admin database access

**Get from:**
Supabase project settings → API → Service Role Key

**Warning:** Keep this secret! It has admin access.

### `.env` File

Instead of exporting, use a `.env` file:

```bash
# .env
GITHUB_TOKEN=ghp_your_token_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

AgentWeaver generates `.env.example` with required variables.

---

## Configuration Files

### `.claude/agentweaver.config.yml`

Main configuration file for tech stack and agent behavior.

**Location:** `.claude/agentweaver.config.yml`

**Format:** YAML

**Example:**
```yaml
techStack:
  mode: flexible

  frontend:
    framework: nextjs
    version: "15.0.0"
    language: typescript
    styling: tailwindcss
    uiLibrary: shadcn-ui

  backend:
    framework: nextjs
    language: typescript
    runtime: node

  database:
    primary: supabase
    orm: drizzle
    migrations: drizzle-kit

  testing:
    unit: vitest
    integration: vitest
    e2e: playwright

  packageManager:
    node: pnpm
```

**Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `techStack.mode` | `flexible` \| `strict` \| `adaptive` | Enforcement mode |
| `techStack.frontend.*` | object | Frontend configuration |
| `techStack.backend.*` | object | Backend configuration |
| `techStack.database.*` | object | Database configuration |
| `techStack.testing.*` | object | Testing configuration |
| `techStack.deployment.*` | object | Deployment configuration |
| `techStack.packageManager.*` | object | Package manager config |

### `.mcp.json`

MCP server configuration.

**Location:** `.mcp.json` (project root)

**Format:** JSON

**Example:**
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
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "sequential": {
      "command": "npx",
      "args": ["-y", "@anthropic/sequential-thinking-mcp-server"]
    }
  }
}
```

**Available servers:**
- `github` - GitHub operations
- `fetch` - Web fetching
- `context7` - Documentation
- `sequential` - Sequential thinking
- `playwright` - E2E testing
- `shadcn` - shadcn/ui components
- `socket` - Security scanning
- `supabase` - Database operations

### `.claude/CLAUDE.md`

Project context for Claude Code.

**Auto-generated** - contains:
- Project description
- Tech stack summary
- Available agents
- Available skills

**Don't edit manually** - regenerate with:
```bash
agentweaver regenerate-docs
```

### `.claude/tech-stack.md`

Human-readable tech stack documentation.

**Auto-generated** from `agentweaver.config.yml`.

**Regenerate after config changes:**
```bash
agentweaver regenerate-docs
```

---

## Exit Codes

AgentWeaver uses standard exit codes:

| Code | Meaning | When it happens |
|------|---------|----------------|
| `0` | Success | Command completed successfully |
| `1` | General error | Command failed (see error message) |
| `2` | Invalid usage | Invalid arguments or options |

**Examples:**
```bash
# Success
agentweaver init --yes
echo $?  # Output: 0

# Error - invalid template
agentweaver init --template invalid-template
echo $?  # Output: 1

# Error - invalid option
agentweaver init --invalid-option
echo $?  # Output: 2
```

---

## See Also

- [Getting Started Guide](GETTING_STARTED.md) - Beginner tutorial
- [Agent Guide](AGENT_GUIDE.md) - Deep dive into agents
- [Skills Library](SKILLS_LIBRARY.md) - All available skills
- [Template Pack Guide](../TEMPLATE_PACK_GUIDE.md) - Creating custom templates
- [GitHub Repository](https://github.com/CodeLift-LLC/AgentWeaver-CLI)

---

**Made with ❤️ by [CodeLift LLC](https://www.codelift.codes)**
