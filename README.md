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

### 📚 **Reusable Skills Library with Multi-Framework Support**
- **API Pagination** - Cursor & offset-based pagination patterns
  - ✅ **7 Framework Templates**: Express, FastAPI, Spring Boot, ASP.NET Core, Gin, Rails, Laravel
  - 🎯 **Automatic Selection**: Picks the right template for your tech stack
  - 🔧 **Framework-Specific**: Uses native patterns and best practices
- **UI Form Validation** - Accessible form validation with React Hook Form + Zod
- **Database Optimization** - Query optimization, indexing, N+1 prevention

### ⚙️ **Intelligent Tech Stack Detection**
- **Multi-Language Detection** - Auto-detects **8 languages**: TypeScript, JavaScript, Python, Java, C#, Go, Ruby, PHP, Rust
- **Framework Recognition** - Identifies **15+ frameworks**: Express, NestJS, FastAPI, Django, Flask, Spring Boot, Micronaut, Quarkus, ASP.NET Core, Blazor, Gin, Echo, Fiber, Rails, Sinatra, Laravel, Symfony, and more
- **Architecture Analysis** - Detects monoliths, microservices, and monorepos
- **Smart Template Selection** - 5-factor scoring algorithm (language, framework, version, dependencies, preferences)
- **Handlebars Templating** - Full variable interpolation for customization

### 🔍 **Template Pack Validation**
- **Built-in Validator** - `agentweaver validate` command
- **Schema Validation** - Ensures template packs are correctly configured
- **File Verification** - Checks all source files exist
- **Variable Integrity** - Validates variable definitions and usage
- **Automated Testing** - 100% test coverage for all template packs

### 🌐 **Universal Tech Stack Support**
AgentWeaver now works with **any technology stack**. Here are all supported languages and frameworks:

#### Supported Languages & Frameworks

| # | Language | Frameworks Detected | Template Packs Available | Status |
|---|----------|---------------------|-------------------------|--------|
| 1 | **TypeScript** | Express, NestJS, Hono, Elysia | ✅ express-typescript | Production |
| 2 | **JavaScript** | Express, NestJS, Fastify | ✅ express-typescript | Production |
| 3 | **Python** | FastAPI, Django, Flask | ✅ fastapi | Production |
| 4 | **Java** | Spring Boot, Micronaut, Quarkus, Jakarta EE, Vert.x | ✅ spring-boot | Production |
| 5 | **C#** | ASP.NET Core, Blazor, MAUI, WPF, WinForms | ✅ aspnet-core | Production |
| 6 | **Go** | Gin, Echo, Fiber, Chi, Gorilla Mux | ✅ gin | Production |
| 7 | **Ruby** | Rails, Sinatra, Hanami, Padrino, Grape | ✅ rails | Production |
| 8 | **PHP** | Laravel, Symfony, CodeIgniter, Slim, Lumen | ✅ laravel | Production |
| 9 | **Rust** | Actix-web, Rocket, Axum, Warp, Tide | 🔜 Coming soon | Planned |

**Total**: 8 production languages, 30+ framework variants detected, 7 template packs

### ⚙️ **Configuration & Setup**
- **MCP Server Setup** - Configures GitHub, Context7, Sequential Thinking, Playwright, and more
- **Agent Configuration** - Creates `agentweaver.config.yml` with your tech stack
- **Environment Templates** - Generates `.env.example` with required variables

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
1. 🔍 **Detect your project's tech stack** - Identifies language, framework, version, dependencies
2. 📋 **Ask which agents and skills you want** - Choose from 9 agents and skill packs
3. 🎯 **Auto-select framework templates** - Picks the best template pack for your stack
4. ⚙️ **Configure MCP servers** - Sets up GitHub, Context7, and other integrations
5. 📝 **Generate configuration files** - Creates .claude/, .mcp.json, agentweaver.config.yml
6. ✅ **Install everything** - Framework-specific code ready to use

**Example output:**
```
📊 Detected Technologies:
  Architecture: monolith (monoglot)
  1. java (spring-boot) - 95% confidence

📦 Installing components...
✓ Installed 8 agents
✓ Installed 1 skill

Template packs selected:
  api-pagination: spring-boot-pagination (95% match)

✅ Installation complete!
```

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

### Validate Template Packs
```bash
# Validate all template packs
agentweaver validate

# Validate specific skill
agentweaver validate --skill api-pagination

# Verbose output
agentweaver validate --skill api-pagination --verbose
```

**Example validation output:**
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

## 📁 What Gets Created

```
your-project/
├── .claude/
│   ├── agents/                  # 8 AI agent templates
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── qa-tester.md
│   │   └── ...
│   ├── skills/                  # Reusable skill patterns
│   │   ├── api-pagination/
│   │   │   ├── SKILL.md         # Skill documentation
│   │   │   └── templates-used.json  # Selected template pack info
│   │   ├── ui-form-validation/
│   │   └── database-optimization/
│   ├── CLAUDE.md                # Project context (read by Claude Code)
│   ├── WORKFLOWS.md             # Agent workflows and collaboration
│   └── agentweaver.config.yml   # Tech stack configuration
├── src/                         # Framework-specific code installed here
│   └── (language-specific paths, e.g., main/java/com/example/app/)
│       ├── pagination/          # Generated from template pack
│       │   ├── CursorPagination.(ext)
│       │   └── OffsetPagination.(ext)
│       └── ...
├── .mcp.json                    # MCP server configuration
└── .env.example                 # Environment variables template
```

### Framework-Specific Installation Examples

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

**ASP.NET Core (C#):**
```
src/Api/
├── Pagination/
│   ├── CursorPagination.cs
│   └── OffsetPagination.cs
├── Models/
│   └── PaginationModels.cs
└── Extensions/
    └── PaginationExtensions.cs
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

### Core Documentation
- [Agent Template Guide](docs/agent-templates.md)
- [Skills Library Reference](docs/skills-library.md)
- [Configuration Options](docs/configuration.md)
- [Creating Custom Agents](docs/custom-agents.md)

### New Features (v0.1.0+)
- **[Template Pack Authoring Guide](TEMPLATE_PACK_GUIDE.md)** - Complete guide to creating framework-specific template packs
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Deep dive into multi-stack architecture
- **Template Pack Examples** - See [src/templates/skills/api-pagination/templates/](src/templates/skills/api-pagination/templates/) for 7 complete examples

### Key Capabilities

#### 1. **Universal Tech Stack Support**
AgentWeaver automatically detects and adapts to **any technology stack**:

```bash
# Works with Java/Spring Boot
cd my-spring-boot-app && agentweaver init
# → Installs spring-boot-pagination template

# Works with Python/FastAPI
cd my-fastapi-app && agentweaver init
# → Installs fastapi-pagination template

# Works with Go/Gin
cd my-gin-app && agentweaver init
# → Installs gin-pagination template
```

#### 2. **Intelligent Template Resolution**
5-factor scoring algorithm automatically selects the best template pack:

- **Language Match** (40%): Exact language match required
- **Framework Match** (30%): Exact or partial framework match
- **Version Compatibility** (15%): Semantic version checking
- **User Preferences** (10%): Custom preferences (future)
- **Dependencies** (5%): Bonus for matching optional dependencies

**Minimum score**: 50% to qualify

#### 3. **Framework-Specific Code Generation**
Each template pack uses native patterns and best practices:

**Example: Spring Boot Pagination**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    public PaginationResponse<User> getUsers(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int pageSize
    ) {
        Pageable pageable = OffsetPagination.createPageable(page, pageSize);
        Page<User> userPage = userRepository.findAll(pageable);
        return PaginationUtils.toResponse(
            OffsetPagination.fromPage(userPage)
        );
    }
}
```

**Example: FastAPI Pagination**
```python
from fastapi import APIRouter, Depends
from lib.pagination import offset_paginate, OffsetPaginationParams

@app.get("/users", response_model=OffsetPaginationResponse[User])
async def list_users(
    params: OffsetPaginationParams = Depends(),
    db: Session = Depends(get_db)
):
    query = db.query(User).order_by(User.created_at.desc())
    items, total = await offset_paginate(db, query, params)

    return create_pagination_response(items, total, params.page, params.limit)
```

#### 4. **Handlebars Variable Interpolation**
Templates use Handlebars for flexible customization:

**Template file:**
```java
package {{packageName}}.pagination;

public class CursorPagination {
    private static final int DEFAULT_PAGE_SIZE = {{defaultPageSize}};
    private static final int MAX_PAGE_SIZE = {{maxPageSize}};
}
```

**Generated code:**
```java
package com.example.app.pagination;

public class CursorPagination {
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;
}
```

#### 5. **Comprehensive Validation**
Built-in validation ensures template pack quality:

```bash
agentweaver validate --skill api-pagination

# Validates:
# ✅ Manifest schema completeness
# ✅ Source file existence
# ✅ Variable definitions
# ✅ Version compatibility
# ✅ Best practices
```

### Supported Tech Stacks

#### Languages (8 with full detection support)

| Language | Detection Method | Manifest Files | Template Packs |
|----------|-----------------|----------------|----------------|
| **TypeScript** | package.json, tsconfig.json | ✅ | express-typescript |
| **JavaScript** | package.json, .js files | ✅ | express-typescript |
| **Python** | requirements.txt, pyproject.toml, setup.py | ✅ | fastapi |
| **Java** | pom.xml, build.gradle, build.gradle.kts | ✅ | spring-boot |
| **C#** | .csproj, .sln files | ✅ | aspnet-core |
| **Go** | go.mod, go.sum | ✅ | gin |
| **Ruby** | Gemfile, Gemfile.lock | ✅ | rails |
| **PHP** | composer.json, composer.lock | ✅ | laravel |
| **Rust** | Cargo.toml, Cargo.lock | ✅ | 🔜 Planned |

#### Frameworks & Tools

| Category | Technologies |
|----------|-------------|
| **Web Frameworks** | Express, NestJS, FastAPI, Django, Flask, Spring Boot, Micronaut, Quarkus, ASP.NET Core, Blazor, Gin, Echo, Fiber, Rails, Sinatra, Laravel, Symfony |
| **ORMs** | TypeORM, Prisma, Sequelize, SQLAlchemy, Django ORM, Hibernate, Spring Data JPA, Entity Framework Core, GORM, ActiveRecord, Eloquent |
| **Databases** | PostgreSQL, MySQL, MariaDB, MongoDB, SQLite, SQL Server, Oracle, Redis, Cassandra, DynamoDB |
| **Build Tools** | npm, yarn, pnpm, bun, pip, poetry, Maven, Gradle, dotnet, go mod, cargo, bundler, composer |
| **Architecture** | Monolith, Microservices, Monorepo (nx, turbo, lerna, pnpm workspaces), Serverless |

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

### Creating Custom Template Packs

Template packs allow you to create framework-specific implementations of skills. See the **[Template Pack Authoring Guide](TEMPLATE_PACK_GUIDE.md)** for complete documentation.

**Quick Example:**

1. **Create directory structure:**
```bash
src/templates/skills/my-skill/templates/my-framework/
```

2. **Create `manifest.json`:**
```json
{
  "name": "my-framework-my-skill",
  "version": "1.0.0",
  "description": "My skill for MyFramework",
  "applicability": {
    "language": "javascript",
    "framework": ["my-framework"],
    "minVersion": "1.0.0"
  },
  "files": [
    {
      "source": "index.js",
      "target": "{{srcPath}}/lib/my-skill/index.js",
      "strategy": "skip-if-exists",
      "templateEngine": "handlebars"
    }
  ],
  "variables": {
    "srcPath": {
      "description": "Source directory",
      "default": "src",
      "type": "path"
    }
  }
}
```

3. **Create implementation file (`index.js`):**
```javascript
// My Skill Implementation
// Generated by AgentWeaver CLI

const DEFAULT_CONFIG = {
  maxItems: {{maxItems}},
  timeout: {{timeout}}
};

module.exports = { DEFAULT_CONFIG };
```

4. **Validate your template pack:**
```bash
npm run build
agentweaver validate --skill my-skill
```

**Learn more:**
- [Template Pack Authoring Guide](TEMPLATE_PACK_GUIDE.md) - Complete guide with examples
- [Template Pack Examples](src/templates/skills/api-pagination/templates/) - 7 production-ready template packs
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Architecture deep dive

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
