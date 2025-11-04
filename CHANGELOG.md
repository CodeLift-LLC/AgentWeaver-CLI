# Changelog

All notable changes to AgentWeaver CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added
- **CLAUDE.md generation**: Auto-generated project context file that Claude Code reads on startup
  - **@ File References**: Uses `@agents/[name].md` and `@skills/[name]/SKILL.md` syntax to automatically load full agent and skill definitions into Claude Code context
  - Lists all installed agents with descriptions, usage patterns, and automatic invocation triggers
  - Documents available skills with implementation patterns
  - Provides project overview and tech stack information
  - Serves as entry point for Claude Code to discover and fully load agents and skills
- Improved success message with "Restart Claude Code" reminder

### Changed
- **BREAKING**: Moved configuration files into `.claude/` directory for better organization
  - `.mcp.json` → `.claude/.mcp.json`
  - `agentweaver.config.yml` → `.claude/agentweaver.config.yml`
  - `CLAUDE.md` → `.claude/CLAUDE.md`
  - `.env.example` remains at project root for visibility
- Updated all agent templates to reference `.claude/agentweaver.config.yml`
- Enhanced README with comprehensive automatic vs manual invocation guide
- Added extensive troubleshooting section for agent registration and invocation
- Improved documentation clarity on how Claude Code discovers and triggers agents

### Fixed
- **Skill file references**: Now use directory names (e.g., `api-pagination`) instead of display names (e.g., `API Pagination`) in CLAUDE.md @ references
- Agent definitions are now properly loaded into Claude Code context via @ file references, ensuring automatic invocation works correctly
## [0.1.0] - 2025-01-03

### Added
- Initial release of AgentWeaver CLI
- 8 pre-built AI agent templates:
  - `backend-dev` - Backend development specialist
  - `frontend-dev` - Frontend/UI development specialist
  - `qa-tester` - Quality assurance and testing specialist
  - `tech-lead` - Technical leadership and architecture
  - `devops` - DevOps and infrastructure specialist
  - `product-owner` - Product management and requirements
  - `scrum-master` - Agile project management
  - `docs-writer` - Technical documentation specialist
- 3 reusable skills library:
  - `api-pagination` - API pagination patterns (cursor & offset)
  - `ui-form-validation` - Accessible form validation with React Hook Form + Zod
  - `database-optimization` - Query optimization and N+1 prevention
- Intelligent tech stack detection:
  - Frontend: Next.js, React, Vue, Angular, Svelte, Solid
  - Backend: Express, FastAPI, NestJS, Django, Flask
  - Database: PostgreSQL, MongoDB, MySQL, SQLite, Prisma, TypeORM
  - Testing: Jest, Vitest, Playwright, Cypress
  - Deployment: Vercel, Netlify, Docker, GitHub Actions
- MCP server configuration generator:
  - GitHub integration
  - Context7 documentation lookup
  - Sequential Thinking for complex analysis
  - Playwright for E2E testing
  - shadcn/ui components
  - Supabase database
- Configuration file generation:
  - `.mcp.json` - MCP server configuration
  - `agentweaver.config.yml` - Tech stack configuration
  - `.env.example` - Environment variables template
- CLI commands:
  - `agentweaver init` - Interactive setup wizard
  - `--yes` flag for non-interactive setup
  - `--agents` to specify agents to install
  - `--skills` to specify skills to install
  - `--no-mcp` to skip MCP configuration
  - `--mode` to set tech stack mode (strict/flexible/adaptive)
- Comprehensive documentation:
  - Installation guide
  - Usage examples
  - Configuration options
  - Contributing guidelines
- Cross-platform support: Windows, macOS, Linux
- Node.js 16+ compatibility
- TypeScript strict mode implementation
- Comprehensive test coverage

### Technical Details
- ESM modules with modern JavaScript
- Type-safe YAML frontmatter parsing
- Flexible tool specification (array or comma-separated string)
- Robust error handling and validation
- Cross-platform path handling
- Template copying during build process

[Unreleased]: https://github.com/CodeLift-LLC/AgentWeaver-CLI/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/CodeLift-LLC/AgentWeaver-CLI/releases/tag/v0.1.0
