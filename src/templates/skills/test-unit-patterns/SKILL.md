---
name: Unit Testing Patterns
description: Comprehensive patterns for writing effective unit tests using AAA pattern, test organization, and best practices for Jest/Vitest and Pytest.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - testing
  - unit-tests
  - jest
  - vitest
  - pytest
  - tdd
  - quality
---

# Unit Testing Patterns Skill

Proven patterns for writing clean, maintainable unit tests that follow the AAA (Arrange-Act-Assert) pattern and industry best practices.

## When to Use

- Writing tests for individual functions, classes, or components
- Implementing Test-Driven Development (TDD)
- Ensuring code reliability and preventing regressions
- Documenting expected behavior through tests
- Refactoring existing code with confidence

## Core Principles

### 1. AAA Pattern (Arrange-Act-Assert)

The foundational pattern for structuring unit tests:

```typescript
// Jest/Vitest Example
test('calculateTotal applies discount correctly', () => {
  // Arrange: Set up test data and dependencies
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ];
  const discount = 0.1; // 10% discount

  // Act: Execute the function being tested
  const result = calculateTotal(items, discount);

  // Assert: Verify the expected outcome
  expect(result).toBe(225); // (200 + 50) * 0.9
});
```

```python
# Pytest Example
def test_calculate_total_applies_discount_correctly():
    # Arrange
    items = [
        {"price": 100, "quantity": 2},
        {"price": 50, "quantity": 1}
    ]
    discount = 0.1

    # Act
    result = calculate_total(items, discount)

    # Assert
    assert result == 225
```

### 2. Test Independence

Each test should be completely independent and not rely on other tests:

```typescript
// ❌ Bad: Tests depend on shared state
let counter = 0;

test('increment counter', () => {
  counter++;
  expect(counter).toBe(1);
});

test('increment again', () => {
  counter++; // Depends on previous test!
  expect(counter).toBe(2);
});

// ✅ Good: Each test is independent
test('increment counter from zero', () => {
  const counter = 0;
  const result = increment(counter);
  expect(result).toBe(1);
});

test('increment counter from five', () => {
  const counter = 5;
  const result = increment(counter);
  expect(result).toBe(6);
});
```

### 3. Single Responsibility

Each test should verify one specific behavior:

```typescript
// ❌ Bad: Testing multiple behaviors
test('user registration', () => {
  const user = createUser('john@example.com', 'password123');
  expect(user.email).toBe('john@example.com');
  expect(user.emailVerified).toBe(false);
  expect(user.createdAt).toBeInstanceOf(Date);
  expect(sendEmail).toHaveBeenCalled(); // Multiple concerns!
});

// ✅ Good: Separate tests for each behavior
test('createUser sets email correctly', () => {
  const user = createUser('john@example.com', 'password123');
  expect(user.email).toBe('john@example.com');
});

test('createUser sets emailVerified to false by default', () => {
  const user = createUser('john@example.com', 'password123');
  expect(user.emailVerified).toBe(false);
});

test('createUser sends verification email', () => {
  createUser('john@example.com', 'password123');
  expect(sendEmail).toHaveBeenCalledWith('john@example.com', expect.any(String));
});
```

## Test Organization

### File Structure

```
src/
├── utils/
│   ├── calculator.ts
│   └── __tests__/
│       └── calculator.test.ts
├── services/
│   ├── userService.ts
│   └── __tests__/
│       └── userService.test.ts
└── components/
    ├── Button.tsx
    └── __tests__/
        └── Button.test.tsx
```

### Test Suite Organization

```typescript
// Jest/Vitest: Use describe blocks for logical grouping
describe('UserService', () => {
  describe('createUser', () => {
    test('creates user with valid data', () => { /* ... */ });
    test('throws error when email is invalid', () => { /* ... */ });
    test('throws error when password is too short', () => { /* ... */ });
  });

  describe('updateUser', () => {
    test('updates user email successfully', () => { /* ... */ });
    test('throws error when user not found', () => { /* ... */ });
  });
});
```

```python
# Pytest: Use classes for grouping
class TestUserService:
    class TestCreateUser:
        def test_creates_user_with_valid_data(self):
            pass

        def test_throws_error_when_email_invalid(self):
            pass

    class TestUpdateUser:
        def test_updates_user_email_successfully(self):
            pass
```

## Common Testing Patterns

### 1. Testing Exceptions/Errors

```typescript
// Jest/Vitest
test('throws error when dividing by zero', () => {
  expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
});

test('throws specific error type', () => {
  expect(() => parseJSON('invalid')).toThrow(SyntaxError);
});
```

```python
# Pytest
def test_raises_error_when_dividing_by_zero():
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)
```

### 2. Testing Async Code

```typescript
// Jest/Vitest: async/await
test('fetches user data successfully', async () => {
  const user = await fetchUser(123);
  expect(user.id).toBe(123);
  expect(user.name).toBeDefined();
});

// Testing rejections
test('throws error when user not found', async () => {
  await expect(fetchUser(999)).rejects.toThrow('User not found');
});
```

```python
# Pytest: async tests with pytest-asyncio
@pytest.mark.asyncio
async def test_fetches_user_data_successfully():
    user = await fetch_user(123)
    assert user.id == 123
    assert user.name is not None
```

### 3. Parameterized Tests

```typescript
// Jest/Vitest: test.each
test.each([
  [1, 1, 2],
  [2, 3, 5],
  [10, -5, 5],
  [0, 0, 0],
])('add(%i, %i) returns %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});
```

```python
# Pytest: parametrize decorator
@pytest.mark.parametrize("a,b,expected", [
    (1, 1, 2),
    (2, 3, 5),
    (10, -5, 5),
    (0, 0, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

### 4. Setup and Teardown

```typescript
// Jest/Vitest: beforeEach/afterEach
describe('DatabaseService', () => {
  let db: Database;

  beforeEach(() => {
    // Runs before each test
    db = new Database();
    db.connect();
  });

  afterEach(() => {
    // Runs after each test
    db.disconnect();
  });

  test('saves record successfully', () => {
    const result = db.save({ name: 'John' });
    expect(result).toBeTruthy();
  });
});
```

```python
# Pytest: fixtures
@pytest.fixture
def db():
    database = Database()
    database.connect()
    yield database
    database.disconnect()

def test_saves_record_successfully(db):
    result = db.save({"name": "John"})
    assert result is True
```

## Frontend Component Testing

### React Testing Library Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Best Practices

### Naming Conventions

```typescript
// ✅ Good: Descriptive test names
test('createUser throws error when email is already registered', () => {});
test('calculateDiscount returns 0 for non-premium users', () => {});
test('formatDate returns ISO string when given valid date', () => {});

// ❌ Bad: Vague test names
test('user test 1', () => {});
test('discount works', () => {});
test('formats correctly', () => {});
```

### Test Data

```typescript
// Create test data factories for consistency
function createTestUser(overrides = {}) {
  return {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    ...overrides
  };
}

test('updates user name', () => {
  const user = createTestUser({ name: 'Original Name' });
  const updated = updateUserName(user, 'New Name');
  expect(updated.name).toBe('New Name');
});
```

### Assertions

```typescript
// ✅ Good: Specific assertions
expect(result.status).toBe(200);
expect(result.data).toEqual({ id: 1, name: 'John' });
expect(result.errors).toHaveLength(0);

// ❌ Bad: Overly generic assertions
expect(result).toBeTruthy();
expect(result.data).toBeDefined();
```

## Common Pitfalls

❌ **Don't**: Test implementation details
✅ **Do**: Test behavior and outcomes

❌ **Don't**: Write tests that depend on execution order
✅ **Do**: Make each test independent and isolated

❌ **Don't**: Use real external dependencies (databases, APIs)
✅ **Do**: Use mocks, stubs, or in-memory alternatives

❌ **Don't**: Test framework code or third-party libraries
✅ **Do**: Test your own business logic

❌ **Don't**: Write tests after the code (usually)
✅ **Do**: Consider Test-Driven Development (TDD)

## Testing Checklist

- [ ] Each test follows AAA pattern
- [ ] Tests are independent and can run in any order
- [ ] Test names clearly describe what is being tested
- [ ] One assertion per test (or closely related assertions)
- [ ] No hardcoded values without clear reason
- [ ] Edge cases are covered (null, undefined, empty, boundaries)
- [ ] Error cases are tested
- [ ] Async code is properly tested
- [ ] Tests run quickly (< 1 second per test)
- [ ] No console warnings or errors during test execution

## Framework-Specific Commands

### Jest/Vitest

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- user.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="createUser"
```

### Pytest

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_user.py

# Run specific test
pytest tests/test_user.py::test_create_user

# Run tests matching pattern
pytest -k "create_user"

# Run with coverage
pytest --cov=src --cov-report=html
```

## References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/react)
- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Kent Beck
- [Unit Testing Principles](https://martinfowler.com/bliki/UnitTest.html) - Martin Fowler
