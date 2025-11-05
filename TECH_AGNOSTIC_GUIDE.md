# Tech Stack Agnostic Guide

## Overview

This guide establishes the principles and patterns for maintaining tech-stack agnostic agent and skill templates in AgentWeaver-CLI. All templates must support ANY technology stack without hardcoded assumptions about specific languages, frameworks, or tools.

## Core Principles

### 1. Universal First, Specific Second

**Always lead with universal concepts before providing specific examples.**

✅ **Good:**
```markdown
### Authentication Flow
1. User submits credentials
2. Server validates credentials
3. Server generates token
4. Server returns token to client
5. Client stores token securely
6. Client includes token in subsequent requests

Query Context7 MCP for "[Your Framework] authentication implementation"
```

❌ **Bad:**
```markdown
### Authentication with JWT in Express
app.post('/login', async (req, res) => {
  const token = jwt.sign({ userId: user.id }, SECRET_KEY);
  res.json({ token });
});
```

### 2. Use Placeholders, Not Hardcoded Technologies

**Replace specific technology mentions with placeholders.**

✅ **Good:**
- `[Your Framework]` - For frameworks (React, Vue, Django, Spring Boot, etc.)
- `[Your Language]` - For programming languages (TypeScript, Python, Go, etc.)
- `[Your Database]` - For databases (PostgreSQL, MongoDB, MySQL, etc.)
- `[Your Tool]` - For general tools
- `[Option A]` vs `[Option B]` - For comparisons
- `{{techStack.category.property}}` - For template variables

❌ **Bad:**
- "React hooks"
- "Express middleware"
- "PostgreSQL migrations"
- "Django ORM"

### 3. Reference Context7 MCP for Specifics

**Guide users to query Context7 MCP instead of providing hardcoded examples.**

✅ **Good:**
```markdown
Query Context7 MCP for framework-specific implementation:
- "[Your Framework] best practices"
- "[Your ORM] transaction patterns"
- "[Your Testing Framework] integration testing"
```

❌ **Bad:**
```markdown
Use Jest for testing:
describe('UserService', () => {
  it('should create user', async () => {
    // Jest-specific code
  });
});
```

### 4. Comprehensive Coverage

**When listing technologies, provide comprehensive coverage across 8+ language ecosystems.**

✅ **Good:**
```markdown
- `{{techStack.backend.framework}}` - Backend framework
  - **JavaScript/TypeScript**: Express.js, NestJS, Fastify, Koa, Hapi, AdonisJS
  - **Python**: FastAPI, Django, Flask, Pyramid, Tornado, Falcon
  - **Go**: Gin, Echo, Fiber, Chi, Buffalo, Revel
  - **Java**: Spring Boot, Micronaut, Quarkus, Vert.x
  - **C#**: ASP.NET Core, ServiceStack, Nancy
  - **Ruby**: Ruby on Rails, Sinatra, Hanami, Grape
  - **PHP**: Laravel, Symfony, Slim, Lumen
  - **Rust**: Actix Web, Rocket, Axum, Warp
```

❌ **Bad:**
```markdown
Common frameworks:
- React
- Vue
- Angular
```

### 5. Mark Examples as Examples

**When providing specific technology examples, clearly mark them as non-exhaustive examples.**

✅ **Good:**
```markdown
### Common Tech Stacks (Examples)

> **Note**: AgentWeaver-CLI supports debugging across ALL tech stacks. The examples below are common but not exhaustive. Query Context7 MCP for "[Your Language/Framework] debugging best practices" for specific guidance.

- **Frontend Examples**: React, Vue, Angular, Svelte, Solid, Qwik
- **Backend Examples**: Node.js, Python (FastAPI/Django), Java (Spring Boot), Go
```

❌ **Bad:**
```markdown
### Supported Tech Stacks
- React
- Node.js
- PostgreSQL
```

## Patterns to Follow

### Pattern 1: Universal Pseudocode

Use pseudocode or conceptual flows for implementation examples.

```markdown
## API Error Handling Pattern

### Error Response Structure
```
{
  "error": {
    "code": "[ERROR_CODE]",
    "message": "[Human-readable message]",
    "details": {
      "field": "[field name]",
      "reason": "[validation reason]"
    },
    "timestamp": "[ISO 8601 timestamp]",
    "requestId": "[unique request identifier]"
  }
}
```

### Error Handling Flow
```
Request → Validation → Business Logic → Response
    ↓          ↓              ↓            ↓
[Validation] [Domain]    [System]   [Transform]
[Error]      [Error]     [Error]    [to standard]
                                    [format]
```

Query Context7 MCP: "[Your Framework] error handling middleware patterns"
```

### Pattern 2: Template Variables

Use Handlebars-style template variables for configuration.

```markdown
### Database Configuration

Read from config:
- `{{techStack.database.primary}}` - Primary database
  - **Relational**: PostgreSQL, MySQL, MariaDB, SQLite
  - **NoSQL Document**: MongoDB, CouchDB, RavenDB
  - **NoSQL Key-Value**: Redis, DynamoDB, RocksDB
  - **NoSQL Graph**: Neo4j, ArangoDB, OrientDB

- `{{techStack.database.orm}}` - ORM/ODM
  - **JavaScript/TypeScript**: Prisma, TypeORM, Sequelize, Drizzle
  - **Python**: SQLAlchemy, Django ORM, Tortoise ORM, Peewee
  - **Go**: GORM, Ent, Bun, sqlx
  - **Java**: Hibernate, JPA, MyBatis, jOOQ
```

### Pattern 3: Collapsible Reference Examples

Use `<details>` tags for language-specific reference implementations.

```markdown
## Reference Examples

> **Note**: These are reference implementations. Query Context7 MCP for "[Your Framework] specific patterns".

<details>
<summary>TypeScript Example</summary>

```typescript
// TypeScript-specific code here
```
</details>

<details>
<summary>Python Example</summary>

```python
# Python-specific code here
```
</details>

<details>
<summary>Go Example</summary>

```go
// Go-specific code here
```
</details>
```

### Pattern 4: MCP Server Integration

Always reference Context7 MCP for framework-specific documentation.

```markdown
#### **Context7** - Framework Documentation
**Use for**: Looking up framework docs, patterns, best practices
**Examples**:
- "[Your Framework] authentication patterns"
- "[Your ORM] migration best practices"
- "[Your Testing Library] mocking strategies"
- "[Framework A] vs [Framework B] comparison"
- "[Your Tool] configuration guide"
```

## Language Ecosystems to Cover

### Minimum 8 Language Ecosystems

All agent and skill templates should provide comprehensive coverage for:

1. **TypeScript/JavaScript** - Node.js, Deno, Bun ecosystems
2. **Python** - CPython, PyPy ecosystems
3. **Go** - Standard Go ecosystem
4. **Java/Kotlin** - JVM ecosystem
5. **C#** - .NET ecosystem
6. **Ruby** - Ruby ecosystem
7. **PHP** - PHP ecosystem
8. **Rust** - Rust ecosystem

### Additional Ecosystems (Optional)

- **Elixir** - BEAM ecosystem
- **Swift** - Swift ecosystem (backend)
- **Scala** - JVM/Scala ecosystem

## Framework Categories

### Backend Frameworks (30+ options)

Group by language ecosystem, provide 3-7 options per language:

- **JavaScript/TypeScript**: Express.js, NestJS, Fastify, Koa, Hapi, AdonisJS, Sails.js
- **Python**: FastAPI, Django, Flask, Pyramid, Tornado, Falcon, Sanic
- **Go**: Gin, Echo, Fiber, Chi, Buffalo, Revel
- **Java**: Spring Boot, Micronaut, Quarkus, Vert.x, Dropwizard
- **C#**: ASP.NET Core, ServiceStack, Nancy
- **Ruby**: Ruby on Rails, Sinatra, Hanami, Grape
- **PHP**: Laravel, Symfony, Slim, Lumen, CodeIgniter
- **Rust**: Actix Web, Rocket, Axum, Warp

### Frontend Frameworks (20+ options)

- **React Ecosystem**: React, Next.js, Remix, Gatsby, Astro (React)
- **Vue Ecosystem**: Vue 3, Nuxt.js, Quasar, Vite + Vue
- **Angular**: Angular 17+, AnalogJS
- **Svelte**: Svelte, SvelteKit, Astro (Svelte)
- **Solid**: Solid.js, SolidStart
- **Other**: Qwik, Preact, Lit, Alpine.js, Htmx

### Database Options (25+ options)

- **Relational**: PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, Oracle
- **NoSQL Document**: MongoDB, CouchDB, RavenDB
- **NoSQL Key-Value**: Redis, DynamoDB, RocksDB
- **NoSQL Column-Family**: Cassandra, HBase, ScyllaDB
- **NoSQL Graph**: Neo4j, ArangoDB, OrientDB
- **Time-Series**: InfluxDB, TimescaleDB, QuestDB

### Testing Frameworks (20+ options)

- **JavaScript/TypeScript**: Jest, Vitest, Mocha, Ava, Jasmine
- **Python**: pytest, unittest, nose2, Robot Framework
- **Go**: testing (built-in), Testify, Ginkgo, GoConvey
- **Java**: JUnit, TestNG, Spock, AssertJ
- **C#**: xUnit, NUnit, MSTest
- **Ruby**: RSpec, Minitest
- **PHP**: PHPUnit, Pest, Codeception
- **Rust**: cargo test (built-in), rstest

## Common Mistakes to Avoid

### ❌ Mistake 1: Hardcoded Framework in Critical Logic

```markdown
## Component Generation

Use shadcn/ui to generate React components with Tailwind CSS:
```

**Why it's wrong**: Assumes React + Tailwind, excludes Vue/Svelte/Angular users.

**✅ Correct:**
```markdown
## Component Generation

Use the universal component pattern, then query Context7 MCP for "[Your Framework] component best practices".

Component Interface:
- Props/Inputs (variant, size, disabled)
- State Management (internal state)
- Styling Logic (compute classes based on props)
- Event Handlers (onClick, keyboard events)
- Accessibility (ARIA attributes)

Query Context7 MCP: "[Your Framework] component patterns"
```

### ❌ Mistake 2: Framework-Specific Code Without Context

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users")
async def get_users():
    return {"users": []}
```

**Why it's wrong**: Hardcoded FastAPI example presented as the only way.

**✅ Correct:**
```markdown
### API Endpoint Pattern

Pseudocode:
```
ENDPOINT GET /users
  AUTHENTICATE user
  AUTHORIZE read:users
  QUERY database for users
  TRANSFORM to response format
  RETURN users list
```

Query Context7 MCP: "[Your Framework] REST endpoint patterns"

<details>
<summary>Reference: Python/FastAPI Example</summary>

```python
from fastapi import FastAPI, Depends

app = FastAPI()

@app.get("/users")
async def get_users(current_user: User = Depends(get_current_user)):
    # Implementation
```
</details>
```

### ❌ Mistake 3: Technology Comparison Without Placeholders

```markdown
#### **Context7** Examples:
- "React vs Vue performance comparison"
- "PostgreSQL vs MongoDB for our use case"
```

**Why it's wrong**: Suggests only React, Vue, PostgreSQL, MongoDB are supported.

**✅ Correct:**
```markdown
#### **Context7** Examples:
- "[Framework A] vs [Framework B] performance comparison"
- "[Database A] vs [Database B] for our use case"
- "[Your Framework] best practices and design patterns"
```

### ❌ Mistake 4: Listing Tools Without "Examples" Note

```markdown
### Supported Testing Frameworks
- Jest
- Pytest
- JUnit
```

**Why it's wrong**: Appears to be an exhaustive list, excludes other frameworks.

**✅ Correct:**
```markdown
### Testing Framework Examples

> **Note**: AgentWeaver-CLI supports ALL testing frameworks. Query Context7 MCP for "[Your Testing Framework] best practices".

- **JavaScript/TypeScript**: Jest, Vitest, Mocha, Ava, Jasmine
- **Python**: pytest, unittest, nose2, Robot Framework
- **Go**: testing (built-in), Testify, Ginkgo, GoConvey
- **Java**: JUnit, TestNG, Spock, AssertJ
- **C#**: xUnit, NUnit, MSTest
- **Ruby**: RSpec, Minitest
- **PHP**: PHPUnit, Pest, Codeception
- **Rust**: cargo test (built-in), rstest
```

## Validation Checklist

Before submitting changes, verify:

### ✅ Universal Patterns
- [ ] All implementation examples use pseudocode or conceptual flows
- [ ] No hardcoded language/framework assumptions in critical logic
- [ ] Universal patterns presented before specific examples

### ✅ Placeholders
- [ ] All technology mentions use placeholders: `[Your Framework]`, `[Your Language]`, `[Your Tool]`
- [ ] Template variables use Handlebars syntax: `{{techStack.category.property}}`
- [ ] Comparisons use generic placeholders: `[Option A]` vs `[Option B]`

### ✅ Context7 MCP Integration
- [ ] All MCP examples reference Context7 for framework-specific docs
- [ ] Examples show how to query for specific technologies
- [ ] Guidance provided for obtaining implementation details

### ✅ Comprehensive Coverage
- [ ] Minimum 8 language ecosystems represented
- [ ] 3-7 options per language/framework category
- [ ] Multiple tool options for each use case

### ✅ Examples Marked Clearly
- [ ] Specific technology lists marked as "Examples" with disclaimer
- [ ] Context7 query instructions provided
- [ ] Clear note that framework is not exhaustive

### ✅ Collapsible References
- [ ] Language-specific code in `<details>` tags
- [ ] Multiple framework examples provided
- [ ] Easy to scan and find relevant examples

## Migration Guide

### Migrating Existing Templates

**Step 1: Identify Hardcoded Technologies**

Use Grep to find hardcoded mentions:
```bash
grep -r "React\|Vue\|Express\|FastAPI\|PostgreSQL\|MongoDB" src/templates/
```

**Step 2: Replace with Placeholders**

Replace specific mentions:
- `React` → `[Your Framework]` or `[Your Frontend Framework]`
- `Express` → `[Your Framework]` or `[Your Backend Framework]`
- `PostgreSQL` → `[Your Database]`
- `Jest` → `[Your Testing Framework]`

**Step 3: Add Universal Patterns**

Before specific examples, add universal pseudocode:
```markdown
### Pattern (Universal)
[Pseudocode or conceptual flow]

### Query for Specifics
Query Context7 MCP: "[Your Framework] [pattern name]"

### Reference Examples
<details>
<summary>[Language] Example</summary>
[Specific code]
</details>
```

**Step 4: Update MCP Examples**

Replace:
```markdown
- "React hooks best practices"
```

With:
```markdown
- "[Your Framework] hooks/composition patterns"
```

**Step 5: Add Comprehensive Coverage**

Expand single-framework examples to 8+ languages:
```markdown
- **JavaScript/TypeScript**: Option1, Option2, Option3
- **Python**: Option1, Option2, Option3
- **Go**: Option1, Option2, Option3
- **Java**: Option1, Option2, Option3
- **C#**: Option1, Option2, Option3
- **Ruby**: Option1, Option2, Option3
- **PHP**: Option1, Option2, Option3
- **Rust**: Option1, Option2, Option3
```

**Step 6: Mark Examples**

Add disclaimer to technology lists:
```markdown
> **Note**: AgentWeaver-CLI supports [category] across ALL tech stacks. The examples below are common but not exhaustive. Query Context7 MCP for "[Your Technology] [pattern]" for specific guidance.
```

**Step 7: Test Build**

```bash
npm run build
```

**Step 8: Commit Changes**

```bash
git add -A
git commit -m "refactor: make [file] tech-stack agnostic"
```

## Examples of Well-Refactored Files

### ✅ Excellent: deploy-docker/SKILL.md

- Leads with universal multi-stage build pattern
- Uses ASCII diagrams for conceptual flows
- Provides template with placeholders: `[base-build-image]`, `[build-command]`
- Covers 8 languages in collapsible reference examples
- References Context7 MCP for framework-specific details

### ✅ Excellent: backend-dev.md

- Comprehensive framework coverage (7 languages, 30+ frameworks)
- Template variables: `{{techStack.backend.framework}}`
- Organized by language ecosystem
- Context7 MCP examples use placeholders
- Multiple tool options for each category

### ✅ Excellent: debugger.md

- Marked "Common Tech Stacks" as examples with disclaimer
- Expanded debugging tools section with 8 languages
- Context7 note for framework-specific guidance
- Debugging techniques show multi-language alternatives

## Resources

### Related Documentation
- [PROGRESS_SUMMARY.md](./PROGRESS_SUMMARY.md) - Current refactoring status
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [README.md](./README.md) - Project overview

### Context7 MCP Usage
Query Context7 for up-to-date framework documentation:
```
"[Your Framework] [pattern/feature] best practices"
"[Your Language] [concept] implementation patterns"
"[Tool A] vs [Tool B] comparison"
```

### Build and Test
```bash
# Build project
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Support

If you have questions about maintaining tech-stack agnostic patterns:

1. Review this guide and [PROGRESS_SUMMARY.md](./PROGRESS_SUMMARY.md)
2. Check existing well-refactored files for examples
3. Open an issue for clarification
4. Submit a PR for review

---

**Remember**: The goal is to make AgentWeaver-CLI truly universal, supporting ANY technology stack without bias or hardcoded assumptions. Every developer, regardless of their chosen framework, should feel equally supported.
