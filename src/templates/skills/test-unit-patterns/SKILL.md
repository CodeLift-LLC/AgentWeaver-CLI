---
name: Unit Testing Patterns
description: Comprehensive patterns for writing effective unit tests using AAA pattern, test organization, and best practices. Framework-agnostic guidance applicable to any testing library.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - testing
  - unit-tests
  - tdd
  - quality
  - best-practices
mcp-servers:
  - playwright
  - socket
  - context7
---

# Unit Testing Patterns Skill

Proven patterns for writing clean, maintainable unit tests that follow the AAA (Arrange-Act-Assert) pattern and industry best practices across any programming language and testing framework.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Identify functions/components to test, write tests using AAA pattern, organize tests into logical groups, add edge cases and error scenarios, run tests and validate coverage.

**Additional tools available**:
- Use Playwright MCP for E2E testing integration
- Use Socket MCP to scan test dependencies for security issues
- Use Context7 MCP for framework-specific testing documentation

## When to Use

- Writing tests for individual functions, classes, or components
- Implementing Test-Driven Development (TDD)
- Ensuring code reliability and preventing regressions
- Documenting expected behavior through tests
- Refactoring existing code with confidence
- Verifying edge cases and error handling

## Core Principles

### 1. AAA Pattern (Arrange-Act-Assert)

The universal foundational pattern for structuring unit tests across all languages:

```
Test Structure:
├─> Arrange: Set up test data, dependencies, and preconditions
├─> Act: Execute the function/method being tested
└─> Assert: Verify the expected outcome

Benefits:
├─> Improves readability
├─> Makes test intent clear
├─> Separates setup from verification
└─> Easy to maintain and debug
```

#### Universal AAA Pattern (Pseudocode)

```
test('calculateTotal applies discount correctly'):
  // Arrange: Set up test data and dependencies
  items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ]
  discount = 0.1  // 10% discount

  // Act: Execute the function being tested
  result = calculateTotal(items, discount)

  // Assert: Verify the expected outcome
  assert result equals 225  // (200 + 50) * 0.9
```

**Why AAA Pattern Works:**
- **Arrange** answers: "What's the starting state?"
- **Act** answers: "What are we testing?"
- **Assert** answers: "What should happen?"

### 2. Test Independence

Each test must be completely independent and not rely on other tests:

```
❌ BAD: Tests depend on shared state

sharedCounter = 0

test('increment counter'):
  sharedCounter = sharedCounter + 1
  assert sharedCounter equals 1

test('increment again'):
  sharedCounter = sharedCounter + 1  // Depends on previous test!
  assert sharedCounter equals 2  // Fails if first test doesn't run

✅ GOOD: Each test is independent

test('increment counter from zero'):
  counter = 0
  result = increment(counter)
  assert result equals 1

test('increment counter from five'):
  counter = 5
  result = increment(counter)
  assert result equals 6
```

**Independence Checklist:**
- [ ] Test can run in isolation
- [ ] Test doesn't modify global/shared state
- [ ] Test order doesn't matter
- [ ] Test doesn't depend on previous test results
- [ ] Test has its own setup and teardown

### 3. Single Responsibility

Each test should verify one specific behavior:

```
❌ BAD: Testing multiple behaviors in one test

test('user registration'):
  user = createUser('john@example.com', 'password123')
  assert user.email equals 'john@example.com'
  assert user.emailVerified equals false
  assert user.createdAt is instanceof Date
  assert sendEmailFunction was called  // Multiple concerns!

✅ GOOD: Separate tests for each behavior

test('createUser sets email correctly'):
  user = createUser('john@example.com', 'password123')
  assert user.email equals 'john@example.com'

test('createUser sets emailVerified to false by default'):
  user = createUser('john@example.com', 'password123')
  assert user.emailVerified equals false

test('createUser sets createdAt timestamp'):
  user = createUser('john@example.com', 'password123')
  assert user.createdAt is instanceof Date

test('createUser sends verification email'):
  createUser('john@example.com', 'password123')
  assert sendEmailFunction was called with 'john@example.com'
```

**Single Responsibility Benefits:**
- Easier to identify what broke when test fails
- Simpler test logic
- Better test names
- Faster debugging

## Test Organization

### File Structure Patterns

```
Option 1: Co-located tests (tests next to source)
src/
├── utils/
│   ├── calculator.{ext}
│   └── calculator.test.{ext}
├── services/
│   ├── userService.{ext}
│   └── userService.test.{ext}
└── components/
    ├── Button.{ext}
    └── Button.test.{ext}

Option 2: Separate test directory (mirrors source structure)
src/
├── utils/
│   └── calculator.{ext}
├── services/
│   └── userService.{ext}
└── components/
    └── Button.{ext}

tests/ (or __tests__)
├── utils/
│   └── calculator.test.{ext}
├── services/
│   └── userService.test.{ext}
└── components/
    └── Button.test.{ext}

Choose based on:
├─> Team preference
├─> Language/framework conventions
└─> Project size and complexity
```

### Test Suite Organization Pattern

```
Hierarchical Test Grouping:

TestSuite: UserService
  ├─> TestGroup: createUser
  │   ├─> Test: creates user with valid data
  │   ├─> Test: throws error when email is invalid
  │   └─> Test: throws error when password is too short
  │
  ├─> TestGroup: updateUser
  │   ├─> Test: updates user email successfully
  │   ├─> Test: throws error when user not found
  │   └─> Test: validates new email format
  │
  └─> TestGroup: deleteUser
      ├─> Test: deletes user successfully
      ├─> Test: throws error when user not found
      └─> Test: cascades deletion to related records

Benefits:
├─> Clear organization
├─> Easy navigation
├─> Logical grouping
└─> Better test output readability
```

## Universal Testing Patterns

### 1. Testing Exceptions/Errors

```
Pattern: Verify that code throws expected errors

test('throws error when dividing by zero'):
  // Arrange
  numerator = 10
  denominator = 0

  // Act & Assert (combined for exception tests)
  assertThrows(() => {
    divide(numerator, denominator)
  }, expectedError: 'Cannot divide by zero')

test('throws specific error type'):
  assertThrows(() => {
    parseJSON('invalid json')
  }, expectedErrorType: SyntaxError)
```

**Error Testing Checklist:**
- [ ] Test expected error is thrown
- [ ] Test error message is correct
- [ ] Test error type is correct (if applicable)
- [ ] Test error contains useful context
- [ ] Test code doesn't throw when it shouldn't

### 2. Testing Async/Concurrent Code

```
Pattern: Handle asynchronous operations in tests

test('fetches user data successfully'):
  // Arrange
  userId = 123

  // Act
  user = await fetchUser(userId)

  // Assert
  assert user.id equals 123
  assert user.name is defined

test('throws error when user not found'):
  // Act & Assert
  assertRejects(async () => {
    await fetchUser(999)
  }, expectedError: 'User not found')

test('handles concurrent requests correctly'):
  // Arrange
  userIds = [1, 2, 3]

  // Act
  results = await Promise.all(
    userIds.map(id => fetchUser(id))
  )

  // Assert
  assert results.length equals 3
  assert results[0].id equals 1
  assert results[1].id equals 2
  assert results[2].id equals 3
```

**Async Testing Checklist:**
- [ ] Properly await async operations
- [ ] Test successful resolution
- [ ] Test rejection/error cases
- [ ] Test timeout scenarios
- [ ] Clean up pending operations in teardown

### 3. Parameterized/Data-Driven Tests

```
Pattern: Run same test with multiple input combinations

testCases = [
  { input: { a: 1, b: 1 }, expected: 2 },
  { input: { a: 2, b: 3 }, expected: 5 },
  { input: { a: 10, b: -5 }, expected: 5 },
  { input: { a: 0, b: 0 }, expected: 0 },
  { input: { a: -5, b: -3 }, expected: -8 }
]

for each testCase in testCases:
  test(`add(${testCase.input.a}, ${testCase.input.b}) returns ${testCase.expected}`):
    // Arrange
    a = testCase.input.a
    b = testCase.input.b

    // Act
    result = add(a, b)

    // Assert
    assert result equals testCase.expected
```

**Parameterized Testing Benefits:**
- Reduces test code duplication
- Easy to add new test cases
- Clear pattern recognition
- Better edge case coverage

### 4. Setup and Teardown

```
Pattern: Prepare and clean up test environment

TestSuite: DatabaseService

  beforeEach():
    // Runs before each test
    database = createDatabase()
    database.connect()
    database.seedTestData()

  afterEach():
    // Runs after each test
    database.clearData()
    database.disconnect()

  test('saves record successfully'):
    // Arrange
    record = { name: 'John', age: 30 }

    // Act
    result = database.save(record)

    // Assert
    assert result.id is defined
    assert result.name equals 'John'

  test('finds record by id'):
    // Arrange
    savedRecord = database.save({ name: 'Jane' })

    // Act
    foundRecord = database.findById(savedRecord.id)

    // Assert
    assert foundRecord.name equals 'Jane'
```

**Setup/Teardown Levels:**
```
beforeAll / afterAll:
  ├─> Runs once per test suite
  ├─> Use for expensive setup (start server, create DB connection pool)
  └─> Shared across all tests

beforeEach / afterEach:
  ├─> Runs before/after each test
  ├─> Use for test isolation (reset state, clear data)
  └─> Ensures test independence
```

### 5. Mocking and Test Doubles

```
Types of Test Doubles:

1. Stub: Returns predefined responses
   emailService = createStub()
   emailService.send.returns(true)

2. Mock: Records interactions and has expectations
   emailService = createMock()
   emailService.send.shouldBeCalledWith('test@example.com')

3. Spy: Wraps real object and records calls
   emailService = createSpy(realEmailService)
   emailService.send('test@example.com')
   assert emailService.send.callCount equals 1

4. Fake: Working implementation (simplified)
   database = createFakeDatabase()  // In-memory instead of real DB
```

**Mocking Pattern:**
```
test('createUser sends welcome email'):
  // Arrange
  emailService = createMock()
  userService = createUserService(emailService)
  userData = { email: 'new@example.com', name: 'New User' }

  // Act
  user = userService.createUser(userData)

  // Assert
  assert emailService.send was called once
  assert emailService.send was called with arguments:
    - to: 'new@example.com'
    - subject: 'Welcome!'
    - template: 'welcome'
```

**Mocking Best Practices:**
- Mock external dependencies (APIs, databases, file system)
- Don't mock the code you're testing
- Prefer stubs over mocks when you don't need assertions
- Clean up mocks in afterEach
- Don't over-mock (test becomes brittle)

## Component/UI Testing Pattern

```
Pattern: Testing user interface components (framework-agnostic)

test('button renders with correct text'):
  // Arrange
  buttonText = 'Click me'

  // Act
  component = renderComponent(Button, { text: buttonText })

  // Assert
  assert component contains text 'Click me'
  assert component has role 'button'

test('button calls onClick handler when clicked'):
  // Arrange
  clickHandler = createMockFunction()
  component = renderComponent(Button, {
    text: 'Click me',
    onClick: clickHandler
  })

  // Act
  simulateClick(component)

  // Assert
  assert clickHandler was called once

test('button is disabled when disabled prop is true'):
  // Arrange & Act
  component = renderComponent(Button, {
    text: 'Click me',
    disabled: true
  })

  // Assert
  assert component.getAttribute('disabled') equals true
  assert component.getAttribute('aria-disabled') equals 'true'
```

**Component Testing Checklist:**
- [ ] Test rendering with different props
- [ ] Test user interactions (click, input, etc.)
- [ ] Test accessibility attributes
- [ ] Test conditional rendering
- [ ] Test state changes
- [ ] Test error states
- [ ] Test loading states

## Best Practices

### Naming Conventions

```
✅ GOOD: Descriptive test names

Test names should be complete sentences that describe:
- What is being tested
- Under what conditions
- What the expected result is

Examples:
  test('createUser throws ValidationError when email is already registered')
  test('calculateDiscount returns 0 for non-premium users')
  test('formatDate returns ISO 8601 string when given valid Date object')
  test('shoppingCart calculates correct total with multiple items and tax')

❌ BAD: Vague test names

Examples:
  test('user test 1')
  test('discount works')
  test('formats correctly')
  test('it should work')
```

**Naming Pattern:**
```
[FunctionName] [behavior] [condition]

Examples:
├─> authenticateUser returns JWT token when credentials are valid
├─> authenticateUser throws UnauthorizedError when password is incorrect
├─> calculateShipping returns 0 when order total exceeds free shipping threshold
└─> validateEmail returns false when email format is invalid
```

### Test Data Factories

```
Pattern: Create reusable test data factories

function createTestUser(overrides = {}):
  return {
    id: generateUniqueId(),
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    emailVerified: false,
    createdAt: getCurrentTimestamp(),
    ...overrides  // Allow custom values
  }

test('updates user name'):
  // Arrange
  user = createTestUser({ name: 'Original Name' })

  // Act
  updated = updateUserName(user, 'New Name')

  // Assert
  assert updated.name equals 'New Name'
  assert updated.id equals user.id  // Other fields unchanged

test('admin user has elevated permissions'):
  // Arrange
  adminUser = createTestUser({ role: 'admin' })

  // Act
  permissions = getUserPermissions(adminUser)

  // Assert
  assert permissions.includes('delete_users')
  assert permissions.includes('modify_settings')
```

**Factory Benefits:**
- Consistent test data
- Reduces duplication
- Easy to modify default values
- Clear data requirements
- Supports builder pattern

### Assertions

```
✅ GOOD: Specific assertions

assert response.statusCode equals 200
assert response.body.data equals { id: 1, name: 'John' }
assert response.body.errors.length equals 0
assert user.createdAt is instanceof Date
assert email.subject contains 'Welcome'

❌ BAD: Overly generic assertions

assert response is truthy
assert response.body.data is defined
assert errors exists
```

**Assertion Best Practices:**
- Use most specific assertion available
- Assert on exact values when possible
- Use type-checking assertions (instanceof, typeof)
- Assert on array/collection length
- Use pattern matching for partial objects

### Test Coverage Guidelines

```
What to Test (Priority Order):

1. Public API / Exported Functions
   ├─> Functions used by other modules
   ├─> Class methods
   └─> Component props and events

2. Business Logic
   ├─> Calculations
   ├─> Validations
   ├─> Data transformations
   └─> Conditional logic

3. Edge Cases
   ├─> Boundary values (0, -1, max, min)
   ├─> Empty collections
   ├─> Null/undefined inputs
   └─> Special characters in strings

4. Error Handling
   ├─> Invalid inputs
   ├─> Network failures
   ├─> Permission denied
   └─> Resource not found

What NOT to Test:

❌ Framework/library code
❌ Third-party packages
❌ Private implementation details
❌ Trivial getters/setters
❌ Constants and configuration
```

## Common Pitfalls

### Pitfall 1: Testing Implementation Instead of Behavior

```
❌ BAD: Testing implementation details

test('user registration uses bcrypt with 10 salt rounds'):
  // This test breaks if you change hashing library
  assert bcrypt.hash was called with saltRounds: 10

✅ GOOD: Testing behavior

test('user registration stores hashed password'):
  user = registerUser('user@example.com', 'password123')
  assert user.password not equals 'password123'  // Password is hashed
  assert validatePassword(user, 'password123') equals true  // Can authenticate
```

### Pitfall 2: Dependent Tests

```
❌ BAD: Tests depend on execution order

test('create user'):
  globalUser = createUser('test@example.com')

test('update user'):  // Depends on previous test
  updateUser(globalUser.id, { name: 'Updated' })

✅ GOOD: Independent tests

test('create user'):
  user = createUser('test@example.com')
  assert user.email equals 'test@example.com'

test('update user'):
  user = createUser('test@example.com')  // Create fresh user
  updated = updateUser(user.id, { name: 'Updated' })
  assert updated.name equals 'Updated'
```

### Pitfall 3: Testing Multiple Paths in One Test

```
❌ BAD: Complex conditional logic in tests

test('user validation'):
  if user.role === 'admin':
    assert canDeleteUsers(user) equals true
  else:
    assert canDeleteUsers(user) equals false

✅ GOOD: Separate tests for each path

test('admin user can delete users'):
  adminUser = createUser({ role: 'admin' })
  assert canDeleteUsers(adminUser) equals true

test('regular user cannot delete users'):
  regularUser = createUser({ role: 'user' })
  assert canDeleteUsers(regularUser) equals false
```

### Pitfall 4: Slow Tests

```
❌ BAD: Tests take minutes to run

test('processes large dataset'):
  data = generateMillionRecords()  // Very slow
  result = processData(data)
  assert result.length equals 1000000

✅ GOOD: Fast, focused tests

test('processes dataset correctly'):
  data = [record1, record2, record3]  // Small representative sample
  result = processData(data)
  assert result.length equals 3
  assert result[0].processed equals true

Target: < 1 second per test, < 10 seconds for entire suite
```

## Testing Checklist

Before committing tests, verify:

- [ ] Each test follows AAA pattern (Arrange-Act-Assert)
- [ ] Tests are independent and can run in any order
- [ ] Test names clearly describe what is being tested
- [ ] One behavior per test (single responsibility)
- [ ] No hardcoded values without clear reason
- [ ] Edge cases are covered (null, undefined, empty, boundaries)
- [ ] Error cases are tested
- [ ] Async code is properly handled (await, promises)
- [ ] Tests run quickly (< 1 second per test)
- [ ] No console warnings or errors during execution
- [ ] Mocks/stubs are cleaned up in afterEach
- [ ] Test data is isolated and doesn't affect other tests
- [ ] Assertions are specific, not generic
- [ ] Code coverage meets team standards (typically 70-90%)

## Test-Driven Development (TDD) Workflow

```
TDD Cycle (Red-Green-Refactor):

1. RED: Write failing test
   ├─> Write test for desired behavior
   ├─> Run test (should fail)
   └─> Confirm test fails for right reason

2. GREEN: Make test pass
   ├─> Write minimal code to pass test
   ├─> Run test (should pass)
   └─> Don't optimize yet

3. REFACTOR: Improve code
   ├─> Clean up code
   ├─> Remove duplication
   ├─> Improve names
   └─> Run tests (should still pass)

4. REPEAT: Next feature

Benefits:
├─> Forces you to think about API before implementation
├─> Ensures testable code
├─> High test coverage by default
├─> Refactoring confidence
└─> Living documentation
```

## Framework-Specific Implementation Examples

For framework-specific code examples, use the Context7 MCP to fetch documentation:

**JavaScript/TypeScript Testing Frameworks:**
- Jest (React, Node.js ecosystem)
- Vitest (Vite-based projects, faster Jest alternative)
- Mocha + Chai (flexible, plugin-based)
- Jasmine (behavior-driven, no dependencies)
- AVA (concurrent test execution)
- Tape (minimalist TAP producer)

**Python Testing Frameworks:**
- Pytest (most popular, fixture-based)
- unittest (standard library, xUnit style)
- nose2 (extends unittest)
- Robot Framework (keyword-driven, acceptance testing)

**Java Testing Frameworks:**
- JUnit 5 (standard, annotation-based)
- TestNG (flexible, parallel execution)
- Mockito (mocking framework)
- AssertJ (fluent assertions)

**C# / .NET Testing Frameworks:**
- xUnit (modern, extensible)
- NUnit (mature, feature-rich)
- MSTest (Microsoft's official framework)
- FluentAssertions (readable assertions)

**Go Testing:**
- testing package (standard library)
- testify (assertions and mocking)
- Ginkgo (BDD style)

**Ruby Testing:**
- RSpec (BDD, most popular)
- Minitest (standard library)
- Test::Unit (xUnit style)

**PHP Testing:**
- PHPUnit (standard, comprehensive)
- Pest (modern, elegant syntax)
- Codeception (full-stack)

**Rust Testing:**
- Built-in test framework (cargo test)
- Criterion (benchmarking)

## Resources

**Query Context7 MCP for:**
- "[Your Language] testing best practices"
- "[Your Framework] unit testing guide"
- "[Your Language] mocking libraries"
- "[Your Framework] test coverage tools"

**Books:**
- "Test-Driven Development by Example" by Kent Beck
- "Growing Object-Oriented Software, Guided by Tests" by Steve Freeman & Nat Pryce
- "The Art of Unit Testing" by Roy Osherove
- "xUnit Test Patterns" by Gerard Meszaros

**Articles and References:**
- Martin Fowler - Unit Testing (https://martinfowler.com/bliki/UnitTest.html)
- Kent C. Dodds - Testing Trophy
- Google Testing Blog
- ThoughtWorks Technology Radar - Testing Tools and Techniques

**Test Coverage Tools:**
- JavaScript: Istanbul/nyc, c8
- Python: Coverage.py
- Java: JaCoCo, Cobertura
- C#: Coverlet, OpenCover
- Go: go test -cover
- PHP: PHPUnit Coverage

## Advanced Topics

### Mutation Testing
Verify test suite quality by introducing small code changes and checking if tests catch them.

### Property-Based Testing
Test with automatically generated inputs to find edge cases you didn't think of.

### Contract Testing
Verify integrations between services without testing actual implementation.

### Snapshot Testing
Capture component output and verify it doesn't change unexpectedly.

Use Context7 MCP to research these topics for your specific language/framework.
