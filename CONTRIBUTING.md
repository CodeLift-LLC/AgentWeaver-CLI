# Contributing to AgentWeaver CLI

Thank you for your interest in contributing to AgentWeaver CLI! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AgentWeaver-CLI.git
   cd AgentWeaver-CLI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Link for Local Testing**
   ```bash
   npm link
   ```

5. **Test in a Project**
   ```bash
   cd /path/to/test-project
   agentweaver init
   ```

## 📁 Project Structure

```
AgentWeaver-CLI/
├── src/
│   ├── cli/              # CLI commands and entry point
│   │   ├── index.ts      # Main CLI program
│   │   └── commands/     # Command implementations
│   ├── lib/              # Core library code
│   │   ├── agent-installer.ts
│   │   ├── skills-installer.ts
│   │   ├── tech-detector.ts
│   │   └── config-generator.ts
│   ├── utils/            # Utility functions
│   │   ├── file-operations.ts
│   │   └── yaml-parser.ts
│   └── templates/        # Agent and skill templates
│       ├── agents/       # Agent markdown files
│       └── skills/       # Skill directories
├── dist/                 # Compiled output (generated)
├── docs/                 # Documentation
├── tests/                # Test files
└── package.json
```

## 🔧 Development Workflow

### Running in Development Mode

```bash
# Watch mode for TypeScript compilation
npm run dev

# In another terminal, test your changes
cd test-project
agentweaver init
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 🎨 Code Style Guidelines

### TypeScript

- Use **TypeScript strict mode** - all code must pass strict type checking
- Use **ESM modules** (`import`/`export`) instead of CommonJS
- Prefer **interfaces** over type aliases for object shapes
- Use **async/await** instead of promises with `.then()`
- Add **JSDoc comments** for public APIs

### Naming Conventions

- **Classes**: PascalCase (e.g., `AgentInstaller`)
- **Functions/Methods**: camelCase (e.g., `listAvailableAgents`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_MODEL`)
- **Interfaces**: PascalCase with descriptive names (e.g., `InstallOptions`)
- **Files**: kebab-case (e.g., `agent-installer.ts`)

### Error Handling

- Create custom error classes for domain-specific errors
- Always provide helpful error messages with context
- Use try-catch blocks for async operations
- Never swallow errors silently

Example:
```typescript
export class FileOperationError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly path: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'FileOperationError';
  }
}
```

## 📝 Creating New Agent Templates

Agent templates are markdown files with YAML frontmatter located in `src/templates/agents/`.

### Agent Template Structure

```markdown
---
name: agent-name
description: Expert description. Use PROACTIVELY when...
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

# Agent Title

Agent instructions and context...

## Tech Stack Context

**IMPORTANT**: Always read `agentweaver.config.yml`...

## Automatic Invocation Triggers

Use this agent when:
- Condition 1
- Condition 2

## Core Responsibilities

1. Responsibility 1
2. Responsibility 2

## MCP Server Access

- **Context7**: For library documentation
- **Sequential**: For complex analysis

## Handoff Protocol

Hand off to:
- `@other-agent`: When condition

## Quality Standards

- Standard 1
- Standard 2
```

### Agent Frontmatter Fields

- **name** (required): Kebab-case identifier (e.g., `backend-dev`)
- **description** (required): Must include "Use PROACTIVELY when..." for automatic invocation
- **tools** (optional): Comma-separated list or array of allowed Claude Code tools
- **model** (optional): `sonnet`, `opus`, `haiku`, or `inherit`

### Testing Your Agent

1. Build the project: `npm run build`
2. Create a test project: `agentweaver init --agents your-agent-name`
3. Verify the agent file is copied to `.claude/agents/`
4. Test in Claude Code: `@your-agent-name test this agent`

## 🎯 Creating New Skills

Skills are directories with a `SKILL.md` file and optional code templates.

### Skill Directory Structure

```
skills/my-skill/
├── SKILL.md           # Skill documentation (required)
├── examples/          # Code examples (optional)
├── templates/         # Template files (optional)
└── assets/            # Images, diagrams (optional)
```

### Skill Frontmatter

```markdown
---
name: My Skill Name
description: Brief description of the skill
allowed-tools:
  - Read
  - Write
  - Edit
tags:
  - api
  - backend
  - performance
---

# My Skill

Detailed skill documentation with examples...
```

### Skill Frontmatter Fields

- **name** (required): Human-readable skill name
- **description** (required): Brief description of the skill
- **allowed-tools** (optional): Array or comma-separated list of tools
- **tags** (optional): Array or comma-separated list of tags for categorization

## 🧪 Testing Guidelines

### Unit Tests

Write unit tests for utility functions and library code:

```typescript
import { describe, it, expect } from 'vitest';
import { validateAgentFrontmatter } from '../utils/yaml-parser';

describe('validateAgentFrontmatter', () => {
  it('should accept valid frontmatter', () => {
    const frontmatter = {
      name: 'test-agent',
      description: 'Test agent description',
    };
    expect(() => validateAgentFrontmatter(frontmatter, 'test.md')).not.toThrow();
  });

  it('should reject missing name', () => {
    const frontmatter = {
      description: 'Test agent description',
    };
    expect(() => validateAgentFrontmatter(frontmatter, 'test.md')).toThrow();
  });
});
```

### Integration Tests

Test end-to-end workflows:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AgentInstaller } from '../lib/agent-installer';
import fs from 'fs-extra';
import path from 'path';

describe('AgentInstaller', () => {
  const testDir = path.join(__dirname, 'tmp');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should install agents to target directory', async () => {
    // Test implementation
  });
});
```

### Test Coverage

- Aim for **>80% code coverage** for utility functions
- Test **edge cases** and **error conditions**
- Use **descriptive test names** that explain what is being tested

## 📚 Documentation

### Adding Documentation

Documentation files are located in the `docs/` directory:

- `agent-templates.md` - Guide to agent templates
- `skills-library.md` - Skills library reference
- `configuration.md` - Configuration options
- `custom-agents.md` - Creating custom agents

### Documentation Style

- Use **clear headings** and **table of contents**
- Include **code examples** for all features
- Add **screenshots** or **diagrams** where helpful
- Keep documentation **up-to-date** with code changes

## 🐛 Bug Reports

### Before Submitting

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
2. Verify it's actually a bug and not expected behavior
3. Collect relevant information (OS, Node version, error messages)

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- Node.js: [e.g., 18.17.0]
- AgentWeaver CLI: [e.g., 0.1.0]

**Additional Context**
Any other relevant information
```

## ✨ Feature Requests

### Before Requesting

1. Check if the feature has been suggested in [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
2. Consider if it fits the project scope and philosophy
3. Think about how it would benefit other users

### Feature Request Template

```markdown
**Problem Statement**
Describe the problem this feature would solve

**Proposed Solution**
Describe your proposed solution

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

## 🔀 Pull Request Process

### Before Submitting

1. **Create an issue** first to discuss major changes
2. **Fork the repository** and create a feature branch
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Run tests and linting** before submitting

### PR Guidelines

- **One feature per PR** - keep PRs focused and reviewable
- **Write clear commit messages** following [Conventional Commits](https://www.conventionalcommits.org/)
- **Include tests** for new features or bug fixes
- **Update README** if adding user-facing features
- **Add changeset** for versioning (if applicable)

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or tooling changes

Examples:
```
feat(agents): add data-scientist agent template

fix(installer): handle comma-separated tools in YAML frontmatter

docs(readme): add installation troubleshooting section
```

### PR Checklist

- [ ] Tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation updated (if needed)
- [ ] README updated (if user-facing changes)
- [ ] Commit messages follow guidelines
- [ ] PR description explains the changes

## 📦 Release Process

Releases are managed by maintainers following semantic versioning:

- **Patch** (0.1.X): Bug fixes, minor improvements
- **Minor** (0.X.0): New features, non-breaking changes
- **Major** (X.0.0): Breaking changes

## 💬 Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/CodeLift-LLC/AgentWeaver-CLI/discussions)
- **Documentation**: [Read the docs](https://github.com/CodeLift-LLC/AgentWeaver-CLI/tree/main/docs)

## 📜 Code of Conduct

This project follows a simple code of conduct:

- **Be respectful** and considerate of others
- **Be collaborative** and help each other
- **Be patient** with new contributors
- **Be constructive** in feedback and discussions

## 🙏 Thank You

Thank you for contributing to AgentWeaver CLI! Your contributions help make AI-assisted development better for everyone.

---

**Questions?** Open an issue or start a discussion!
