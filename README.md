# AgentWeaver CLI

> **AI-Powered Development Toolkit: Pre-Built Agents + Reusable Skills + Complete Tech Stack Templates**

AgentWeaver CLI is a comprehensive toolkit that accelerates your development workflow with:
- 🤖 **21 Pre-Built AI Agent Templates** for Claude Code
- 📚 **30+ Reusable Skill Patterns** with multi-framework support
- 🚀 **5 Production-Ready Tech Stack Templates** for rapid project setup
- ⚙️ **Intelligent Tech Stack Detection** across 8+ languages

Get from zero to production-ready in minutes, not hours.

[![npm version](https://badge.fury.io/js/agentweaver-cli.svg)](https://www.npmjs.com/package/agentweaver-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Quick Start

### Option 1: Add to Existing Project

```bash
# Install globally
npm install -g agentweaver-cli

# Add AI agents to your project
cd your-existing-project
agentweaver init
```

### Option 2: Start New Project with Template

```bash
# Create a new project with full stack template
mkdir my-saas-app
cd my-saas-app
agentweaver init --template nextjs-mvp
```

### Option 3: One-Command Setup (No Installation)

```bash
npx agentweaver-cli init
```

---

## ✨ What You Get

### 🤖 **21 Pre-Built AI Agent Templates**

Specialized AI assistants that integrate seamlessly with Claude Code:

<details>
<summary><b>Development Team (8 agents)</b></summary>

- **backend-dev** - Server-side development, REST/GraphQL APIs, database architecture
- **frontend-dev** - UI development with React/Vue/Angular, component libraries
- **ui-ux-dev** - Advanced animations, micro-interactions, accessibility
- **qa-tester** - Automated testing, E2E workflows, quality assurance
- **tech-lead** - Architecture decisions, code review, technical strategy
- **devops** - CI/CD pipelines, Docker, Kubernetes, cloud deployment
- **debugger** - Systematic debugging, root cause analysis, performance profiling
- **docs-writer** - Technical documentation, API docs, architecture diagrams
</details>

<details>
<summary><b>Product Team (2 agents)</b></summary>

- **product-owner** - Requirements gathering, user stories, backlog management
- **scrum-master** - Agile ceremonies, sprint planning, impediment removal
</details>

<details>
<summary><b>Marketing Team (6 agents)</b></summary>

- **marketing-manager** - Campaign strategy, GTM planning, analytics
- **content-writer** - Blog posts, case studies, educational content
- **seo-specialist** - SEO optimization, keyword research, SERP analysis
- **growth-marketer** - A/B testing, conversion optimization, growth hacking
- **social-media** - Social content calendar, engagement strategies
- **product-marketer** - Product positioning, messaging, competitive analysis
</details>

<details>
<summary><b>Sales Team (5 agents)</b></summary>

- **sales-manager** - Pipeline management, forecasting, deal strategy
- **sdr** - Lead prospecting, outbound campaigns, qualification
- **account-exec** - Deal closing, demos, negotiation
- **customer-success** - Onboarding, retention, expansion
- **sales-engineer** - Technical demos, POC delivery, integration support
</details>

**How agents work:**
- ✅ **Automatic Invocation** - Just ask naturally: *"Build a REST API for users"*
- ✅ **Manual Control** - Use `@agent-name` for precise control
- ✅ **Collaborative Workflows** - Agents hand off tasks to each other seamlessly

---

### 📚 **30+ Reusable Skills Library**

Framework-specific code patterns with intelligent template selection:

<details>
<summary><b>API Skills (5)</b></summary>

- **api-pagination** - Cursor & offset-based pagination
  - ✅ 7 Frameworks: Express, FastAPI, Spring Boot, ASP.NET Core, Gin, Rails, Laravel
- **api-authentication** - JWT, OAuth, session-based auth patterns
- **api-error-handling** - Centralized error handling middleware
- **api-rate-limiting** - Rate limiting strategies (token bucket, sliding window)
- **api-versioning** - API versioning patterns (URI, header, media type)
</details>

<details>
<summary><b>UI Skills (5)</b></summary>

- **ui-form-validation** - Form validation with React Hook Form, Zod, Yup
- **ui-accessibility** - WCAG 2.1 AA compliance patterns
- **ui-responsive-design** - Mobile-first responsive layouts
- **ui-state-management** - State management patterns (Context, Redux, Zustand)
- **ui-animations** - Animation libraries and micro-interactions
</details>

<details>
<summary><b>Database Skills (4)</b></summary>

- **database-optimization** - Query optimization, N+1 prevention, indexing
- **db-migrations** - Safe migration patterns (blue-green, rolling)
- **db-indexes** - Index strategies for different query patterns
- **db-transactions** - Transaction handling and isolation levels
</details>

<details>
<summary><b>Testing Skills (5)</b></summary>

- **test-unit-patterns** - Unit testing patterns and mocking
- **test-e2e-workflows** - E2E test workflows with Playwright/Cypress
- **test-mocking** - Mocking strategies for external dependencies
- **test-coverage** - Code coverage reporting and analysis
- **tdd-test-driven-development** - TDD practices and workflows
</details>

<details>
<summary><b>Architecture Skills (6)</b></summary>

- **clean-architecture** - Clean architecture layers and dependencies
- **ddd-domain-driven-design** - DDD tactical patterns (aggregates, entities, value objects)
- **vertical-slice-architecture** - Vertical slice architecture patterns
- **solid-principles** - SOLID principles with examples
- **design-patterns** - Gang of Four patterns (Factory, Strategy, Observer, etc.)
- **clean-code** - Clean code practices and refactoring patterns
</details>

<details>
<summary><b>Deployment Skills (4)</b></summary>

- **deploy-docker** - Docker containerization and multi-stage builds
- **deploy-ci-cd** - CI/CD pipelines (GitHub Actions, GitLab CI)
- **deploy-environment-config** - Environment management (dev, staging, prod)
- **deploy-monitoring** - Observability (logging, metrics, tracing)
</details>

<details>
<summary><b>Design Skills (2)</b></summary>

- **design-systems** - Design system architecture and tokens
- **component-generation** - Component scaffolding patterns
</details>

**Smart Template Selection:**
- 🎯 5-factor scoring algorithm (language, framework, version, dependencies, preferences)
- 🔄 Automatic framework detection
- 🎨 Handlebars variable interpolation for customization

---

### 🚀 **5 Production-Ready Tech Stack Templates**

Complete project scaffolds with Docker, testing, and CI/CD pre-configured:

| Template | Stack | Best For | Complexity |
|----------|-------|----------|-----------|
| **nextjs-mvp** | Next.js 15 + Supabase + AI | MVPs, SaaS, AI apps | Beginner |
| **nestjs-backend** | NestJS + PostgreSQL + Drizzle | REST APIs, microservices | Intermediate |
| **fastapi-backend** | FastAPI + Python + SQLAlchemy | Python APIs, ML services | Intermediate |
| **nextjs-nestjs-monorepo** | Next.js + NestJS monorepo | Full-stack enterprise | Advanced |
| **nextjs-fastapi-monorepo** | Next.js + FastAPI hybrid | AI/ML applications | Advanced |

**Every template includes:**
- ✅ Docker Compose development environment
- ✅ Database migrations (Drizzle/SQLAlchemy)
- ✅ Testing infrastructure (Vitest/Jest/Pytest + Playwright)
- ✅ CI/CD pipelines (GitHub Actions)
- ✅ Environment management (.env templates)
- ✅ Code quality tools (ESLint, Prettier, pre-commit hooks)
- ✅ API documentation (OpenAPI/Swagger)
- ✅ Pre-configured AI agents and skills

**Template Features:**
- 🔐 Authentication (Supabase Auth)
- 🤖 AI Integration (OpenAI SDK + Langfuse observability)
- 🔍 Vector Search (pgvector)
- 💳 Payments (Stripe)
- 📧 Email (Resend)
- 📁 File Storage (Supabase Storage)
- ⚡ Realtime (Supabase Realtime)
- 📊 Analytics

---

### ⚙️ **Intelligent Tech Stack Detection**

**Multi-Language Support (8 languages):**

| Language | Frameworks Detected | Template Packs | Status |
|----------|---------------------|----------------|--------|
| TypeScript | Express, NestJS, Hono, Elysia | express-typescript | ✅ Production |
| JavaScript | Express, Fastify, Koa | express-typescript | ✅ Production |
| Python | FastAPI, Django, Flask | fastapi | ✅ Production |
| Java | Spring Boot, Micronaut, Quarkus, Jakarta EE | spring-boot | ✅ Production |
| C# | ASP.NET Core, Blazor, MAUI | aspnet-core | ✅ Production |
| Go | Gin, Echo, Fiber, Chi | gin | ✅ Production |
| Ruby | Rails, Sinatra, Hanami | rails | ✅ Production |
| PHP | Laravel, Symfony, CodeIgniter | laravel | ✅ Production |

**Architecture Detection:**
- 🏗️ Monolith vs Microservices
- 📦 Monorepo detection (nx, Turborepo, pnpm workspaces, Lerna)
- 🎯 Vertical slice vs layered architecture
- 🌐 Monoglot vs polyglot

**Build Tool Detection:**
- Node: npm, yarn, pnpm, bun
- Python: pip, poetry, pipenv, uv
- Java: Maven, Gradle
- .NET: dotnet
- Go: go mod
- Ruby: bundler
- PHP: composer

---

### 🔍 **Template Pack Validation**

Built-in validation ensures quality and correctness:

```bash
agentweaver validate
```

**Validates:**
- ✅ Manifest schema completeness
- ✅ Source file existence
- ✅ Variable definitions and usage
- ✅ Version compatibility ranges
- ✅ Framework applicability rules
- ✅ Best practices compliance

---

### 🌐 **MCP Server Integration**

Pre-configured Model Context Protocol servers:

| Server | Purpose | Required Credentials |
|--------|---------|---------------------|
| **github** | Repository operations, issues, PRs | `GITHUB_TOKEN` |
| **fetch** | Web content fetching | None |
| **context7** | Documentation lookup | Optional: `CONTEXT7_API_KEY` |
| **sequential** | Complex analysis | None |
| **playwright** | E2E testing automation | None |
| **shadcn** | shadcn/ui components | None |
| **socket** | Security scanning | None |
| **supabase** | Database operations | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g agentweaver-cli
```

**Verify installation:**
```bash
agentweaver --version
# Output: 0.1.0
```

### Using npx (No Installation)

```bash
npx agentweaver-cli init
```

Perfect for trying AgentWeaver without committing to a global install.

### Local Installation

```bash
npm install --save-dev agentweaver-cli
```

**Use via npm scripts:**
```json
{
  "scripts": {
    "setup-agents": "agentweaver init"
  }
}
```

---

## 🎯 Usage

### Interactive Setup (Recommended)

```bash
agentweaver init
```

**You'll be guided through:**

1. **Tech Stack Template (Optional)**
   - Choose from 5 production-ready templates
   - Or skip to detect your existing project

2. **Feature Customization** (if template selected)
   - Select authentication, AI, payments, email, etc.

3. **Tech Stack Detection**
   - Automatic detection of languages, frameworks, tools
   - Multi-project support for monorepos

4. **Agent Selection**
   - All agents (21 total)
   - Development only (8 agents) ← Recommended
   - Custom selection

5. **Skills Installation**
   - All skills (30+) ← Recommended
   - Custom selection

6. **MCP Server Configuration**
   - Select servers: GitHub, Fetch, Context7, Sequential, etc.

7. **Tech Stack Mode**
   - Flexible - Prefer detected stack, allow alternatives (recommended)
   - Strict - Enforce detected stack only
   - Adaptive - Auto-detect and adapt

### Quick Setup (Skip Prompts)

```bash
# Use defaults
agentweaver init --yes

# With specific template
agentweaver init --yes --template nextjs-mvp

# Custom agents
agentweaver init --agents backend-dev,frontend-dev,qa-tester

# Custom skills
agentweaver init --skills api-pagination,database-optimization,ui-form-validation

# Strict mode
agentweaver init --mode strict

# Without MCP servers
agentweaver init --no-mcp
```

### List Available Templates

```bash
agentweaver templates
```

**Output:**
```
📦 Available Tech Stack Templates

1. Next.js Full-Stack MVP
   ID: nextjs-mvp
   Stack: Next.js 15 + Supabase + Drizzle + OpenAI
   Features: Authentication, AI, File Storage, Realtime
   ...

2. NestJS Backend
   ID: nestjs-backend
   Stack: NestJS + PostgreSQL + Drizzle
   ...
```

### Validate Template Packs

```bash
# Validate all template packs
agentweaver validate

# Validate specific skill
agentweaver validate --skill api-pagination

# Verbose output
agentweaver validate --skill api-pagination --verbose
```

### Regenerate Documentation

```bash
# After editing agentweaver.config.yml
agentweaver regenerate-docs
```

---

## 📁 What Gets Created

```
your-project/
├── .claude/
│   ├── agents/                     # AI agent templates
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── qa-tester.md
│   │   ├── tech-lead.md
│   │   ├── devops.md
│   │   ├── debugger.md
│   │   ├── ui-ux-dev.md
│   │   ├── docs-writer.md
│   │   └── ... (up to 21 agents)
│   ├── skills/                     # Reusable skill patterns
│   │   ├── api-pagination/
│   │   │   ├── SKILL.md
│   │   │   ├── templates/
│   │   │   └── templates-used.json
│   │   ├── database-optimization/
│   │   ├── ui-form-validation/
│   │   └── ... (up to 30+ skills)
│   ├── CLAUDE.md                   # Project context for Claude Code
│   ├── WORKFLOWS.md                # Agent collaboration workflows
│   ├── agentweaver.config.yml      # Tech stack configuration
│   └── tech-stack.md               # Human-readable tech docs
├── .mcp.json                       # MCP server configuration
├── .env.example                    # Environment variable template
└── .gitignore                      # Updated (excludes .claude/)
```

### Framework-Specific Code (from Skills)

**Spring Boot (Java):**
```
src/main/java/com/example/app/
├── pagination/
│   ├── CursorPagination.java
│   └── OffsetPagination.java
├── dto/
│   └── PaginationResponse.java
└── util/
    └── PaginationUtils.java
```

**FastAPI (Python):**
```
src/lib/pagination/
├── cursor_pagination.py
├── offset_pagination.py
├── schemas.py
└── __init__.py
```

**Express (TypeScript):**
```
src/lib/pagination/
├── cursor-pagination.ts
├── offset-pagination.ts
└── pagination.types.ts
```

---

## 🎮 Using Your Agents

### Automatic Invocation (Recommended)

Agents activate automatically based on your requests:

```bash
# These automatically invoke the right agent:

"Build a REST API for user management"
→ @backend-dev activates

"Create a responsive dashboard with charts"
→ @frontend-dev activates

"Write E2E tests for the authentication flow"
→ @qa-tester activates

"Review the database schema design"
→ @tech-lead activates

"Debug the 500 error on login endpoint"
→ @debugger activates
```

**How it works:**
- Each agent has trigger keywords in its `description`
- Claude Code matches your request to agent descriptions
- Best-fit agent is invoked automatically

### Manual Invocation

Use `@agent-name` for precise control:

```bash
@backend-dev implement JWT authentication with refresh tokens

@frontend-dev create a dashboard layout with Tailwind and shadcn/ui

@qa-tester write integration tests for the auth endpoints

@tech-lead review the authentication architecture

@debugger investigate the memory leak in the user service
```

### Agent Collaboration

Agents hand off tasks automatically:

```
You: "Build a complete user authentication system"

1. @backend-dev creates API endpoints
   → Hands off to @frontend-dev

2. @frontend-dev creates login UI
   → Hands off to @qa-tester

3. @qa-tester writes E2E tests
   → Hands off to @tech-lead

4. @tech-lead reviews architecture
   → Provides feedback and improvements
```

See `.claude/WORKFLOWS.md` for collaboration patterns.

---

## ⚙️ Configuration

### Tech Stack Modes

**Flexible (Default) - Recommended:**
```yaml
techStack:
  mode: flexible
  frontend:
    framework: react
    language: typescript
```
- Agents prefer React + TypeScript
- Can suggest alternatives with justification
- Asks permission before deviating

**Strict - Enterprise:**
```yaml
techStack:
  mode: strict
  frontend:
    framework: react
    language: typescript
  constraints:
    versionPinning: true
```
- Agents must use React + TypeScript only
- Rejects alternative suggestions
- Enforces version constraints

**Adaptive - Brownfield:**
```yaml
techStack:
  mode: adaptive
  autoDetect:
    enabled: true
    scanDepth: deep
```
- Continuously scans project files
- Adapts to any framework found
- No enforcement

### MCP Server Configuration

**In `.mcp.json`:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**In `.env`:**
```bash
GITHUB_TOKEN=ghp_your_token_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📖 Documentation

### Core Guides

- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Complete beginner tutorial
- **[CLI Reference](docs/CLI_REFERENCE.md)** - All commands and options
- **[Template Pack Authoring](TEMPLATE_PACK_GUIDE.md)** - Creating custom template packs
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Architecture deep dive

### Examples

**7 Complete Template Pack Examples:**
- [Express TypeScript Pagination](src/templates/skills/api-pagination/templates/express-typescript/)
- [FastAPI Pagination](src/templates/skills/api-pagination/templates/fastapi/)
- [Spring Boot Pagination](src/templates/skills/api-pagination/templates/spring-boot/)
- [ASP.NET Core Pagination](src/templates/skills/api-pagination/templates/aspnet-core/)
- [Gin Pagination](src/templates/skills/api-pagination/templates/gin/)
- [Rails Pagination](src/templates/skills/api-pagination/templates/rails/)
- [Laravel Pagination](src/templates/skills/api-pagination/templates/laravel/)

---

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

### Project Structure

```
AgentWeaver-CLI/
├── src/
│   ├── cli/
│   │   ├── index.ts              # CLI entry point
│   │   └── commands/
│   │       ├── init.ts           # Init command
│   │       ├── templates.ts      # Templates command
│   │       ├── validate.ts       # Validate command
│   │       └── regenerate-docs.ts
│   ├── lib/
│   │   ├── agent-installer.ts    # Agent installation
│   │   ├── skills-installer.ts   # Skill installation
│   │   ├── stack-installer.ts    # Template installation
│   │   ├── enhanced-tech-detector.ts
│   │   ├── template-resolver.ts  # Template pack selection
│   │   ├── template-pack-validator.ts
│   │   ├── config-generator.ts   # Config file generation
│   │   └── detectors/           # Language-specific detectors
│   ├── templates/
│   │   ├── agents/              # 21 agent templates
│   │   ├── skills/              # 30+ skill patterns
│   │   └── stacks/              # 5 tech stack templates
│   └── utils/
│       ├── file-operations.ts
│       └── yaml-parser.ts
├── docs/
│   ├── GETTING_STARTED.md
│   └── CLI_REFERENCE.md
├── tests/
└── package.json
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Creating Custom Agents

Create a `.md` file with YAML frontmatter:

```markdown
---
name: my-agent
description: Custom agent description. Use PROACTIVELY when...
tools: Read, Write, Edit, Bash
model: sonnet
---

# My Custom Agent

Your agent instructions here...
```

### Creating Custom Skills

Create a directory with `SKILL.md`:

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

### Creating Custom Template Packs

See **[Template Pack Authoring Guide](TEMPLATE_PACK_GUIDE.md)** for complete documentation.

**Quick start:**

1. Create directory: `src/templates/skills/[skill]/templates/[framework]/`
2. Add `manifest.json` with metadata
3. Add implementation files with Handlebars variables
4. Validate: `agentweaver validate --skill [skill]`

---

## 🔧 Troubleshooting

### Agents Not Auto-Invoking

1. Verify installation: `ls .claude/agents/`
2. Check frontmatter: `head .claude/agents/backend-dev.md`
3. Restart Claude Code
4. Use manual invocation: `@agent-name task`

### Skills Not Found

1. Verify installation: `ls .claude/skills/`
2. Check structure: `ls .claude/skills/api-pagination/`
3. Reinstall: `agentweaver init --skills all`

### MCP Servers Not Working

1. Check config: `cat .mcp.json`
2. Verify environment variables: `cat .env`
3. Test tokens: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user`
4. Restart Claude Code

### Tech Stack Not Detected

1. Add manifest files (package.json, requirements.txt, pom.xml, etc.)
2. Re-run: `agentweaver init`
3. Manual config: Edit `.claude/agentweaver.config.yml`

**Still stuck?**
- [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- Include: OS, Node version, error messages

---

## 📝 License

MIT © [CodeLift LLC](https://github.com/CodeLift-LLC)

---

## 🔗 Links

- [GitHub Repository](https://github.com/CodeLift-LLC/AgentWeaver-CLI)
- [npm Package](https://www.npmjs.com/package/agentweaver-cli)
- [Issue Tracker](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- [Documentation](https://github.com/CodeLift-LLC/AgentWeaver-CLI/tree/main/docs)

---

## 🌟 Support

If you find AgentWeaver CLI helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs via [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- 💡 Request features
- 📢 Share with your team

---

**Made with ❤️ by [CodeLift LLC](https://www.codelift.codes)**

*Accelerating development with AI-powered tooling*
