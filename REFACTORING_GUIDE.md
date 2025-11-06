# Tech Stack Agnostic Refactoring Guide

This guide provides step-by-step instructions for making all AgentWeaver templates truly tech-stack agnostic.

## ✅ Completed (1/19 files)

- [x] **src/templates/skills/api-authentication/SKILL.md** - Refactored to use pseudocode and universal patterns

## 📋 Remaining Work (18/19 files)

### Priority 1: Critical Skills (4 files) - MUST FIX FIRST

These files contain hardcoded language-specific examples that must be replaced with universal patterns.

#### 1. api-error-handling/SKILL.md

**Current Issues:**
- Lines 115-220: Hardcoded Express.js/TypeScript error handling
- Lines 222-370: Hardcoded FastAPI/Python error handling
- Framework-specific middleware patterns

**Refactoring Steps:**

1. **Replace hardcoded examples with conceptual flow:**

```markdown
## Error Handler Middleware Pattern (Universal)

### Conceptual Flow
```
1. Catch all errors from request handlers
2. Extract error type and context
3. Log error with metadata:
   ├─> Request ID
   ├─> HTTP method
   ├─> Request path
   ├─> Timestamp
   └─> Stack trace (development only)
4. Determine error category:
   ├─> Validation errors (400)
   ├─> Authentication errors (401)
   ├─> Authorization errors (403)
   ├─> Not found errors (404)
   ├─> Application errors (500)
   └─> External service errors (502/503)
5. Format error response
6. Return appropriate HTTP status code
```

### Error Response Format (Standard)
```
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE_CONSTANT",
    "status": 400,
    "timestamp": "2025-01-04T12:00:00Z",
    "path": "/api/users",
    "requestId": "unique-request-id",
    "details": {
      // Optional: validation errors, field-specific issues
    }
  }
}
```

### Middleware Pseudocode
```
function errorHandlerMiddleware(error, request, response, next):
  // 1. Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    requestId: request.id,
    path: request.path,
    method: request.method
  })

  // 2. Determine status code
  statusCode = error.statusCode || 500

  // 3. Format response
  errorResponse = {
    error: {
      message: error.message,
      code: error.code || 'INTERNAL_SERVER_ERROR',
      status: statusCode,
      timestamp: now(),
      path: request.path,
      requestId: request.id
    }
  }

  // 4. Add details in development
  if (isDevelopment):
    errorResponse.error.stack = error.stack

  // 5. Send response
  response.status(statusCode).json(errorResponse)
```
```

2. **Move framework-specific examples to reference section:**

```markdown
## Framework-Specific Examples

Use Context7 MCP to fetch framework-specific error handling:

**Node.js/TypeScript:**
- Express.js error middleware
- NestJS exception filters
- Hono error handlers

**Python:**
- FastAPI exception handlers
- Django middleware
- Flask error handlers

**Java:**
- Spring Boot @ControllerAdvice
- Micronaut error handlers

**Go:**
- Gin recovery middleware
- Echo error handlers

**.NET:**
- ASP.NET Core exception middleware
- Global exception filters

**PHP:**
- Laravel exception handlers
- Symfony error handlers

**Ruby:**
- Rails rescue_from
```

3. **Add error categories section with HTTP status codes mapping**

4. **Include validation error patterns (pseudocode)**

---

#### 2. component-generation/skill.md

**Current Issues:**
- Entire file assumes React/Vue/Svelte
- Lines 11-677: Hardcoded framework-specific code
- Tailwind CSS assumed as primary styling

**Refactoring Steps:**

1. **Replace with universal component principles:**

```markdown
## Component Generation Patterns (Framework-Agnostic)

### Universal Component Architecture

**Component Structure:**
```
Component
├─> Props/Inputs (with type safety)
├─> State Management (internal)
├─> Lifecycle Methods
├─> Event Handlers
├─> Render Logic
└─> Styling
```

### Component Interface Pattern

**Example: Button Component**

**Interface Definition:**
```
Interface ButtonComponent:
  Props:
    - variant: 'primary' | 'secondary' | 'ghost' | 'danger'
    - size: 'sm' | 'md' | 'lg'
    - disabled: boolean
    - loading: boolean
    - onClick: function
    - children: content
    - ariaLabel: string (for accessibility)
    - type: 'button' | 'submit' | 'reset'

  State:
    - isPressed: boolean
    - isFocused: boolean

  Methods:
    - handleClick(event)
    - handleKeyPress(event)

  Accessibility:
    - ARIA attributes
    - Keyboard navigation (Enter, Space)
    - Focus management
    - Screen reader support
```

**Behavioral Logic (Pseudocode):**
```
function handleClick(event):
  if disabled or loading:
    event.preventDefault()
    return

  // Trigger onClick handler
  if onClick exists:
    onClick(event)

function handleKeyPress(event):
  if event.key in ['Enter', 'Space']:
    handleClick(event)
```

**Style Variants (Conceptual):**
```
Variant Styles:
  Primary:
    - Background: brand color
    - Text: white
    - Hover: darker brand color
    - Focus: outline in brand color

  Secondary:
    - Background: transparent
    - Border: brand color
    - Text: brand color
    - Hover: light brand background

  Ghost:
    - Background: transparent
    - Border: none
    - Text: brand color
    - Hover: light background

Size Styles:
  Small:  padding: 8px 12px, font: 14px
  Medium: padding: 10px 16px, font: 16px
  Large:  padding: 12px 24px, font: 18px
```
```

2. **Add accessibility patterns:**

```markdown
### Accessibility Checklist (WCAG 2.1 AA)

**For All Components:**
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Proper ARIA attributes
- [ ] Focus indicators
- [ ] Color contrast >= 4.5:1
- [ ] Responsive touch targets (44x44px minimum)
- [ ] Error messages announced
- [ ] Form labels associated with inputs
```

3. **Create framework selection guide:**

```markdown
## Framework Implementation Guides

Choose your framework and query Context7 MCP for specific implementation:

**React:**
- Functional components with hooks
- TypeScript interfaces
- CSS Modules / Tailwind / Styled Components

**Vue:**
- Composition API
- Script setup syntax
- Scoped styles

**Svelte:**
- Reactive declarations
- Component props
- Style scoping

**Angular:**
- Component decorator
- Template syntax
- CSS encapsulation

**Web Components:**
- Custom Elements API
- Shadow DOM
- Slots

**Solid.js:**
- Reactive primitives
- JSX templates
```

---

#### 3. test-unit-patterns/SKILL.md

**Current Issues:**
- Lines 59-482: Assumes Jest/Vitest for JavaScript, Pytest for Python
- Framework-specific test syntax throughout

**Refactoring Steps:**

1. **Lead with AAA pattern (language-agnostic):**

```markdown
## Universal Testing Patterns

### AAA Pattern (Arrange-Act-Assert)

**Pattern Structure:**
```
Test Case:
  Arrange:
    - Set up test data
    - Mock dependencies
    - Configure environment
    - Initialize objects

  Act:
    - Execute the function/method
    - Trigger the behavior
    - Call the system under test

  Assert:
    - Verify expected outcomes
    - Check return values
    - Validate state changes
    - Confirm side effects
```

**Example Test Case (Pseudocode):**
```
test "calculateDiscount applies percentage correctly":
  // Arrange
  originalPrice = 100
  discountPercentage = 20
  expectedPrice = 80

  // Act
  actualPrice = calculateDiscount(originalPrice, discountPercentage)

  // Assert
  assert actualPrice equals expectedPrice
```

### Test Organization Patterns

**File Structure:**
```
tests/
├─> unit/           # Unit tests (isolated functions/classes)
├─> integration/    # Integration tests (multiple components)
├─> e2e/           # End-to-end tests (full user flows)
└─> fixtures/      # Test data and mocks
```

**Test Suite Structure:**
```
Describe "UserService":
  Describe "register":
    Test "creates new user with valid data"
    Test "rejects duplicate email"
    Test "validates password strength"

  Describe "login":
    Test "authenticates with correct credentials"
    Test "rejects invalid password"
    Test "locks account after failed attempts"
```
```

2. **Add mocking patterns:**

```markdown
### Mocking Patterns (Universal)

**Mock Types:**

**1. Function Mocks:**
```
mockFunction = createMock()
mockFunction.returns(expectedValue)
mockFunction.throwsError(errorInstance)

// Verify
assert mockFunction.calledOnce()
assert mockFunction.calledWith(expectedArgs)
```

**2. Object Mocks:**
```
mockDatabase = createMock({
  findUser: () => mockUser,
  createUser: () => newMockUser
})
```

**3. Dependency Injection:**
```
// Instead of:
function processPayment():
  paymentGateway = new PaymentGateway()  // Hard to test

// Use:
function processPayment(paymentGateway):
  // Easy to inject mock
```
```

3. **Add framework-specific references:**

```markdown
## Testing Framework Examples

Query Context7 MCP for framework-specific testing patterns:

**JavaScript/TypeScript:**
- Jest: `describe`, `it`, `expect`, `jest.fn()`
- Vitest: Similar to Jest with Vite integration
- Mocha + Chai: `describe`, `it`, `should`, `expect`

**Python:**
- Pytest: `def test_*`, `assert`, `@pytest.fixture`
- unittest: `TestCase`, `setUp`, `tearDown`

**Java:**
- JUnit 5: `@Test`, `@BeforeEach`, `assertEquals`
- Mockito: `mock()`, `when()`, `verify()`

**Go:**
- testing package: `func TestName(t *testing.T)`
- testify: `assert.Equal`, `mock.Mock`

**.NET:**
- xUnit: `[Fact]`, `[Theory]`, `Assert.Equal`
- NUnit: `[Test]`, `[SetUp]`, `Assert.That`

**PHP:**
- PHPUnit: `testMethodName()`, `$this->assertEquals()`

**Ruby:**
- RSpec: `describe`, `it`, `expect().to`
- Minitest: `def test_*`, `assert_equal`
```

---

#### 4. ui-ux-dev.md (Agent Template)

**Current Issues:**
- Lines 117-159: Hardcoded React+Tailwind code example
- Lines 262-273: shadcn/ui query examples assume React

**Refactoring Steps:**

1. **Replace hardcoded React example with component contract:**

```markdown
## Component Design Pattern

### Button Component Example (Framework-Agnostic)

**Component Contract:**
```
Button Component Specification:

Interface:
  - variant: 'primary' | 'secondary' | 'ghost'
  - size: 'sm' | 'md' | 'lg'
  - disabled: boolean
  - onClick: event handler
  - children: renderable content

Visual Specifications:
  Primary Button:
    - Background: Primary brand color (#007bff)
    - Text: White (#ffffff)
    - Border radius: 6px
    - Padding: 10px 20px
    - Hover: Darken background 10%
    - Active: Darken background 15%
    - Disabled: 50% opacity

  Sizes:
    Small:  padding 6px 12px, font 14px
    Medium: padding 10px 20px, font 16px
    Large:  padding 14px 28px, font 18px

Accessibility:
  - Keyboard focusable
  - Tab order support
  - ARIA label if no text
  - Disabled state clearly indicated
  - Minimum touch target: 44x44px
  - Color contrast: 4.5:1 minimum

Behavior:
  - Click triggers onClick handler
  - Enter/Space key activates
  - Disabled prevents interaction
  - Loading state shows spinner
  - Focus shows visible outline
```

**Implementation:** Use your project's component framework and styling solution
```

2. **Update MCP query examples:**

```markdown
### Using shadcn/ui MCP (if React project)

**Query Examples for React Projects:**
- "shadcn button component with variants"
- "shadcn form components with validation"
- "shadcn dialog and modal patterns"

**For Other Frameworks:**
Query Context7 MCP for component libraries:
- Vue: Vuetify, PrimeVue, Element Plus
- Angular: Angular Material, PrimeNG
- Svelte: Svelte Material UI, Carbon Components
- Solid: Solid UI, Hope UI
```

---

### Priority 2: High Priority (3 files)

#### 5. deploy-docker/SKILL.md

**Refactoring Pattern:**

1. **Lead with generic multi-stage Dockerfile pattern:**

```markdown
## Multi-Stage Dockerfile Pattern (Universal)

### Generic Structure
```
# Stage 1: Builder
FROM <base-image-with-build-tools>

WORKDIR /build

# Copy dependency manifests
COPY <dependency-files> ./

# Install dependencies
RUN <install-dependencies-command>

# Copy source code
COPY <source-files> ./

# Build application
RUN <build-command>

# Stage 2: Production
FROM <minimal-runtime-image>

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app

# Copy artifacts from builder
COPY --from=builder --chown=appuser:appgroup /build/<output> ./

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD <health-check-command>

# Expose port
EXPOSE <port>

# Start command
CMD [<start-command>]
```

### Security Best Practices (Language-Agnostic)
- Use official base images
- Use specific version tags (not :latest)
- Run as non-root user
- Minimize layers
- Use .dockerignore
- Scan for vulnerabilities
- Use multi-stage builds to reduce size
```

2. **Move language-specific examples to appendix with MORE languages:**

```markdown
## Language-Specific Dockerfile Examples

### Node.js / TypeScript
```dockerfile
# See full example for Node.js projects
FROM node:20-alpine AS builder
# ... (keep existing example)
```

### Python
```dockerfile
# See full example for Python projects
FROM python:3.12-slim AS builder
# ... (keep existing example)
```

### Java
```dockerfile
# Maven-based Spring Boot
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /build/target/*.jar app.jar
USER appuser
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### .NET / C#
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder
WORKDIR /build
COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=builder /build/out .
EXPOSE 80
CMD ["dotnet", "YourApp.dll"]
```

### Go
```dockerfile
# ... (keep existing example)
```

### PHP
```dockerfile
FROM php:8.3-fpm-alpine AS builder
WORKDIR /build
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader
COPY . ./

FROM php:8.3-fpm-alpine
WORKDIR /app
COPY --from=builder /build .
EXPOSE 9000
CMD ["php-fpm"]
```

### Ruby
```dockerfile
FROM ruby:3.3-alpine AS builder
WORKDIR /build
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test
COPY . ./

FROM ruby:3.3-alpine
WORKDIR /app
COPY --from=builder /build .
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server"]
```

### Rust
```dockerfile
FROM rust:1.75 AS builder
WORKDIR /build
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release
COPY . ./
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /build/target/release/app .
EXPOSE 8080
CMD ["./app"]
```
```

---

#### 6-7. backend-dev.md & frontend-dev.md

**Quick fixes:**

1. **Expand framework examples in template variables:**

```markdown
# Before:
{{techStack.backend.framework}} - Backend framework (Express, FastAPI, NestJS, Django, etc.)

# After:
{{techStack.backend.framework}} - Backend framework (Express, Spring Boot, Django, FastAPI, Rails, Laravel, ASP.NET Core, Gin, Actix-web, etc.)
```

2. **Use placeholders in MCP examples:**

```markdown
# Before:
- "Prisma transaction best practices"
- "TypeORM migration strategies"

# After:
- "[Your ORM] transaction best practices"
- "[Your ORM] migration strategies"
- "[Your framework] authentication middleware patterns"
```

---

### Priority 3: Medium Priority (6 files)

**Files:** qa-tester.md, devops.md, debugger.md, tech-lead.md, docs-writer.md, marketing-manager.md

**Quick Pattern for All:**

1. **Expand tool/framework lists in template variable examples**
2. **Add "(Examples, not exhaustive)" label**
3. **Use placeholders in MCP/WebSearch query examples**

**Example for qa-tester.md:**

```markdown
# Before:
{{techStack.testing.unit}} - Unit testing framework (Jest, Vitest, pytest, etc.)

# After:
{{techStack.testing.unit}} - Unit testing framework (Jest, Vitest, pytest, JUnit, xUnit, NUnit, Go testing, RSpec, PHPUnit, etc.)

# MCP Examples - Before:
- "Jest mock patterns for API calls"

# After:
- "[Your test framework] mock patterns for API calls"
- "[Your framework] testing best practices"
```

---

### Priority 4: Low Priority (4 files)

**Files:** content-writer.md, sales-manager.md, business-analyst.md, product-owner.md

**Changes:** Minimal - just expand tool examples and add "(Examples)" labels

---

## 🎯 Implementation Checklist Template

For each file, use this checklist:

```markdown
File: [filename]

- [ ] Read current file
- [ ] Identify all language-specific code examples
- [ ] Identify all framework-specific references
- [ ] Replace hardcoded examples with:
  - [ ] Conceptual flows / pseudocode
  - [ ] Data structure definitions
  - [ ] Universal patterns
- [ ] Move framework-specific code to "Examples" section
- [ ] Expand framework lists to include ALL supported stacks
- [ ] Use placeholders in query examples ([Your Framework], [Your ORM])
- [ ] Add "Examples, not exhaustive" disclaimers
- [ ] Verify accessibility and security patterns are universal
- [ ] Test: Read through as if using a different tech stack
- [ ] Commit changes with descriptive message
```

---

## 📝 Commit Message Format

For each file:

```
refactor(templates): make [filename] tech-stack agnostic

- Replace hardcoded [Language/Framework] examples with pseudocode
- Add universal implementation patterns
- Move framework-specific examples to reference section
- Expand framework lists to include [list new frameworks]
- Use placeholders in MCP/query examples

BREAKING CHANGE: None (additive changes only)
Addresses: Tech stack agnostic refactoring initiative
```

---

## 🔧 Testing Strategy

After refactoring each file:

1. **Read through as if you use a different stack:**
   - "If I use Java/Spring Boot, can I follow this?"
   - "If I use Go/Gin, does this make sense?"

2. **Check for assumptions:**
   - Any `import` statements? → Remove or make language-tagged example
   - Any `npm install`? → Generalize to "Install dependencies"
   - Any specific file paths? → Use placeholders or patterns

3. **Verify Context7/MCP queries can work:**
   - Replace "Prisma" with "[Your ORM]"
   - Replace "React" with "[Your framework]"

---

## 📊 Progress Tracking

Use this table to track progress:

| Priority | File | Status | Assignee | Notes |
|----------|------|--------|----------|-------|
| P1 | api-authentication/SKILL.md | ✅ Done | Completed | Baseline example |
| P1 | api-error-handling/SKILL.md | ⏳ Pending | | |
| P1 | component-generation/skill.md | ⏳ Pending | | |
| P1 | test-unit-patterns/SKILL.md | ⏳ Pending | | |
| P1 | ui-ux-dev.md | ⏳ Pending | | |
| P2 | deploy-docker/SKILL.md | ⏳ Pending | | |
| P2 | backend-dev.md | ⏳ Pending | | Quick fix |
| P2 | frontend-dev.md | ⏳ Pending | | Quick fix |
| P3 | qa-tester.md | ⏳ Pending | | Quick fix |
| P3 | devops.md | ⏳ Pending | | Quick fix |
| P3 | debugger.md | ⏳ Pending | | Quick fix |
| P3 | tech-lead.md | ⏳ Pending | | Quick fix |
| P3 | docs-writer.md | ⏳ Pending | | Quick fix |
| P3 | marketing-manager.md | ⏳ Pending | | Quick fix |
| P4 | content-writer.md | ⏳ Pending | | Minimal changes |
| P4 | sales-manager.md | ⏳ Pending | | Minimal changes |
| P4 | business-analyst.md | ⏳ Pending | | Minimal changes |
| P4 | product-owner.md | ⏳ Pending | | Minimal changes |
| Docs | TECH_AGNOSTIC_GUIDE.md | ⏳ Pending | | Create new |
| Docs | CONTRIBUTING.md update | ⏳ Pending | | Add section |

---

## 🎓 Writing Style Guide

**DO:**
- ✅ Use pseudocode with clear structure
- ✅ Explain concepts before implementation
- ✅ Provide data structure schemas
- ✅ Use placeholders like `[Your Framework]`
- ✅ List multiple framework options
- ✅ Focus on patterns and principles
- ✅ Add accessibility and security as universal requirements

**DON'T:**
- ❌ Hardcode specific language syntax in main examples
- ❌ Assume reader uses specific framework
- ❌ Show only one language's approach
- ❌ Use framework-specific imports in pseudocode
- ❌ Limit examples to 2-3 languages

**PATTERN:**
```markdown
## [Pattern Name] (Universal)

### Concept
[Explain what this pattern does and why]

### Implementation Pattern (Pseudocode)
[Show generic algorithm/flow]

### Data Structures
[Define interfaces, schemas]

### Framework-Specific Examples
[Link to or briefly show multiple languages]
```

---

## 🤖 Automation Helper Script

If you want to automate parts of this, here's a bash script to find language-specific keywords:

```bash
#!/bin/bash

# Find files with language-specific imports/syntax
echo "Files with language-specific code:"

# Search for common language-specific patterns
rg -l "import .* from" src/templates/
rg -l "from .* import" src/templates/
rg -l "package.*;" src/templates/
rg -l "using.*;" src/templates/
rg -l "@RestController" src/templates/
rg -l "def.*:" src/templates/
rg -l "func.*{" src/templates/
rg -l "interface.*{" src/templates/

# Count occurrences
echo -e "\nCounts by pattern:"
echo "TypeScript/JavaScript imports:"
rg "import .* from" src/templates/ -c

echo "Python imports:"
rg "from .* import" src/templates/ -c

echo "Java/C# imports:"
rg "^(import|using) " src/templates/ -c
```

---

## ✅ Final Validation

Before considering this complete:

1. **Build Check:**
   ```bash
   npm run build
   ```

2. **Read Random Sampling:**
   - Pick 3 refactored skills
   - Read as if using Go, Java, and Python
   - Verify each makes sense without assuming language

3. **Grep Check:**
   ```bash
   # Should return minimal results:
   rg "import.*from" src/templates/skills/
   rg "from.*import" src/templates/skills/
   ```

4. **Documentation Updated:**
   - [ ] TECH_AGNOSTIC_GUIDE.md created
   - [ ] CONTRIBUTING.md updated
   - [ ] README reflects universal support

5. **Commit All Changes:**
   ```bash
   git add src/templates/
   git commit -m "refactor(templates): complete tech-stack agnostic transformation

   - Refactored 19 templates to be language/framework agnostic
   - Replaced hardcoded examples with universal patterns
   - Added comprehensive framework references
   - Created TECH_AGNOSTIC_GUIDE.md style guide

   Closes #[issue-number]"
   ```

---

## 🎯 Success Criteria

**Definition of Done:**

- [ ] All 19 files refactored per guidelines
- [ ] No hardcoded language-specific code in main content
- [ ] Framework examples clearly labeled and diverse
- [ ] Pseudocode replaces language-specific implementations
- [ ] MCP query examples use placeholders
- [ ] Build passes without errors
- [ ] Style guide created
- [ ] Contributing guide updated
- [ ] All changes committed with clear messages

**Quality Check Questions:**

1. Can a Go developer follow this skill?
2. Can a Java developer understand this pattern?
3. Can a Python developer implement this?
4. Are framework-specific examples clearly separated?
5. Do MCP queries work for any tech stack?

If you can answer "yes" to all 5 for each file, you're done! 🎉

---

## 📞 Need Help?

If you get stuck:

1. Reference the completed `api-authentication/SKILL.md` as a baseline
2. Ask: "Would this make sense if I use [different tech stack]?"
3. Use Context7 MCP to verify framework coverage
4. Test read-through with different mental models

Good luck! 🚀
