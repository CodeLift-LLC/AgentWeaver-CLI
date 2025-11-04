---
name: Test Coverage
description: Comprehensive guide to test coverage metrics, measuring code quality, coverage tools, and best practices for achieving meaningful coverage.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - testing
  - coverage
  - quality
  - metrics
  - jest
  - vitest
  - pytest
---

# Test Coverage Skill

Understanding and implementing effective test coverage strategies, metrics, and tools to ensure code quality without chasing meaningless percentages.

## When to Use

- Measuring test effectiveness in your codebase
- Identifying untested code paths
- Setting quality standards for projects
- Code review and CI/CD pipelines
- Finding gaps in test suites

## Core Concepts

### What is Test Coverage?

Test coverage measures which parts of your code are executed during tests:

```
Coverage = (Lines Executed by Tests / Total Lines) × 100%
```

**Important**: High coverage ≠ Good tests. It's about quality, not just quantity.

### Types of Coverage

#### 1. Line Coverage (Statement Coverage)

Measures which lines of code are executed:

```typescript
function divide(a: number, b: number) {
  if (b === 0) {              // Line 2: Covered
    throw new Error('Div 0');  // Line 3: NOT covered if we don't test error
  }
  return a / b;               // Line 5: Covered
}

// Test with 66% line coverage
test('divides numbers', () => {
  expect(divide(10, 2)).toBe(5);
});

// Test with 100% line coverage
test('throws on division by zero', () => {
  expect(() => divide(10, 0)).toThrow('Div 0');
});
```

#### 2. Branch Coverage

Measures which decision paths (if/else, switch, etc.) are tested:

```typescript
function getDiscount(age: number, isPremium: boolean) {
  if (age < 18) {
    return 0.1; // Branch 1
  }
  if (isPremium) {
    return 0.2; // Branch 2
  }
  return 0; // Branch 3
}

// 100% branch coverage requires testing:
// - age < 18
// - age >= 18 && isPremium
// - age >= 18 && !isPremium
```

#### 3. Function Coverage

Measures which functions are called:

```typescript
// 50% function coverage - only greet() is tested
function greet(name: string) { return `Hello, ${name}`; }
function farewell(name: string) { return `Goodbye, ${name}`; }

test('greet works', () => {
  expect(greet('John')).toBe('Hello, John');
});
```

#### 4. Path Coverage (Advanced)

Measures all possible execution paths:

```typescript
function process(a: boolean, b: boolean) {
  // 4 possible paths: TT, TF, FT, FF
  if (a) {
    if (b) {
      return 'both';
    }
    return 'only a';
  }
  if (b) {
    return 'only b';
  }
  return 'neither';
}
```

## Coverage Tools

### JavaScript/TypeScript (Jest/Vitest)

#### Running Coverage

```bash
# Jest
npm test -- --coverage

# Vitest
npm test -- --coverage

# Watch mode with coverage
npm test -- --coverage --watch
```

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,ts,tsx}',
    '!src/index.ts'
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### Coverage Output

```
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |   85.71 |    83.33 |   88.89 |   85.71 |
 userService.ts   |   90.00 |    85.71 |   100   |   90.00 | 23,45
 auth.ts          |   80.00 |    75.00 |   80.00 |   80.00 | 12,34-37
------------------|---------|----------|---------|---------|-------------------
```

### Python (pytest-cov)

#### Installation

```bash
pip install pytest-cov
```

#### Running Coverage

```bash
# Basic coverage
pytest --cov=src

# With HTML report
pytest --cov=src --cov-report=html

# With missing lines
pytest --cov=src --cov-report=term-missing

# Fail if below threshold
pytest --cov=src --cov-fail-under=80
```

#### Configuration

```ini
# pytest.ini
[pytest]
addopts = --cov=src --cov-report=html --cov-report=term-missing

# .coveragerc
[run]
omit =
    */tests/*
    */migrations/*
    */__init__.py

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
    if __name__ == .__main__.:
```

## What Should You Cover?

### ✅ Priority: Test These

1. **Business Logic**
```typescript
// HIGH PRIORITY: Core business rules
function calculateOrderTotal(items: Item[], discount: number) {
  // This MUST be thoroughly tested
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * (1 - discount);
}
```

2. **Error Handling**
```typescript
// HIGH PRIORITY: Error cases
async function fetchUser(id: number) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('User not found'); // Test this!
    }
    return response.json();
  } catch (error) {
    // Test error handling!
    logger.error('Failed to fetch user', error);
    throw error;
  }
}
```

3. **Conditional Logic**
```typescript
// HIGH PRIORITY: All branches
function getUserRole(user: User): Role {
  if (user.isAdmin) return 'admin';     // Test this
  if (user.isPremium) return 'premium'; // Test this
  return 'user';                         // Test this
}
```

4. **Edge Cases**
```typescript
// HIGH PRIORITY: Boundary conditions
test.each([
  [[], 0],           // Empty array
  [[1], 1],          // Single item
  [[1, 2, 3], 6],    // Multiple items
  [[-1, -2], -3],    // Negative numbers
  [[1.5, 2.5], 4],   // Decimals
])('sum(%p) returns %i', (input, expected) => {
  expect(sum(input)).toBe(expected);
});
```

### ❌ Lower Priority: Don't Stress About

1. **Simple Getters/Setters**
```typescript
class User {
  private name: string;

  // Low value to test
  getName() { return this.name; }
  setName(name: string) { this.name = name; }
}
```

2. **Configuration Files**
```typescript
// Don't need to test
export const config = {
  apiUrl: process.env.API_URL,
  timeout: 5000
};
```

3. **Type Definitions**
```typescript
// No need to test
interface User {
  id: number;
  name: string;
}
```

4. **Framework/Library Code**
```typescript
// Don't test React internals
render(<App />);
```

## Coverage Best Practices

### 1. Set Realistic Thresholds

```javascript
// jest.config.js - Incremental improvement
coverageThresholds: {
  global: {
    branches: 70,   // Start here
    functions: 75,
    lines: 75,
    statements: 75
  },
  // Enforce higher standards for critical code
  'src/payment/**/*.ts': {
    branches: 90,
    functions: 95,
    lines: 90,
    statements: 90
  }
}
```

### 2. Focus on Meaningful Coverage

```typescript
// ❌ Bad: 100% coverage, meaningless test
test('adds numbers', () => {
  add(2, 3); // No assertion!
});

// ✅ Good: Test behavior, not just execution
test('adds two positive numbers correctly', () => {
  expect(add(2, 3)).toBe(5);
});

test('handles negative numbers', () => {
  expect(add(-2, 3)).toBe(1);
  expect(add(2, -3)).toBe(-1);
});
```

### 3. Use Coverage to Find Gaps

```bash
# Generate HTML report
npm test -- --coverage

# Open coverage/index.html
# Look for red/yellow lines - these are untested paths
```

### 4. Exclude Non-Testable Code

```typescript
// Mark code that shouldn't be tested
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// Or use pragma comments
function unreachableCode() {
  /* istanbul ignore if */
  if (false) {
    // This will never run
  }
}
```

```python
# Python coverage exclusion
def debug_only():  # pragma: no cover
    print("Debug info")
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Test Coverage

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

      - name: Check coverage thresholds
        run: |
          npm test -- --coverage --coverageThreshold='{"global":{"lines":80}}'
```

### Coverage Badges

```markdown
# In README.md
[![Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

## Advanced Coverage Techniques

### Mutation Testing

Goes beyond coverage to test if your tests actually catch bugs:

```bash
# Install Stryker (JS/TS)
npm install -D @stryker-mutator/core

# Run mutation tests
npx stryker run
```

What it does:
- Modifies your code (mutates it)
- Runs tests to see if they catch the mutations
- Reveals weak tests even with 100% coverage

Example:
```typescript
// Original code
function isPositive(n: number) {
  return n > 0;
}

// Mutation: Change > to >=
function isPositive(n: number) {
  return n >= 0; // If your tests don't catch this, they're weak!
}
```

### Differential Coverage

Only check coverage for changed code:

```bash
# Jest with changedSince
npm test -- --coverage --changedSince=main

# Only test files changed since main branch
```

## Coverage Anti-Patterns

### 1. Chasing 100%

```typescript
// ❌ Bad: Testing for coverage, not value
test('toString works', () => {
  const obj = new MyClass();
  obj.toString(); // Just calling for coverage!
});

// ✅ Good: Test actual behavior
test('toString returns formatted string', () => {
  const obj = new MyClass({ name: 'Test' });
  expect(obj.toString()).toBe('MyClass(name=Test)');
});
```

### 2. Testing Implementation

```typescript
// ❌ Bad: Testing private methods
test('_internalHelper works', () => {
  const result = myObject._internalHelper();
  expect(result).toBeDefined();
});

// ✅ Good: Test public interface
test('publicMethod uses helper correctly', () => {
  const result = myObject.publicMethod();
  expect(result).toBe(expectedValue);
});
```

### 3. Ignoring Branch Coverage

```typescript
// Line coverage: 100% ✓
// Branch coverage: 50% ❌
function process(value: number) {
  if (value > 0) {
    return 'positive';
  }
  return 'non-positive';
}

// Only testing one branch!
test('returns positive', () => {
  expect(process(5)).toBe('positive');
});

// Need to test both branches
test('returns non-positive', () => {
  expect(process(0)).toBe('non-positive');
  expect(process(-5)).toBe('non-positive');
});
```

## Coverage Reporting

### HTML Reports

```bash
# Generate and view HTML report
npm test -- --coverage
open coverage/index.html
```

Features:
- Visual representation of coverage
- Click through to see uncovered lines
- Filter by file/directory
- Historical trends

### Terminal Reports

```bash
# Detailed terminal output
npm test -- --coverage --verbose

# Summary only
npm test -- --coverage --coverageReporters=text-summary
```

### LCOV for CI

```bash
# Generate LCOV for tools like Codecov, Coveralls
npm test -- --coverage --coverageReporters=lcov
```

## Testing Checklist

- [ ] Coverage tools are configured
- [ ] Thresholds are set for critical code
- [ ] CI fails if coverage drops below threshold
- [ ] HTML reports are reviewed regularly
- [ ] Focus on branch coverage, not just line coverage
- [ ] Edge cases and error paths are tested
- [ ] Coverage excludes test files and config
- [ ] Team understands coverage ≠ quality
- [ ] Coverage trends are monitored over time
- [ ] Non-testable code is explicitly marked

## Common Pitfalls

❌ **Don't**: Chase 100% coverage blindly
✅ **Do**: Focus on testing critical paths thoroughly

❌ **Don't**: Write tests just to increase coverage
✅ **Do**: Write tests to verify behavior

❌ **Don't**: Ignore branch coverage for line coverage
✅ **Do**: Ensure all code paths are tested

❌ **Don't**: Test third-party libraries
✅ **Do**: Test your integration with them

❌ **Don't**: Set unrealistic thresholds that block progress
✅ **Do**: Set achievable targets and improve incrementally

## Coverage Goals by Project Type

### Library/Package
- Target: 85-95% coverage
- Focus: All public APIs, edge cases
- Why: Used by others, needs reliability

### Web Application
- Target: 70-85% coverage
- Focus: Business logic, critical paths
- Why: Balance speed and quality

### Startup/MVP
- Target: 60-70% coverage
- Focus: Core features only
- Why: Speed to market matters

### Critical Systems (Finance, Healthcare)
- Target: 90-100% coverage + mutation testing
- Focus: Everything, especially error handling
- Why: Failures are costly

## References

- [Jest Coverage Documentation](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)
- [pytest-cov Documentation](https://pytest-cov.readthedocs.io/)
- [Codecov](https://codecov.io/)
- [Coveralls](https://coveralls.io/)
- [Stryker Mutator](https://stryker-mutator.io/)
- [How to Misuse Code Coverage](https://martinfowler.com/bliki/TestCoverage.html) - Martin Fowler
