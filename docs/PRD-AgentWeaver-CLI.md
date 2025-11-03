# PRD: AgentWeaver CLI

**Pre-Built Agent Library Installer for Claude Code Projects**

---

## 1. Executive Summary

### One-Liner

**AgentWeaver CLI** is a globally-installable Node.js CLI that **installs pre-built AI agent templates** into your project's `.claude/agents/` directory, enabling you to instantly access a **team of 19 specialized agents** (dev, marketing, sales) directly in Claude Code using native `@agent-name` syntax.

### What AgentWeaver Does

AgentWeaver is a **simple installer tool** that:
1. **Copies agent templates** (`.md` files) into `.claude/agents/` in your project
2. **Installs skill libraries** into `.claude/skills/` for reusable patterns
3. **Creates project-level `.mcp.json`** with pre-configured MCP servers
4. **Generates tech stack configuration** for agent constraint enforcement
5. **Users work directly in Claude Code** - no runtime orchestration needed

### Key Differentiators

1. **Zero-Setup Agent Library**: 19 pre-built agents ready to use via `@agent-name`
2. **Project-Level Configuration**: Each project gets its own `.mcp.json` and tech stack rules
3. **Tech Stack Enforcement**: Agents respect your framework choices (strict/flexible/adaptive modes)
4. **Native Claude Code Integration**: Use agents naturally with `@backend-dev build login API`
5. **Incremental Installation**: Add only the agents you need with `agentweaver add`
6. **Version Management**: Update agent templates with `agentweaver update`

### Target Users

- **Claude Code Users**: Developers who want pre-built agents without manual setup
- **Solo Developers**: Need full-stack agent coverage without building each agent
- **Teams**: Want consistent agent definitions across all project members
- **Consultants**: Quickly bootstrap client projects with proven agent templates

---

## 2. Goals & Non-Goals

### Goals

✅ **Simple Installation**: One command to add agents to any project (new or existing)
✅ **Comprehensive Agent Library**: 19 pre-built agents covering dev, marketing, and sales
✅ **Project-Level Configuration**: Each project gets its own `.mcp.json` and settings
✅ **Tech Stack Enforcement**: Agents respect framework choices via config
✅ **Claude Code Native**: Use agents with `@agent-name` - no custom orchestration
✅ **Flexible Selection**: Install all agents or pick specific ones
✅ **Version Management**: Easy updates when agent templates improve
✅ **Auto-Detection**: Detect existing project tech stack and adapt
✅ **MCP Server Setup**: Auto-configure GitHub, Context7, Sequential, Playwright, etc.
✅ **Zero Runtime Dependencies**: Pure template installation, no background services

### Non-Goals

❌ **Runtime Orchestration**: AgentWeaver doesn't run agents, Claude Code does
❌ **Custom CLI Commands**: No `agentweaver sprint build` - use Claude Code directly
❌ **Workflow Engine**: No approval gates, coordination, or scheduling
❌ **Agent Execution**: Agents run via Claude Code's `@agent-name`, not our CLI
❌ **State Management**: No persistent runtime state or databases
❌ **Background Services**: No daemons, servers, or long-running processes
❌ **Custom LLM Providers**: Templates designed for Claude Code only (v1.0)

---

## 3. Architecture

### 3.1 Distribution Model

**Package Type**: Global npm CLI (no runtime dependencies)

```bash
# Install globally
npm install -g agentweaver-cli

# Or use via npx (no installation)
npx agentweaver-cli init
```

**What Gets Distributed**:
1. **CLI Tool**: Simple Commander.js installer (not an orchestrator)
2. **Agent Template Library**: 19 `.md` files bundled with CLI
3. **Skills Library**: Reusable patterns for common tasks
4. **Config Generators**: Creates `.mcp.json` and `agentweaver.config.yml`
5. **Tech Stack Detector**: Auto-detects existing project frameworks

### 3.2 File Installation Architecture

When you run `agentweaver init` in a project:

```
my-project/                      ← Your existing or new project
  ├── .claude/                   ← AgentWeaver creates this
  │   ├── agents/                ← Agent templates copied here
  │   │   ├── backend-dev.md
  │   │   ├── frontend-dev.md
  │   │   ├── qa-tester.md
  │   │   ├── tech-lead.md
  │   │   ├── devops.md
  │   │   ├── content-writer.md
  │   │   └── ... (up to 19 agents)
  │   ├── skills/                ← Skill libraries copied here
  │   │   ├── api-patterns/
  │   │   ├── ui-components/
  │   │   ├── testing-strategies/
  │   │   └── deployment/
  │   └── CLAUDE.md              ← Project context (optional)
  ├── .mcp.json                  ← PROJECT-LEVEL MCP config
  ├── agentweaver.config.yml     ← Tech stack configuration
  ├── package.json               ← Your existing files
  └── src/                       ← Your existing code
```

**Key Principle**: AgentWeaver is a **one-time installer**. After setup, it's not needed for daily work.

### 3.3 Agent Library (19 Agents)

#### Development Team (8 agents)

| Agent File | Description | MCP Servers Used |
|------------|-------------|------------------|
| `product-owner.md` | Backlog management, requirements | GitHub (issues), Context7 |
| `tech-lead.md` | Architecture decisions, code review | GitHub (PR review), Sequential, Context7 |
| `frontend-dev.md` | UI/UX implementation, components | shadcn-ui, Playwright, GitHub |
| `backend-dev.md` | API development, database design | Supabase, GitHub, Context7 |
| `devops.md` | CI/CD, infrastructure, deployment | GitHub (Actions), cloud providers |
| `qa-tester.md` | Test strategy, automated testing | Playwright, GitHub |
| `docs-writer.md` | Technical documentation, API docs | GitHub, Context7 |
| `scrum-master.md` | Process optimization, blockers | Sequential |

#### Marketing Team (6 agents)

| Agent File | Description | MCP Servers Used |
|------------|-------------|------------------|
| `marketing-manager.md` | Strategy, campaign planning | Context7, Sequential |
| `content-writer.md` | Blog posts, educational content | Context7, GitHub |
| `seo-specialist.md` | Keyword research, optimization | Playwright, Context7 |
| `growth-marketer.md` | A/B testing, conversion optimization | Playwright, Sequential |
| `social-media.md` | Content calendar, engagement | Context7 |
| `product-marketer.md` | Positioning, messaging, GTM | Context7, Sequential |

#### Sales Team (5 agents)

| Agent File | Description | MCP Servers Used |
|------------|-------------|------------------|
| `sales-manager.md` | Pipeline management, forecasting | Context7, Sequential |
| `sdr.md` | Prospecting, lead qualification | Context7 |
| `account-exec.md` | Demo delivery, deal closing | Context7, Sequential |
| `customer-success.md` | Onboarding, retention | Context7, Playwright |
| `sales-engineer.md` | Technical demos, POC support | Context7, Sequential, GitHub |

### 3.4 Project-Level MCP Configuration

AgentWeaver creates a **project-level `.mcp.json`** file (not global) with pre-configured MCP servers:

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
      "args": ["-y", "@context7/mcp-server"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/sequential-thinking-mcp-server"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    },
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "shadcn-ui-mcp"]
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}"
      }
    }
  }
}
```

**Why Project-Level?**
- Each project can have different MCP servers
- Environment variables scoped to project
- Team members get consistent configuration
- Works with any Claude Code project

### 3.5 How Users Work with Installed Agents

After running `agentweaver init`, users work **directly in Claude Code**:

```bash
# 1. Open Claude Code in VSCode (Cmd+Shift+P → "Claude Code: Open")

# 2. Use @agent-name syntax to invoke agents:

@backend-dev build a login API with email/password authentication
  ↓
  Backend Developer agent reads:
  - Project's .mcp.json (GitHub, Supabase access)
  - agentweaver.config.yml (tech stack: FastAPI + Python)
  - Existing code in src/
  ↓
  Generates:
  - src/api/auth.py
  - src/models/user.py
  - tests/test_auth.py

@frontend-dev create a login form component
  ↓
  Frontend Developer agent reads:
  - agentweaver.config.yml (tech stack: Next.js + TypeScript + shadcn-ui)
  - src/api/auth.py (to understand API contract)
  ↓
  Generates:
  - components/auth/LoginForm.tsx
  - components/auth/LoginForm.test.tsx

@qa-tester write E2E tests for the login flow
  ↓
  QA Tester agent:
  - Uses Playwright MCP for test generation
  - Reads existing components and API
  ↓
  Generates:
  - e2e/auth.spec.ts

# 3. Agents work independently - no orchestration needed
# 4. All agent context comes from .claude/agents/*.md files
```

**No AgentWeaver CLI Involvement**: After installation, you never run `agentweaver` commands during development. Everything happens in Claude Code.

---

## 4. CLI Commands

### 4.1 `agentweaver init`

**Purpose**: Initialize AgentWeaver in a project (new or existing)

```bash
cd my-project
agentweaver init

🚀 Welcome to AgentWeaver CLI!

? Select agents to install:
  ◉ All agents (19 total)
  ◯ Development only (8 agents)
  ◯ Dev + Marketing (14 agents)
  ◯ Custom selection...

? Detect existing tech stack?
  ◉ Yes (recommended)
  ◯ No, I'll configure manually

🔍 Detecting project stack...

Found:
  - Frontend: Next.js 15 + TypeScript
  - Styling: Tailwind CSS
  - Backend: Node.js (Express detected in package.json)
  - Database: PostgreSQL (via DATABASE_URL in .env)
  - Testing: Jest + Playwright

? Use detected stack?
  ◉ Yes
  ◯ No, customize

? Tech stack enforcement mode:
  ◉ Flexible (agents prefer stack, can suggest alternatives)
  ◯ Strict (agents must use specified stack only)
  ◯ Adaptive (auto-adapt to any project)

? Configure MCP servers:
  ◉ GitHub (requires GITHUB_TOKEN)
  ◉ Context7 (requires CONTEXT7_API_KEY)
  ◉ Sequential Thinking
  ◉ Playwright
  ◉ shadcn-ui
  ◯ Supabase (requires SUPABASE_URL, SUPABASE_SERVICE_KEY)

✅ Installation complete!

Created:
  ├── .claude/agents/        (19 agent definitions)
  ├── .claude/skills/        (reusable patterns)
  ├── .mcp.json             (project-level MCP config)
  └── agentweaver.config.yml (tech stack config)

Next steps:
  1. Set environment variables in .env:
     - GITHUB_TOKEN
     - CONTEXT7_API_KEY

  2. Open Claude Code and use agents:
     @backend-dev build user authentication
     @frontend-dev create dashboard layout
     @qa-tester write E2E tests

Documentation: https://agentweaver.dev/docs
```

### 4.2 `agentweaver add <agent-name>`

**Purpose**: Add a specific agent to an existing project

```bash
agentweaver add content-writer

✅ Added agent: content-writer
   - File: .claude/agents/content-writer.md
   - Skills: Added content-writing/ to .claude/skills/

Use in Claude Code: @content-writer write a blog post about...
```

### 4.3 `agentweaver list`

**Purpose**: List all available agents

```bash
agentweaver list

Available Agents:

Development (8):
  - backend-dev       API development, database design
  - frontend-dev      UI/UX implementation, components
  - qa-tester         Test strategy, E2E testing
  - tech-lead         Architecture, code review
  - devops            CI/CD, deployment, infrastructure
  - product-owner     Requirements, backlog management
  - scrum-master      Process optimization, blockers
  - docs-writer       Technical documentation

Marketing (6):
  - marketing-manager Campaign strategy, planning
  - content-writer    Blog posts, educational content
  - seo-specialist    SEO optimization, keywords
  - growth-marketer   A/B testing, conversion optimization
  - social-media      Social content, engagement
  - product-marketer  Positioning, GTM strategy

Sales (5):
  - sales-manager     Pipeline, forecasting
  - sdr              Prospecting, lead qualification
  - account-exec      Demos, deal closing
  - customer-success  Onboarding, retention
  - sales-engineer    Technical demos, POCs

Installed agents: 19/19
```

### 4.4 `agentweaver update`

**Purpose**: Update all agent templates to latest version

```bash
agentweaver update

🔄 Checking for updates...

Updates available:
  - backend-dev.md (v1.2.0 → v1.3.0)
  - frontend-dev.md (v1.1.5 → v1.2.0)
  - qa-tester.md (v1.0.8 → v1.1.0)

? Update all agents?
  ◉ Yes
  ◯ Select specific agents

✅ Updated 3 agents
⚠️  Your customizations in agentweaver.config.yml were preserved
```

### 4.5 `agentweaver config`

**Purpose**: Modify tech stack configuration

```bash
# Show current configuration
agentweaver config show

Tech Stack Configuration:
  Mode: flexible
  Frontend:
    Framework: nextjs
    Language: typescript
    Styling: tailwind
    UI Library: shadcn-ui
  Backend:
    Framework: express
    Language: typescript
  Database:
    Primary: postgresql
    ORM: prisma

# Update configuration
agentweaver config set frontend.framework react
agentweaver config set techStack.mode strict

✅ Configuration updated
```

### 4.6 `agentweaver detect`

**Purpose**: Re-detect project tech stack

```bash
agentweaver detect

🔍 Scanning project...

Detected stack:
  - Frontend: React 18 + TypeScript
  - State: Zustand
  - Styling: Tailwind CSS
  - Backend: FastAPI (Python)
  - Database: PostgreSQL + Prisma ORM
  - Testing: Pytest + Playwright

? Update agentweaver.config.yml with detected stack?
  ◉ Yes
  ◯ No

✅ Configuration updated
```

### 4.7 `agentweaver validate`

**Purpose**: Validate project against tech stack configuration

```bash
agentweaver validate

🔍 Validating project against configured tech stack...

✅ All checks passed

Tech Stack Compliance:
  ✅ Frontend: Using Next.js as configured
  ✅ Styling: Using Tailwind CSS as configured
  ✅ Backend: Using FastAPI as configured
  ⚠️  Warning: Found 'moment' package (forbidden in config)
      Suggestion: Use 'date-fns' or 'dayjs' instead

No blocking issues found.
```

### 4.8 `agentweaver remove <agent-name>`

**Purpose**: Remove a specific agent from project

```bash
agentweaver remove social-media

? Are you sure you want to remove 'social-media'?
  ◉ Yes
  ◯ No

✅ Removed agent: social-media
   - Deleted: .claude/agents/social-media.md
```

---

## 5. Tech Stack Configuration

### 5.1 Configuration File: `agentweaver.config.yml`

```yaml
# Tech Stack Configuration for AgentWeaver
# Agents read this file to understand project constraints

techStack:
  # Mode: strict | flexible | adaptive
  # - strict: Agents MUST use specified stack (violations blocked)
  # - flexible: Agents prefer specified stack (can suggest alternatives with approval)
  # - adaptive: Agents auto-detect and adapt to any stack
  mode: flexible

  # Auto-detection settings (for adaptive mode)
  autoDetect:
    enabled: true
    scanDepth: shallow  # or 'deep'
    trustLockFiles: true

  # Enforcement settings (for strict mode)
  enforcement:
    validateBeforeExecution: true
    blockInvalidCode: false
    requireJustification: true
    allowedDeviations:
      - "@testing-library/*"  # Allow testing utilities
      - "zod"                 # Allow validation library

  # Frontend configuration
  frontend:
    framework: nextjs      # react | nextjs | vue | nuxt | angular | svelte
    language: typescript   # typescript | javascript
    styling: tailwind      # tailwind | css-modules | styled-components | sass
    uiLibrary: shadcn-ui   # shadcn-ui | mui | chakra-ui | ant-design | none
    stateManagement: zustand  # zustand | redux | jotai | recoil | context
    routing: app-router    # app-router | pages-router | react-router

  # Backend configuration
  backend:
    framework: fastapi     # nextjs | express | nestjs | fastapi | django | flask
    language: python       # typescript | javascript | python | go | rust
    apiStyle: rest         # rest | graphql | trpc | grpc
    validation: pydantic   # zod | yup | joi | pydantic | class-validator

  # Database configuration
  database:
    primary: postgresql    # postgresql | mysql | supabase | mongodb | firebase
    orm: prisma           # prisma | drizzle | typeorm | sqlalchemy | mongoose
    cache: redis          # redis | memcached | none
    migrations: prisma    # prisma | drizzle-kit | typeorm | alembic

  # Testing configuration
  testing:
    unit: jest            # jest | vitest | pytest | mocha
    e2e: playwright       # playwright | cypress | selenium
    coverage:
      enabled: true
      threshold: 80

  # Deployment configuration
  deployment:
    platform: docker      # vercel | railway | aws | gcp | azure | docker
    containerization: true
    cicd: github-actions  # github-actions | gitlab-ci | circleci

  # Package constraints (for strict mode)
  constraints:
    allowedPackages:
      - "react"
      - "next"
      - "@supabase/*"
      - "tailwindcss"
    forbiddenPackages:
      - "moment"          # Prefer date-fns or dayjs
      - "lodash"          # Use native ES6
    versionPinning: minor # exact | minor | major | none
    securityPolicy: moderate  # strict | moderate | permissive
```

### 5.2 Tech Stack Modes

#### Strict Mode
- **Purpose**: Enforce specific tech stack choices
- **Use Case**: Enterprise teams with established standards, regulated industries
- **Behavior**:
  - Agents MUST use specified technologies
  - Code validation before generation
  - Blocks code that violates constraints

#### Flexible Mode (Default)
- **Purpose**: Balance preferences with agent intelligence
- **Use Case**: Most projects, teams exploring options
- **Behavior**:
  - Agents prefer specified stack
  - Can suggest alternatives with justification
  - Human approval for deviations

#### Adaptive Mode
- **Purpose**: Auto-detect and adapt to existing project
- **Use Case**: Adding AgentWeaver to brownfield projects
- **Behavior**:
  - Auto-scans project structure
  - Detects frameworks and tools
  - No enforcement, pure adaptation

### 5.3 How Agents Use Tech Stack Config

Each agent template includes logic to read `agentweaver.config.yml`:

```markdown
---
name: backend-dev
description: Backend development specialist
---

You are an expert backend developer.

## Tech Stack Constraints

Read the project's `agentweaver.config.yml` to understand tech stack requirements:

- **Mode**: {{techStack.mode}}
- **Backend Framework**: {{techStack.backend.framework}}
- **Language**: {{techStack.backend.language}}
- **Database**: {{techStack.database.primary}}
- **ORM**: {{techStack.database.orm}}

{{#if techStack.mode === 'strict'}}
⚠️ STRICT MODE: You MUST use only the specified technologies. Do not suggest alternatives.
{{/if}}

{{#if techStack.mode === 'flexible'}}
You may suggest alternative technologies if they provide significant benefits, but you MUST:
1. Justify the deviation with technical rationale
2. Wait for human approval before proceeding
3. Document the decision
{{/if}}

## Implementation Guidelines

When building APIs:
- Use {{techStack.backend.framework}} framework
- Write code in {{techStack.backend.language}}
- Use {{techStack.database.orm}} for database access
- Follow {{techStack.backend.apiStyle}} API design patterns

...
```

---

## 6. Agent Template Structure

### 6.1 Claude Code Sub-Agent Format

AgentWeaver creates sub-agent files following the official Claude Code specification:

**File**: `.claude/agents/backend-dev.md`

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

{{#if techStack.mode === 'strict'}}
⚠️ **STRICT MODE**: You MUST use only the technologies specified above. No alternatives allowed.
{{/if}}

{{#if techStack.mode === 'flexible'}}
💡 **FLEXIBLE MODE**: Prefer the specified stack, but you may suggest alternatives with strong technical justification. Document any deviations.
{{/if}}

## Core Responsibilities

1. **API Development**
   - Design RESTful/GraphQL APIs following {{techStack.backend.apiStyle}} patterns
   - Implement authentication (JWT, OAuth, session-based)
   - Create comprehensive OpenAPI/Swagger documentation

2. **Database Design**
   - Schema design with proper normalization
   - Write migrations using {{techStack.database.orm}}
   - Optimize queries with appropriate indexes
   - Implement caching strategies

3. **Testing & Quality**
   - Write unit tests (target: ≥80% coverage)
   - Create integration tests for API endpoints
   - Perform security audits (SQL injection, XSS, CSRF)
   - Load testing for performance bottlenecks

4. **Performance Optimization**
   - Profile and optimize slow queries
   - Implement connection pooling
   - Add database indexes strategically
   - Design efficient data models

## Automatic Invocation Triggers

Claude will **automatically delegate** to you when detecting:
- Keywords: "API", "backend", "server", "database", "authentication", "endpoint", "schema", "migration"
- File patterns: `*/api/*`, `*/routes/*`, `*/controllers/*`, `*/models/*`, `*/services/*`
- Language files: `.py`, `.js`, `.ts`, `.go` (in backend contexts)
- Database files: `schema.prisma`, `*.sql`, `migrations/*`

## MCP Server Access

You have access to these MCP servers (configured in project's `.mcp.json`):

### GitHub MCP
- Create pull requests: `github_create_pr`
- Commit changes: `github_commit`
- Read issues: `github_list_issues`
- **Restrictions**: Cannot merge PRs (Tech Lead only)

### Supabase MCP
- Query databases: `supabase_query` (dev/staging only)
- Run migrations: `supabase_migrate`
- **Restrictions**: No production database access

### Sequential Thinking MCP
- Complex architecture decisions
- Multi-step logic design
- Performance optimization planning

### Context7 MCP
- Research framework best practices
- Find library documentation
- Discover implementation patterns

## Quality Standards

**Non-Negotiable Requirements**:
- ✅ 100% API endpoint documentation (OpenAPI/Swagger)
- ✅ ≥80% test coverage (unit + integration)
- ✅ Response time <200ms (P95) for standard endpoints
- ✅ Zero SQL injection vulnerabilities
- ✅ Proper error handling with meaningful messages
- ✅ Database indexes for all frequently queried fields
- ✅ Input validation on all endpoints
- ✅ Rate limiting implementation

## Handoff Protocol

When your work is complete, provide clear handoffs to other agents:

**→ Frontend Developer** (`@frontend-dev`):
```markdown
## API Ready for Integration

**Endpoints**:
- POST /api/auth/login
- GET /api/auth/me

**OpenAPI Spec**: `docs/api/auth.yaml`

**Authentication**:
- Bearer token in Authorization header
- Token expires in 24h

**Example Request**:
\`\`\`bash
curl -X POST https://api.example.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"secret"}'
\`\`\`

**Response**: `{ "token": "jwt...", "user": {...} }`
```

**→ QA Tester** (`@qa-tester`):
```markdown
## Backend Ready for Testing

**Test Coverage**: 87% (unit), 92% (integration)
**Test Command**: `npm run test:backend`

**Test Data Setup**:
1. Run `npm run db:seed:test`
2. Test user: test@example.com / password123

**Known Edge Cases**:
- Rate limiting: 100 requests/15min per IP
- File uploads: Max 10MB
```

## Code Style Guidelines

Follow project's existing conventions. If none exist:

**Python**:
```python
# Use snake_case for functions/variables
def create_user_account(email: str, password: str) -> User:
    """Create new user account with hashed password.

    Args:
        email: User email address
        password: Plain text password (will be hashed)

    Returns:
        User: Created user object

    Raises:
        ValidationError: If email is invalid
    """
    # Implementation
```

**TypeScript/JavaScript**:
```typescript
// Use camelCase for functions/variables
async function createUserAccount(
  email: string,
  password: string
): Promise<User> {
  // JSDoc comment
  // Implementation
}
```

**General Rules**:
- Functions < 50 lines
- Single responsibility principle
- Meaningful variable names (no abbreviations)
- Early returns for error cases
- Use async/await (no callbacks)
```

### 6.2 Key Sub-Agent Features

#### Automatic Delegation

Claude **automatically invokes** sub-agents based on:

1. **Description Matching**: The `description` field acts as a trigger
   - Include keywords related to the agent's domain
   - Use "Use PROACTIVELY" to encourage automatic invocation
   - Be specific about file patterns and contexts

2. **Context Analysis**:
   - File types being edited
   - Keywords in user's request
   - Current working directory
   - Recent file changes

3. **Tool Requirements**:
   - If a task requires specific tools the agent has access to
   - If MCP servers needed are available to the agent

#### Example: Automatic vs Explicit Invocation

```bash
# Automatic Invocation (Claude decides)
User: "Fix the slow database query in the dashboard endpoint"
→ Claude automatically delegates to @backend-dev

# Explicit Invocation (User specifies)
User: "@backend-dev optimize the /api/dashboard query"
→ Claude uses backend-dev agent directly
```

#### Model Selection

Agents can specify different models:
- `model: sonnet` - Balanced performance (recommended for most agents)
- `model: opus` - Maximum capability (for complex architecture decisions)
- `model: haiku` - Fast responses (for simple, repetitive tasks)
- `model: inherit` - Use same model as main Claude Code session

#### Tool Restrictions

Limit tool access for security and focus:

```yaml
---
name: content-writer
description: Blog post and documentation writer. Use PROACTIVELY for markdown files, documentation, and content creation tasks.
tools: Read, Write  # Only file operations, no Bash
model: sonnet
---
```

### 6.3 Skills Library Structure

AgentWeaver installs **project-level skills** following the official Claude Code specification:

**Directory**: `.claude/skills/`

#### Skill Format

Each skill is a **directory** with a required `SKILL.md` file:

```
.claude/skills/
├── api-pagination/
│   ├── SKILL.md          ← Required
│   ├── reference.md      ← Optional examples
│   └── templates/
│       └── paginate.py   ← Optional code templates
├── rest-api-design/
│   ├── SKILL.md
│   └── examples/
│       └── openapi.yaml
├── database-optimization/
│   ├── SKILL.md
│   ├── query-patterns.md
│   └── scripts/
│       └── analyze.sql
└── ui-form-validation/
    ├── SKILL.md
    └── templates/
        └── validation.tsx
```

#### SKILL.md Format

```markdown
---
name: api-pagination
description: Implement cursor-based and offset-based pagination for REST APIs. Use when adding pagination to API endpoints or optimizing large dataset queries.
allowed-tools: Read, Write, Edit
---

# API Pagination Skill

## When to Use This Skill

Use this skill automatically when:
- User requests pagination for API endpoints
- Query returns >100 records
- Performance issues with large datasets
- Need to implement "load more" functionality

## Implementation Patterns

### Cursor-Based Pagination (Recommended)

**Best for**: Real-time data, frequently changing datasets

```python
# FastAPI Example
@app.get("/api/posts")
async def get_posts(
    cursor: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    query = db.posts.filter(published=True)

    if cursor:
        decoded_cursor = base64.b64decode(cursor).decode()
        query = query.filter(id__gt=decoded_cursor)

    posts = query.order_by('id').limit(limit + 1)

    has_next = len(posts) > limit
    if has_next:
        posts = posts[:limit]

    next_cursor = None
    if has_next and posts:
        next_cursor = base64.b64encode(
            str(posts[-1].id).encode()
        ).decode()

    return {
        "data": posts,
        "pagination": {
            "next_cursor": next_cursor,
            "has_next": has_next
        }
    }
```

### Offset-Based Pagination

**Best for**: Static datasets, admin panels

```typescript
// Next.js API Route Example
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    db.posts.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    db.posts.count()
  ]);

  return Response.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: offset + limit < total,
      hasPrev: page > 1
    }
  });
}
```

## Best Practices

1. **Always set max limit**: Prevent abuse (e.g., `limit: int = Query(le=100)`)
2. **Include total count** (offset) or **has_next** (cursor)
3. **Consistent ordering**: Always use ORDER BY for predictable results
4. **Use indexes**: Ensure cursor/offset columns are indexed
5. **Document in OpenAPI**: Include pagination params in API docs

## References

- See `reference.md` for more examples
- Check `templates/` for copy-paste implementations
```

#### How Agents Use Skills

**Automatic Discovery**:
Claude automatically discovers and uses skills based on:
1. Skill's `description` field matching user's request
2. Current task context
3. File patterns being worked on

**Agents Reference Skills**:
```markdown
<!-- In agent template -->
## Available Skills

You have access to project skills in `.claude/skills/`:
- `api-pagination`: For implementing pagination
- `rest-api-design`: REST API best practices
- `database-optimization`: Query optimization patterns

When relevant, automatically use these skills by reading their SKILL.md files.
```

**Example Automatic Usage**:
```bash
User: "Add pagination to the /api/users endpoint"
↓
Claude detects "pagination" keyword
↓
Automatically loads `.claude/skills/api-pagination/SKILL.md`
↓
Uses skill's patterns to implement pagination
```

#### Skill Categories

AgentWeaver installs these skill categories:

1. **API Patterns** (`api-*`)
   - `api-pagination`
   - `api-error-handling`
   - `api-authentication`
   - `api-rate-limiting`
   - `api-versioning`

2. **Database** (`db-*`)
   - `db-optimization`
   - `db-migrations`
   - `db-indexes`
   - `db-transactions`

3. **Frontend** (`ui-*`)
   - `ui-form-validation`
   - `ui-accessibility`
   - `ui-responsive-design`
   - `ui-state-management`

4. **Testing** (`test-*`)
   - `test-unit-patterns`
   - `test-e2e-workflows`
   - `test-mocking`
   - `test-coverage`

5. **Deployment** (`deploy-*`)
   - `deploy-docker`
   - `deploy-ci-cd`
   - `deploy-environment-config`
   - `deploy-monitoring`

---

## 7. Implementation Roadmap

### Phase 1: MVP (v0.1.0) - 4 weeks

**Core Functionality**:
- ✅ CLI tool with Commander.js
- ✅ `agentweaver init` command
- ✅ 8 development agent templates
- ✅ Project-level `.mcp.json` generation
- ✅ Basic tech stack detection (Next.js, React, TypeScript)
- ✅ `agentweaver.config.yml` generation

**Deliverables**:
- npm package published
- 8 agent templates (backend-dev, frontend-dev, qa-tester, tech-lead, devops, product-owner, scrum-master, docs-writer)
- Basic skills library (api-patterns, ui-components)
- Documentation website

### Phase 2: Enhanced Features (v0.2.0) - 3 weeks

**Features**:
- ✅ `agentweaver add/remove/list` commands
- ✅ `agentweaver update` with version management
- ✅ Additional 11 agents (marketing + sales)
- ✅ Expanded tech stack detection (Vue, Angular, Python, FastAPI, Django)
- ✅ Tech stack enforcement (strict/flexible/adaptive modes)

### Phase 3: Enterprise Features (v1.0.0) - 4 weeks

**Features**:
- ✅ `agentweaver validate` command
- ✅ Custom agent templates (user-defined agents)
- ✅ Team sharing (publish agent configs to team registry)
- ✅ Advanced MCP server configuration
- ✅ Comprehensive skills library
- ✅ Migration tool (upgrade from v0.x to v1.0)

### Phase 4: Ecosystem (v1.1.0+) - Ongoing

**Features**:
- Community agent marketplace
- Agent analytics (usage tracking)
- VSCode extension integration
- Web-based agent configurator
- Agent composition (create meta-agents from multiple agents)

---

## 8. Success Metrics

### Installation Metrics
- **Primary**: npm downloads per week
- **Target**: 1,000 downloads/week by Month 3

### Usage Metrics
- **Projects Using AgentWeaver**: Track via telemetry (opt-in)
- **Target**: 500 active projects by Month 6

### Agent Engagement
- **Most Used Agents**: backend-dev, frontend-dev, qa-tester
- **Target**: 70% of users use ≥3 agents regularly

### Quality Metrics
- **GitHub Stars**: Target 1,000 stars in Year 1
- **GitHub Issues**: <10 open issues at any time
- **Response Time**: <24h for bug reports

---

## 9. Open Questions

1. **Agent Versioning**: How do we handle breaking changes in agent templates?
   - Proposal: Semantic versioning with migration guides

2. **Custom Agents**: Should we allow users to create custom agents?
   - Proposal: v1.0 feature with template generator

3. **Agent Marketplace**: Community-contributed agents?
   - Proposal: v1.1 feature with review process

4. **Telemetry**: What usage data should we collect (opt-in)?
   - Proposal: Command usage, agent usage, errors only

5. **MCP Server Discovery**: Auto-detect available MCP servers?
   - Proposal: Scan for `@**/mcp-server` packages in node_modules

---

## 10. References

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig)
