---
name: Test Mocking Strategies
description: Comprehensive mocking patterns for unit and integration tests, including when to mock, mock libraries, and best practices for isolating dependencies.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - testing
  - mocking
  - jest
  - vitest
  - pytest
  - stubs
  - spies
mcp-servers:
  - playwright
  - socket
---

# Test Mocking Strategies Skill

Proven patterns for mocking dependencies in tests, understanding when and how to use mocks, stubs, and spies effectively.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Identify dependencies to mock, choose mocking strategy (mocks vs stubs vs spies), implement mocks with appropriate libraries, write isolated tests, validate mocks behave correctly.

**Additional tools available**:
- Use Playwright MCP for E2E testing that complements unit test mocks
- Use Socket MCP to scan mocking library dependencies

## When to Use

- Isolating unit tests from external dependencies
- Testing code that depends on APIs, databases, or file systems
- Simulating error conditions and edge cases
- Testing time-dependent code
- Speeding up slow tests by avoiding network/IO

## Core Concepts

### Mock vs Stub vs Spy

```typescript
// SPY: Records calls but uses real implementation
const spy = jest.spyOn(emailService, 'send');
emailService.send('test@example.com', 'Hello');
expect(spy).toHaveBeenCalledWith('test@example.com', 'Hello');

// STUB: Replaces implementation with fixed response
const stub = jest.fn().mockReturnValue({ success: true });

// MOCK: Full replacement with programmable behavior
const mock = jest.fn()
  .mockReturnValueOnce({ success: false })
  .mockReturnValueOnce({ success: true });
```

### When to Mock

✅ **DO Mock**:
- External APIs and HTTP requests
- Database connections
- File system operations
- Date/time functions
- Random number generators
- Third-party services (payment, email, etc.)
- Slow operations

❌ **DON'T Mock**:
- Your own business logic (test it!)
- Simple data structures
- Pure functions without side effects
- Constants and configuration
- Framework internals (usually)

## Mocking External APIs

### JavaScript/TypeScript (Jest/Vitest)

```typescript
// api/userService.ts
export async function fetchUser(id: number) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  return response.json();
}

// __tests__/userService.test.ts
import { fetchUser } from '../userService';

// Mock the global fetch
global.fetch = jest.fn();

test('fetches user data successfully', async () => {
  // Arrange: Mock the response
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1, name: 'John Doe' })
  });

  // Act
  const user = await fetchUser(1);

  // Assert
  expect(user).toEqual({ id: 1, name: 'John Doe' });
  expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/1');
});

test('handles API errors', async () => {
  // Mock error response
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 404
  });

  await expect(fetchUser(999)).rejects.toThrow();
});
```

### Python (pytest with unittest.mock)

```python
# api/user_service.py
import requests

def fetch_user(user_id):
    response = requests.get(f"https://api.example.com/users/{user_id}")
    response.raise_for_status()
    return response.json()

# tests/test_user_service.py
from unittest.mock import Mock, patch
import pytest
from api.user_service import fetch_user

def test_fetches_user_successfully():
    # Arrange: Mock requests.get
    with patch('api.user_service.requests.get') as mock_get:
        mock_response = Mock()
        mock_response.json.return_value = {"id": 1, "name": "John Doe"}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        # Act
        user = fetch_user(1)

        # Assert
        assert user == {"id": 1, "name": "John Doe"}
        mock_get.assert_called_once_with("https://api.example.com/users/1")

def test_handles_api_errors():
    with patch('api.user_service.requests.get') as mock_get:
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.HTTPError("404")
        mock_get.return_value = mock_response

        with pytest.raises(requests.HTTPError):
            fetch_user(999)
```

## Mocking Modules

### Automatic Mocks

```typescript
// Jest: Auto-mock entire module
jest.mock('../emailService');

import { sendEmail } from '../emailService';

test('sends welcome email', () => {
  // sendEmail is automatically mocked
  (sendEmail as jest.Mock).mockResolvedValue(true);

  await registerUser('user@example.com');

  expect(sendEmail).toHaveBeenCalledWith(
    'user@example.com',
    expect.stringContaining('Welcome')
  );
});
```

### Manual Mocks

```typescript
// __mocks__/emailService.ts
export const sendEmail = jest.fn().mockResolvedValue(true);
export const validateEmail = jest.fn().mockReturnValue(true);

// __tests__/registration.test.ts
jest.mock('../emailService'); // Uses manual mock from __mocks__

import { sendEmail } from '../emailService';

test('registration sends email', async () => {
  await registerUser('user@example.com');
  expect(sendEmail).toHaveBeenCalled();
});
```

### Partial Mocks

```typescript
// Mock only specific functions, keep rest real
jest.mock('../userService', () => ({
  ...jest.requireActual('../userService'),
  fetchUser: jest.fn() // Only mock fetchUser
}));
```

## Mocking Database Operations

### Using Test Database

```typescript
// ✅ Good: Use in-memory database for integration tests
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('saves user to database', async () => {
  const user = await User.create({
    email: 'test@example.com',
    name: 'Test User'
  });

  expect(user.id).toBeDefined();
  const found = await User.findById(user.id);
  expect(found.email).toBe('test@example.com');
});
```

### Mocking Database Calls

```typescript
// For pure unit tests, mock the database layer
jest.mock('../db/userRepository');

import { UserRepository } from '../db/userRepository';

test('getUserById returns user', async () => {
  (UserRepository.findById as jest.Mock).mockResolvedValue({
    id: 1,
    name: 'John'
  });

  const user = await getUserById(1);
  expect(user.name).toBe('John');
});
```

## Mocking Time and Dates

### JavaScript/TypeScript

```typescript
// Mock Date.now()
test('creates timestamp correctly', () => {
  const now = new Date('2024-01-01T12:00:00Z');
  jest.spyOn(global.Date, 'now').mockReturnValue(now.getTime());

  const timestamp = createTimestamp();
  expect(timestamp).toBe('2024-01-01T12:00:00.000Z');
});

// Using Jest fake timers
test('delays execution by 1 second', () => {
  jest.useFakeTimers();

  const callback = jest.fn();
  delayedCall(callback, 1000);

  // Fast-forward time
  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalled();

  jest.useRealTimers();
});
```

### Python

```python
from unittest.mock import patch
from datetime import datetime

def test_creates_timestamp_correctly():
    mock_now = datetime(2024, 1, 1, 12, 0, 0)

    with patch('datetime.datetime') as mock_datetime:
        mock_datetime.now.return_value = mock_now

        timestamp = create_timestamp()
        assert timestamp == "2024-01-01T12:00:00"
```

## Mocking File System

### JavaScript/TypeScript

```typescript
// Using mock-fs
import mockFs from 'mock-fs';

beforeEach(() => {
  mockFs({
    'config': {
      'settings.json': '{"theme": "dark"}'
    }
  });
});

afterEach(() => {
  mockFs.restore();
});

test('reads config file', () => {
  const config = readConfig('config/settings.json');
  expect(config.theme).toBe('dark');
});
```

### Python

```python
from unittest.mock import mock_open, patch

def test_reads_config_file():
    mock_data = '{"theme": "dark"}'

    with patch('builtins.open', mock_open(read_data=mock_data)):
        config = read_config('config/settings.json')
        assert config['theme'] == 'dark'
```

## Spy Pattern

### Verify Function Calls

```typescript
// Spy on existing function
const logSpy = jest.spyOn(console, 'log');

performAction();

expect(logSpy).toHaveBeenCalledWith('Action completed');
logSpy.mockRestore(); // Restore original
```

### Track Call Arguments

```typescript
test('processes items correctly', () => {
  const processSpy = jest.fn();

  processItems([1, 2, 3], processSpy);

  expect(processSpy).toHaveBeenCalledTimes(3);
  expect(processSpy).toHaveBeenNthCalledWith(1, 1);
  expect(processSpy).toHaveBeenNthCalledWith(2, 2);
  expect(processSpy).toHaveBeenNthCalledWith(3, 3);
});
```

## Mocking Class Instances

### JavaScript/TypeScript

```typescript
// Mock class constructor
jest.mock('../EmailService');

import { EmailService } from '../EmailService';

test('sends email via service', () => {
  const mockSend = jest.fn().mockResolvedValue(true);
  (EmailService as jest.Mock).mockImplementation(() => ({
    send: mockSend
  }));

  const service = new EmailService();
  await service.send('test@example.com', 'Hello');

  expect(mockSend).toHaveBeenCalled();
});
```

### Python

```python
from unittest.mock import Mock, patch

def test_sends_email_via_service():
    with patch('services.EmailService') as MockEmailService:
        mock_instance = MockEmailService.return_value
        mock_instance.send.return_value = True

        service = EmailService()
        result = service.send('test@example.com', 'Hello')

        assert result is True
        mock_instance.send.assert_called_once()
```

## Advanced Patterns

### Mock Chaining

```typescript
const mockDb = {
  collection: jest.fn().mockReturnValue({
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([{ id: 1 }])
    })
  })
};

const users = await db.collection('users').find({}).toArray();
```

### Conditional Mocking

```typescript
const mockFetch = jest.fn((url) => {
  if (url.includes('/users/')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'John' })
    });
  }
  if (url.includes('/posts/')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: 'Hello' })
    });
  }
  return Promise.reject(new Error('Not found'));
});

global.fetch = mockFetch;
```

### Mock Factories

```typescript
// Create reusable mock factories
function createMockUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}

test('processes user data', () => {
  const user = createMockUser({ name: 'John Doe' });
  const result = processUser(user);
  expect(result.displayName).toBe('John Doe');
});
```

## Best Practices

### 1. Reset Mocks Between Tests

```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Clear call history
  // or
  jest.resetAllMocks(); // Clear + reset implementation
});
```

### 2. Verify Mock Calls

```typescript
// ✅ Good: Verify specific calls
expect(mockFn).toHaveBeenCalledWith('expected', 'args');
expect(mockFn).toHaveBeenCalledTimes(1);

// ❌ Bad: Just checking if called
expect(mockFn).toHaveBeenCalled();
```

### 3. Use Type-Safe Mocks

```typescript
import { mock } from 'jest-mock-extended';

interface UserService {
  getUser(id: number): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
}

const mockUserService = mock<UserService>();
mockUserService.getUser.mockResolvedValue({ id: 1, name: 'John' });
```

### 4. Don't Over-Mock

```typescript
// ❌ Bad: Mocking pure functions
const add = (a: number, b: number) => a + b;
const mockAdd = jest.fn().mockReturnValue(5);

// ✅ Good: Test the actual function
test('adds numbers', () => {
  expect(add(2, 3)).toBe(5);
});
```

## Common Pitfalls

❌ **Don't**: Mock everything (over-mocking)
✅ **Do**: Mock only external dependencies

❌ **Don't**: Forget to reset mocks between tests
✅ **Do**: Use beforeEach to clear mock state

❌ **Don't**: Mock implementation details
✅ **Do**: Mock external boundaries only

❌ **Don't**: Use mocks in integration tests (usually)
✅ **Do**: Use real implementations for integration

❌ **Don't**: Create complex mock hierarchies
✅ **Do**: Keep mocks simple and focused

## Testing Checklist

- [ ] Mocks are used only for external dependencies
- [ ] Mock implementations match real behavior
- [ ] Mocks are reset/cleared between tests
- [ ] Mock calls are verified with specific arguments
- [ ] Edge cases and errors are tested
- [ ] Type safety is maintained with mocks
- [ ] Mocks don't leak between test files
- [ ] Mock setup is clear and readable

## Framework-Specific Commands

### Jest

```bash
# Clear all mocks
jest.clearAllMocks()

# Reset all mocks
jest.resetAllMocks()

# Restore all mocks
jest.restoreAllMocks()
```

### Vitest

```bash
# Similar to Jest
vi.clearAllMocks()
vi.resetAllMocks()
vi.restoreAllMocks()
```

## References

- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [Vitest Mocking](https://vitest.dev/guide/mocking.html)
- [Python unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
- [Pytest Monkeypatch](https://docs.pytest.org/en/stable/how-to/monkeypatch.html)
- [Test Doubles - Martin Fowler](https://martinfowler.com/bliki/TestDouble.html)
- [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
