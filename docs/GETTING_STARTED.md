# Getting Started with AgentWeaver CLI

**AgentWeaver CLI** is a powerful tool that bootstraps your projects with pre-built AI agent templates, reusable skill patterns, and complete tech stack templates for rapid development.

---

## 📋 Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Understanding AgentWeaver](#understanding-agentweaver)
4. [Your First Project](#your-first-project)
5. [Working with Agents](#working-with-agents)
6. [Using Skills](#using-skills)
7. [Tech Stack Templates](#tech-stack-templates)
8. [Configuration](#configuration)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Installation

### Global Installation (Recommended)

```bash
npm install -g agentweaver-cli
```

After installation, verify:
```bash
agentweaver --version
# Should output: 0.1.0
```

### Using npx (No Installation Required)

```bash
npx agentweaver-cli init
```

Perfect for trying AgentWeaver without committing to a global install.

### Local Installation

```bash
npm install --save-dev agentweaver-cli
```

Then use via npm scripts:
```json
{
  "scripts": {
    "setup-agents": "agentweaver init"
  }
}
```

---

## Quick Start

### Option 1: Add to Existing Project

```bash
cd your-existing-project
agentweaver init
```

AgentWeaver will:
1. ✅ Detect your tech stack automatically
2. ✅ Install AI agents tailored to your needs
3. ✅ Add reusable skill patterns
4. ✅ Configure MCP servers
5. ✅ Generate project documentation

### Option 2: Start New Project with Template

```bash
mkdir my-new-project
cd my-new-project
agentweaver init --template nextjs-mvp
```

This creates a complete project with:
- Full tech stack (Next.js + Supabase + AI integration)
- Pre-configured AI agents
- Docker setup
- Testing infrastructure
- CI/CD pipelines

---

## Understanding AgentWeaver

AgentWeaver has **three main components**:

### 1. 🤖 **AI Agents** (21 Pre-Built Templates)

Specialized AI assistants that work with Claude Code:

**Development Team (8 agents):**
- `backend-dev` - APIs, databases, server-side logic
- `frontend-dev` - UI/UX, React/Vue components
- `ui-ux-dev` - Advanced animations, interactions
- `qa-tester` - Automated testing, quality assurance
- `tech-lead` - Architecture, code review
- `devops` - CI/CD, deployment, infrastructure
- `debugger` - Systematic debugging, root cause analysis
- `docs-writer` - Technical documentation

**Marketing Team (6 agents):**
- `marketing-manager` - Campaign strategy
- `content-writer` - Blog posts, articles
- `seo-specialist` - SEO optimization
- `growth-marketer` - A/B testing, conversions
- `social-media` - Social content
- `product-marketer` - Product positioning

**Sales Team (7 agents):**
- `sales-manager` - Pipeline management
- `sdr` - Lead prospecting
- `account-exec` - Deal closing
- `customer-success` - Customer retention
- `sales-engineer` - Technical demos
- `product-owner` - Requirements, backlog
- `scrum-master` - Agile processes

### 2. 📚 **Skills** (30+ Reusable Patterns)

Framework-specific code templates with multi-language support:

**API Skills:**
- `api-pagination` - 7 framework implementations
- `api-authentication` - JWT, OAuth patterns
- `api-error-handling` - Error middleware
- `api-rate-limiting` - Rate limiting strategies
- `api-versioning` - API versioning patterns

**UI Skills:**
- `ui-form-validation` - Form validation patterns
- `ui-accessibility` - WCAG compliance
- `ui-responsive-design` - Responsive layouts
- `ui-state-management` - State patterns
- `ui-animations` - Animation libraries

**Database Skills:**
- `database-optimization` - Query optimization
- `db-migrations` - Migration patterns
- `db-indexes` - Indexing strategies
- `db-transactions` - Transaction handling

**Testing Skills:**
- `test-unit-patterns` - Unit test patterns
- `test-e2e-workflows` - E2E test workflows
- `test-mocking` - Mocking strategies
- `test-coverage` - Coverage reporting
- `tdd-test-driven-development` - TDD practices

**Architecture Skills:**
- `clean-architecture` - Clean architecture patterns
- `ddd-domain-driven-design` - DDD patterns
- `vertical-slice-architecture` - Vertical slice patterns
- `solid-principles` - SOLID principles
- `design-patterns` - Common design patterns
- `clean-code` - Clean code practices

**Deployment Skills:**
- `deploy-docker` - Docker containerization
- `deploy-ci-cd` - CI/CD pipelines
- `deploy-environment-config` - Environment management
- `deploy-monitoring` - Monitoring & observability

### 3. 🚀 **Tech Stack Templates** (5 Production-Ready Starters)

Complete project scaffolds:

1. **nextjs-mvp** - Next.js + Supabase + AI integration
2. **nestjs-backend** - NestJS REST API with PostgreSQL
3. **fastapi-backend** - FastAPI microservice
4. **nextjs-nestjs-monorepo** - Full-stack monorepo
5. **nextjs-fastapi-monorepo** - Next.js + FastAPI monorepo

---

## Your First Project

Let's build a simple API project with AgentWeaver:

### Step 1: Initialize AgentWeaver

```bash
mkdir my-api-project
cd my-api-project
agentweaver init
```

### Step 2: Interactive Setup

You'll be asked:

**1. Tech Stack Template?**
```
? Start with a pre-configured tech stack template?
  ○ Yes - Choose a template
  ● No - Detect existing project
```

For now, select **No** (we'll explore templates later).

**2. Agent Selection:**
```
? Which agents would you like to install?
  ○ All agents (21 total agents)
  ● Development agents only (8 agents)  ← Recommended
  ○ Custom selection
```

Select **Development agents** for a typical project.

**3. Skills Installation:**
```
? Install reusable skills library?
  ● Yes  ← Recommended
  ○ No
```

Select **Yes** to get all skill patterns.

**4. MCP Servers:**
```
? Configure MCP servers (.mcp.json)?
  ● Yes
  ○ No
```

Select **Yes** and choose:
- ✅ GitHub (repository operations)
- ✅ Fetch (web content)
- ✅ Context7 (documentation)
- ✅ Sequential Thinking (analysis)

**5. Tech Stack Mode:**
```
? Tech stack mode:
  ● Flexible - Prefer detected stack, allow alternatives (recommended)
  ○ Strict - Enforce detected stack only
  ○ Adaptive - Auto-detect and adapt
```

Select **Flexible** (default).

### Step 3: What Gets Created

```
your-project/
├── .claude/
│   ├── agents/                  # 8 AI agent templates
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── qa-tester.md
│   │   ├── tech-lead.md
│   │   ├── devops.md
│   │   ├── debugger.md
│   │   ├── ui-ux-dev.md
│   │   └── docs-writer.md
│   ├── skills/                  # 30+ reusable skills
│   │   ├── api-pagination/
│   │   ├── database-optimization/
│   │   └── ...
│   ├── CLAUDE.md                # Project overview
│   ├── WORKFLOWS.md             # Agent workflows
│   ├── agentweaver.config.yml   # Tech stack configuration
│   └── tech-stack.md            # Tech stack documentation
├── .mcp.json                    # MCP server config
├── .env.example                 # Environment variables
└── .gitignore                   # Updated (excludes .claude/)
```

### Step 4: Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Add your API tokens
# Edit .env and add:
# - GITHUB_TOKEN (get from https://github.com/settings/tokens)
# - Other service credentials as needed
```

### Step 5: Start Using Agents

Open your project in Claude Code and try:

**Automatic Invocation (Recommended):**
```
"Build a REST API for user management"
```
→ Claude Code automatically invokes `@backend-dev`

**Manual Invocation:**
```
@backend-dev create a paginated API endpoint for listing users
```

**Using Skills:**
```
@backend-dev use the api-pagination skill to add pagination
```

---

## Working with Agents

### Automatic vs Manual Invocation

#### Automatic (Just Ask Naturally)

Agents are configured to activate automatically based on context:

```bash
# These automatically invoke the right agent:

"Add user authentication to the API"
→ @backend-dev activates

"Create a responsive navigation component"
→ @frontend-dev activates

"Write E2E tests for the login flow"
→ @qa-tester activates

"Review the authentication architecture"
→ @tech-lead activates

"Debug the 500 error on login"
→ @debugger activates
```

**How it works:**
- Each agent has a `description` field with trigger keywords
- Claude Code matches your request to agent descriptions
- The best-fit agent is invoked automatically

#### Manual (Explicit Control)

Use `@agent-name` for precise control:

```bash
@backend-dev implement JWT authentication

@frontend-dev create a dashboard with charts

@qa-tester write integration tests for auth endpoints

@tech-lead review the database schema design

@debugger investigate memory leak in user service
```

### When to Use Each Method

**Use Automatic When:**
- ✅ You want fast, natural interaction
- ✅ You trust Claude to pick the right agent
- ✅ Task fits clearly into one domain

**Use Manual When:**
- ✅ You need a specific agent's perspective
- ✅ Task could match multiple agents
- ✅ You want to override automatic selection

### Agent Collaboration

Agents can hand off tasks to each other:

```
You: "Build a complete user authentication system"

1. @backend-dev creates the API endpoints
2. @backend-dev → hands off to @frontend-dev for UI
3. @frontend-dev creates login form
4. @frontend-dev → hands off to @qa-tester
5. @qa-tester writes E2E tests
6. @qa-tester → hands off to @tech-lead for review
7. @tech-lead reviews and suggests improvements
```

This happens **automatically** with WORKFLOWS.md guidance.

---

## Using Skills

Skills are **reusable code patterns** that agents use to implement features.

### How Skills Work

1. **Agent Detects Need:**
   ```
   User: "Add pagination to the /users endpoint"
   @backend-dev: Detects "pagination" keyword
   ```

2. **Skill Auto-Selected:**
   ```
   Agent reads: .claude/skills/api-pagination/SKILL.md
   Finds template pack for your framework (e.g., Express, FastAPI)
   ```

3. **Code Generated:**
   ```
   Agent generates framework-specific pagination code
   Uses best practices from skill template
   ```

### Example: API Pagination

**Your tech stack: FastAPI + Python**

```bash
# You ask:
"Add cursor-based pagination to the /posts endpoint"

# AgentWeaver:
1. @backend-dev activates
2. Reads .claude/skills/api-pagination/SKILL.md
3. Finds fastapi-pagination template pack
4. Generates Python code using FastAPI patterns:
```

**Generated Code:**
```python
from lib.pagination import cursor_paginate, CursorPaginationParams

@app.get("/posts", response_model=CursorPaginationResponse[Post])
async def list_posts(
    params: CursorPaginationParams = Depends(),
    db: Session = Depends(get_db)
):
    query = db.query(Post).order_by(Post.created_at.desc())
    items, has_next, next_cursor = await cursor_paginate(db, query, params)

    return create_cursor_response(items, has_next, next_cursor)
```

### Skill Multi-Framework Support

The same skill works across **7+ frameworks**:

| Skill | Supported Frameworks |
|-------|---------------------|
| `api-pagination` | Express (TS), FastAPI, Spring Boot, ASP.NET Core, Gin, Rails, Laravel |
| `ui-form-validation` | React, Vue, Svelte, Angular |
| `database-optimization` | PostgreSQL, MySQL, MongoDB, SQLite |

**How it adapts:**
```bash
# Detected: Spring Boot + Java
→ Generates: Java with Spring Data pagination

# Detected: Express + TypeScript
→ Generates: TypeScript with TypeORM pagination

# Detected: Rails + Ruby
→ Generates: Ruby with ActiveRecord pagination
```

### Installing Individual Skills

```bash
# During init, select specific skills:
agentweaver init --skills api-pagination,ui-form-validation,database-optimization

# Or install all (default):
agentweaver init --skills all
```

---

## Tech Stack Templates

**Tech Stack Templates** are complete, production-ready project scaffolds.

### Available Templates

#### 1. **nextjs-mvp** (Beginner)

**Perfect for:** MVPs, SaaS apps, AI applications

**Stack:**
- Frontend: Next.js 15 + TypeScript + Tailwind + shadcn/ui
- Backend: Next.js App Router
- Database: Supabase (PostgreSQL) + Drizzle ORM
- AI: OpenAI SDK + Langfuse observability
- Testing: Vitest + Playwright
- Deployment: Docker + Vercel

**Features:**
- ✅ Authentication (Supabase Auth)
- ✅ File storage (Supabase Storage)
- ✅ Realtime (Supabase Realtime)
- ⚙️ Optional: AI integration, payments (Stripe), email (Resend)

**Usage:**
```bash
agentweaver init --template nextjs-mvp
```

#### 2. **nestjs-backend** (Intermediate)

**Perfect for:** REST APIs, microservices, enterprise backends

**Stack:**
- Framework: NestJS + TypeScript
- Database: PostgreSQL + Drizzle ORM
- Testing: Jest + Supertest
- Deployment: Docker + GitHub Actions

**Architecture:** Modular (feature-based modules)

**Usage:**
```bash
agentweaver init --template nestjs-backend
```

#### 3. **fastapi-backend** (Intermediate)

**Perfect for:** Python APIs, data science backends, ML services

**Stack:**
- Framework: FastAPI + Python 3.11
- Database: PostgreSQL + SQLAlchemy
- Testing: Pytest
- Deployment: Docker + uvicorn

**Architecture:** Clean architecture (layers)

**Usage:**
```bash
agentweaver init --template fastapi-backend
```

#### 4. **nextjs-nestjs-monorepo** (Advanced)

**Perfect for:** Large teams, scalable full-stack apps

**Stack:**
- Frontend: Next.js 15 (apps/frontend)
- Backend: NestJS (apps/backend)
- Database: PostgreSQL + Drizzle
- Monorepo: pnpm workspaces + Turborepo
- Testing: Vitest + Playwright + Jest

**Architecture:** Monorepo (feature-based)

**Usage:**
```bash
agentweaver init --template nextjs-nestjs-monorepo
```

#### 5. **nextjs-fastapi-monorepo** (Advanced)

**Perfect for:** AI/ML apps, data-heavy applications

**Stack:**
- Frontend: Next.js 15 (apps/frontend)
- Backend: FastAPI (apps/backend)
- Database: PostgreSQL + Drizzle + SQLAlchemy
- Monorepo: pnpm + uv
- AI: OpenAI + Langfuse

**Architecture:** Hybrid (TypeScript + Python)

**Usage:**
```bash
agentweaver init --template nextjs-fastapi-monorepo
```

### Template Features

All templates include:

- ✅ **Docker Compose** - One-command dev environment
- ✅ **Environment Management** - .env.example files
- ✅ **Database Migrations** - Drizzle/SQLAlchemy migrations
- ✅ **Testing Setup** - Unit, integration, E2E tests
- ✅ **CI/CD Pipelines** - GitHub Actions workflows
- ✅ **Code Quality** - ESLint, Prettier, pre-commit hooks
- ✅ **Documentation** - README, API docs, architecture diagrams
- ✅ **AgentWeaver Agents** - Pre-configured AI agents
- ✅ **MCP Servers** - Configured MCP integrations

### Feature Customization

When selecting a template, you can customize features:

```bash
agentweaver init

? Start with a pre-configured tech stack template? Yes
? Select a tech stack template: nextjs-mvp

🎨 Customize features:

? Select features to include:
  ✓ Authentication (Supabase Auth)
  ✓ AI Integration (OpenAI SDK + Langfuse)
  ○ Vector Search (pgvector)
  ○ Payments (Stripe)
  ✓ Email (Resend)
  ✓ File Storage (Supabase Storage)
  ✓ Realtime (Supabase Realtime)
  ○ Analytics
```

Only the selected features will be included.

### Listing All Templates

```bash
agentweaver templates
```

**Output:**
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

   Usage:
     agentweaver init --template nextjs-mvp

...
```

---

## Configuration

### Tech Stack Modes

AgentWeaver supports 3 tech stack enforcement modes:

#### 1. **Flexible** (Recommended)

Agents **prefer** your detected stack but can suggest alternatives:

```yaml
techStack:
  mode: flexible
  frontend:
    framework: react
    language: typescript
```

**Agent behavior:**
- Uses React + TypeScript by default
- Can suggest Vue if React doesn't fit
- Asks permission before deviating

**Use when:**
- You want guidance but flexibility
- Team is exploring options
- Project is in early stages

#### 2. **Strict**

Agents **must** use only specified technologies:

```yaml
techStack:
  mode: strict
  frontend:
    framework: react
    language: typescript
  constraints:
    versionPinning: true
```

**Agent behavior:**
- Only uses React + TypeScript
- Rejects suggestions for alternatives
- Enforces version constraints

**Use when:**
- Enterprise with established standards
- Compliance/regulatory requirements
- Large teams need consistency

#### 3. **Adaptive**

Agents **auto-detect** and adapt to any project:

```yaml
techStack:
  mode: adaptive
  autoDetect:
    enabled: true
    scanDepth: deep
```

**Agent behavior:**
- Scans project files continuously
- Adapts to any framework found
- No enforcement, pure detection

**Use when:**
- Adding AgentWeaver to existing projects
- Working with unfamiliar codebases
- Polyglot projects

### Changing Modes

**During init:**
```bash
agentweaver init --mode strict
```

**After installation:**

Edit `.claude/agentweaver.config.yml`:
```yaml
techStack:
  mode: flexible  # Change to: strict or adaptive
```

Then regenerate docs:
```bash
agentweaver regenerate-docs
```

### MCP Server Configuration

MCP servers enable agents to access external tools.

**Configured in `.mcp.json`:**
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
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

**Available MCP servers:**
- `github` - Repository operations, issues, PRs
- `fetch` - Web content fetching
- `context7` - Documentation lookup
- `sequential` - Complex analysis
- `playwright` - E2E testing automation
- `shadcn` - shadcn/ui component library
- `socket` - Security scanning
- `supabase` - Database operations

**Required environment variables:**

`.env`:
```bash
# GitHub
GITHUB_TOKEN=ghp_your_token_here

# Supabase (if using supabase MCP)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Best Practices

### 1. **Use Automatic Invocation**

Let Claude Code pick the right agent:
```bash
# Good ✅
"Add user authentication"

# Overthinking ❌
@backend-dev @frontend-dev @qa-tester build authentication
```

### 2. **Start with Development Agents**

Install only what you need:
```bash
# Good for most projects ✅
agentweaver init --agents backend-dev,frontend-dev,qa-tester,tech-lead

# Overkill for small projects ❌
agentweaver init  # (installs all 21 agents)
```

### 3. **Leverage Skills**

Don't reinvent patterns:
```bash
# Good ✅
"Use the api-pagination skill to add pagination"

# Reinventing the wheel ❌
"Write custom pagination logic from scratch"
```

### 4. **Use Templates for New Projects**

Save hours of setup:
```bash
# Good ✅
mkdir my-app && cd my-app
agentweaver init --template nextjs-mvp

# Manual setup ❌
npm create next-app
npm install 20+ packages
Configure Docker, testing, CI/CD, etc.
```

### 5. **Keep .claude/ in .gitignore**

Project-specific agent configs shouldn't be in version control:

```gitignore
# .gitignore
.claude/
.env
```

Why? `.claude/` contains:
- Project-specific tech stack detection
- Local agent customizations
- Generated documentation

**What to version control:**
- `.mcp.json` - Team shares MCP server config
- `.env.example` - Template for environment variables

### 6. **Review Generated Docs**

After init, read:
- `.claude/CLAUDE.md` - Project overview
- `.claude/tech-stack.md` - Detected tech stack
- `.claude/WORKFLOWS.md` - Agent collaboration patterns

### 7. **Update Tech Stack Config**

As your project evolves, update `.claude/agentweaver.config.yml`:

```yaml
techStack:
  frontend:
    framework: nextjs  # Updated from react
    uiLibrary: shadcn-ui  # Added new library
```

Then regenerate:
```bash
agentweaver regenerate-docs
```

---

## Troubleshooting

### Agents Not Auto-Invoking

**Symptoms:**
- Agents don't activate when expected
- Always need to use `@agent-name` manually

**Solutions:**

1. **Verify Installation:**
   ```bash
   ls -la .claude/agents/
   # Should show: backend-dev.md, frontend-dev.md, etc.
   ```

2. **Check Agent Files:**
   ```bash
   head -n 10 .claude/agents/backend-dev.md
   # Should show YAML frontmatter with 'description' field
   ```

3. **Restart Claude Code:**
   - Close and reopen Claude Code
   - Agents load on startup

4. **Use More Specific Requests:**
   ```bash
   # Vague (may not auto-invoke) ❌
   "Make changes to the code"

   # Specific (will auto-invoke) ✅
   "Add pagination to the /users API endpoint"
   ```

### Skills Not Found

**Symptoms:**
- Agent says "skill not available"
- Template pack not selected

**Solutions:**

1. **Verify Installation:**
   ```bash
   ls -la .claude/skills/
   # Should show directories like api-pagination/, database-optimization/
   ```

2. **Check Skill Structure:**
   ```bash
   ls .claude/skills/api-pagination/
   # Should show: SKILL.md, templates/, templates-used.json
   ```

3. **Reinstall Skills:**
   ```bash
   agentweaver init --skills all
   ? .claude directory already exists. Overwrite? Yes
   ```

### Template Pack Mismatch

**Symptoms:**
- Wrong framework template selected
- Code doesn't match your tech stack

**Solutions:**

1. **Check Detection:**
   ```bash
   agentweaver init
   # Review "Detected Technologies" output
   ```

2. **Verify Tech Stack Config:**
   ```bash
   cat .claude/agentweaver.config.yml
   # Check frontend.framework, backend.framework
   ```

3. **Manual Template Pack:**
   Edit `.claude/skills/[skill-name]/templates-used.json`:
   ```json
   {
     "templatePack": "fastapi-pagination",  // Force specific pack
     "score": 1.0
   }
   ```

### MCP Servers Not Working

**Symptoms:**
- Agents can't access GitHub, Context7, etc.
- Error: "MCP server connection failed"

**Solutions:**

1. **Check Configuration:**
   ```bash
   cat .mcp.json
   # Should show configured servers
   ```

2. **Verify Environment Variables:**
   ```bash
   cat .env
   # Check: GITHUB_TOKEN, SUPABASE_URL, etc.
   ```

3. **Test Token:**
   ```bash
   # GitHub
   curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

   # Should return your GitHub user info
   ```

4. **Restart Claude Code:**
   - MCP servers connect on startup

### Tech Stack Not Detected

**Symptoms:**
- AgentWeaver shows "No technologies detected"
- Wrong framework identified

**Solutions:**

1. **Add Manifest Files:**

   **Node.js:**
   ```bash
   npm init -y  # Creates package.json
   ```

   **Python:**
   ```bash
   touch requirements.txt  # or pyproject.toml
   ```

   **Java:**
   ```bash
   touch pom.xml  # or build.gradle
   ```

2. **Re-run Detection:**
   ```bash
   agentweaver init
   # Detection runs automatically
   ```

3. **Manual Configuration:**

   Edit `.claude/agentweaver.config.yml`:
   ```yaml
   techStack:
     mode: flexible
     backend:
       framework: fastapi  # Manually specify
       language: python
     database:
       primary: postgresql
       orm: sqlalchemy
   ```

### Still Having Issues?

1. **Check Claude Code Version:**
   - Update to latest version

2. **Review Logs:**
   - Claude Code logs show agent activation

3. **Validate Template Packs:**
   ```bash
   agentweaver validate
   # Checks template pack integrity
   ```

4. **Open an Issue:**
   - [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
   - Include: OS, Node version, error messages

5. **Manual Invocation Fallback:**
   - Always works: `@agent-name your task`

---

## Next Steps

Now that you understand the basics:

1. **Explore Agents** - Try each agent to see their specialties
2. **Use Skills** - Leverage pre-built patterns for common tasks
3. **Try Templates** - Bootstrap a new project with a tech stack template
4. **Customize** - Adjust `.claude/agentweaver.config.yml` to your needs
5. **Read** - Check other docs:
   - [CLI Reference](CLI_REFERENCE.md) - All commands and options
   - [Agent Guide](AGENT_GUIDE.md) - Deep dive into each agent
   - [Skills Library](SKILLS_LIBRARY.md) - All available skills
   - [Template Guide](TEMPLATE_GUIDE.md) - Creating custom templates

---

**Happy building with AgentWeaver! 🚀**

For support:
- 📖 [Full Documentation](https://github.com/CodeLift-LLC/AgentWeaver-CLI)
- 🐛 [Report Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- 💡 [Request Features](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues/new)

Made with ❤️ by [CodeLift LLC](https://www.codelift.codes)
