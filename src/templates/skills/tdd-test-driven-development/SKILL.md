---
name: Test-Driven Development
description: Comprehensive guide to Test-Driven Development (TDD) including Red-Green-Refactor cycle, writing tests first, testable design patterns, and complete TDD session examples in TypeScript and Python.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - tdd
  - test-driven-development
  - testing
  - red-green-refactor
  - unit-testing
  - jest
  - pytest
  - quality
mcp-servers:
  - playwright
  - socket
---

# Test-Driven Development (TDD) Skill

A comprehensive guide to Test-Driven Development: the practice of writing tests before implementation code. This skill covers the complete TDD cycle with practical examples and real-world scenarios.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Follow Red-Green-Refactor cycle: write failing test (Red), write minimal code to pass (Green), refactor for quality (Refactor), repeat for each feature incrementally.

**Additional tools available**:
- Use Playwright MCP for E2E TDD workflows
- Use Socket MCP to scan test dependencies

## When to Use TDD

- Building new features with well-defined requirements
- Refactoring complex code that needs safety nets
- Implementing algorithms with clear inputs/outputs
- Working on critical business logic
- Learning a new API or framework
- Need high test coverage from the start
- Working in a team that values clean, testable code

## When to Test After (Not TDD)

- Quick prototypes or throwaway code
- Spike solutions to explore unknowns
- UI layout and visual design
- Integration with external systems (explore first, then test)
- Research and experimentation
- Very simple CRUD operations
- When requirements are extremely vague or rapidly changing

## The Red-Green-Refactor Cycle

The core of TDD: a three-step cycle repeated for each small piece of functionality.

```
1. RED:    Write a failing test
2. GREEN:  Write minimal code to make it pass
3. REFACTOR: Improve code while keeping tests green
```

### Step-by-Step Example: String Calculator

Let's build a simple calculator that adds numbers in a string.

**Iteration 1: Empty String**

```typescript
// RED: Write the test first
describe('StringCalculator', () => {
  test('returns 0 for empty string', () => {
    const calculator = new StringCalculator();
    expect(calculator.add('')).toBe(0);
  });
});

// Test fails: StringCalculator doesn't exist yet

// GREEN: Minimal code to pass
class StringCalculator {
  add(numbers: string): number {
    return 0; // Simplest thing that makes the test pass
  }
}

// Test passes!

// REFACTOR: Nothing to refactor yet
```

**Iteration 2: Single Number**

```typescript
// RED: Add new test
test('returns the number when given single number', () => {
  const calculator = new StringCalculator();
  expect(calculator.add('5')).toBe(5);
});

// Test fails: returns 0, expected 5

// GREEN: Update code to pass both tests
class StringCalculator {
  add(numbers: string): number {
    if (numbers === '') return 0;
    return parseInt(numbers); // Minimal change
  }
}

// All tests pass!

// REFACTOR: Could improve, but it's still simple
```

**Iteration 3: Two Numbers**

```typescript
// RED: Add test for two numbers
test('returns sum of two numbers separated by comma', () => {
  const calculator = new StringCalculator();
  expect(calculator.add('1,2')).toBe(3);
});

// Test fails: returns NaN

// GREEN: Make it pass
class StringCalculator {
  add(numbers: string): number {
    if (numbers === '') return 0;

    const parts = numbers.split(',');
    if (parts.length === 1) {
      return parseInt(parts[0]);
    }

    return parts
      .map(n => parseInt(n))
      .reduce((sum, n) => sum + n, 0);
  }
}

// All tests pass!

// REFACTOR: Simplify
class StringCalculator {
  add(numbers: string): number {
    if (numbers === '') return 0;

    return numbers
      .split(',')
      .map(n => parseInt(n))
      .reduce((sum, n) => sum + n, 0);
  }
}

// Tests still pass after refactoring!
```

**Python Version:**

```python
# RED: Write test first
def test_returns_zero_for_empty_string():
    calculator = StringCalculator()
    assert calculator.add('') == 0

# GREEN: Minimal implementation
class StringCalculator:
    def add(self, numbers: str) -> int:
        return 0

# RED: Add more tests
def test_returns_number_for_single_number():
    calculator = StringCalculator()
    assert calculator.add('5') == 5

# GREEN: Update implementation
class StringCalculator:
    def add(self, numbers: str) -> int:
        if numbers == '':
            return 0
        return int(numbers)

# RED: Test two numbers
def test_returns_sum_of_two_numbers():
    calculator = StringCalculator()
    assert calculator.add('1,2') == 3

# GREEN: Make it pass
class StringCalculator:
    def add(self, numbers: str) -> int:
        if numbers == '':
            return 0

        parts = numbers.split(',')
        return sum(int(n) for n in parts)
```

## Writing Tests First: The Thinking Process

### Before Writing Any Code, Ask:

1. **What should this function/method do?**
2. **What are the inputs?**
3. **What should it return?**
4. **What edge cases exist?**

### Example: Password Validator

**Requirement**: Create a password validator that ensures passwords are at least 8 characters, contain uppercase, lowercase, and a number.

**TDD Thinking Process:**

```typescript
// Thought: "What's the simplest case? Empty password should be invalid."
test('rejects empty password', () => {
  expect(isValidPassword('')).toBe(false);
});

// Thought: "Too short should be invalid"
test('rejects password shorter than 8 characters', () => {
  expect(isValidPassword('Ab1')).toBe(false);
});

// Thought: "What about exactly 8 characters but missing requirements?"
test('rejects password without uppercase letter', () => {
  expect(isValidPassword('abcdefg1')).toBe(false);
});

test('rejects password without lowercase letter', () => {
  expect(isValidPassword('ABCDEFG1')).toBe(false);
});

test('rejects password without number', () => {
  expect(isValidPassword('Abcdefgh')).toBe(false);
});

// Thought: "Now the happy path - what makes a valid password?"
test('accepts password meeting all requirements', () => {
  expect(isValidPassword('Password1')).toBe(true);
  expect(isValidPassword('MyP@ssw0rd')).toBe(true);
});

// Implementation emerges from tests
function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}
```

## Test Structure and Naming

### AAA Pattern (Arrange-Act-Assert)

Every test should follow this structure:

```typescript
test('descriptive name explaining what is tested', () => {
  // ARRANGE: Set up test data and dependencies
  const user = { name: 'John', age: 25 };
  const validator = new AgeValidator();

  // ACT: Execute the code being tested
  const result = validator.isAdult(user);

  // ASSERT: Verify the result
  expect(result).toBe(true);
});
```

### Naming Tests

```typescript
// ✅ Good: Describes behavior and expected outcome
test('calculateDiscount returns 10% off for premium members')
test('createUser throws error when email is already registered')
test('formatDate returns ISO string when given valid date')

// ❌ Bad: Vague or implementation-focused
test('test1')
test('discount works')
test('it should work correctly')
```

```python
# ✅ Good: Descriptive Python test names
def test_calculate_discount_returns_10_percent_for_premium_members():
    pass

def test_create_user_raises_error_when_email_already_registered():
    pass

# ❌ Bad: Not descriptive
def test_discount():
    pass

def test_user():
    pass
```

## Testable Design and Dependency Injection

TDD naturally leads to better design through dependency injection.

### Hard to Test (Tightly Coupled)

```typescript
// ❌ Hard to test - depends on real database
class UserService {
  async createUser(email: string, password: string) {
    // Direct dependency on database
    const db = new Database('postgresql://...');
    const exists = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (exists) {
      throw new Error('Email already registered');
    }

    // More database calls...
  }
}

// Can't test without a real database!
```

### Easy to Test (Dependency Injection)

```typescript
// ✅ Easy to test - dependencies injected
interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new Error('Email already registered');
    }

    const user = User.create(email, password);
    await this.userRepository.save(user);
    return user;
  }
}

// Test with mock repository
test('createUser throws error when email exists', async () => {
  // Arrange: Create a mock that returns an existing user
  const mockRepo: UserRepository = {
    findByEmail: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
    save: jest.fn()
  };

  const service = new UserService(mockRepo);

  // Act & Assert
  await expect(
    service.createUser('test@example.com', 'password')
  ).rejects.toThrow('Email already registered');

  // Verify save was never called
  expect(mockRepo.save).not.toHaveBeenCalled();
});
```

**Python Version with Dependency Injection:**

```python
# Protocol for type hints (Python 3.8+)
from typing import Protocol, Optional

class UserRepository(Protocol):
    async def find_by_email(self, email: str) -> Optional['User']:
        ...

    async def save(self, user: 'User') -> None:
        ...

class UserService:
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository

    async def create_user(self, email: str, password: str) -> 'User':
        existing = await self._user_repository.find_by_email(email)

        if existing:
            raise ValueError("Email already registered")

        user = User.create(email, password)
        await self._user_repository.save(user)
        return user

# Test with mock
@pytest.mark.asyncio
async def test_create_user_raises_error_when_email_exists():
    # Arrange
    mock_repo = Mock(spec=UserRepository)
    mock_repo.find_by_email.return_value = User(email='test@example.com')

    service = UserService(mock_repo)

    # Act & Assert
    with pytest.raises(ValueError, match="Email already registered"):
        await service.create_user('test@example.com', 'password')

    # Verify save was never called
    mock_repo.save.assert_not_called()
```

## Mocking Strategies in TDD

### When to Mock

- External services (APIs, databases, file systems)
- Slow operations
- Non-deterministic behavior (random, time, network)
- Focus on testing one unit in isolation

### Mock Types

**1. Stub: Returns predetermined values**

```typescript
const userRepoStub = {
  findById: () => Promise.resolve({ id: 1, name: 'John' })
};
```

**2. Mock: Verifies calls were made**

```typescript
const emailServiceMock = {
  send: jest.fn()
};

await userService.createUser('test@example.com');

expect(emailServiceMock.send).toHaveBeenCalledWith(
  'test@example.com',
  'Welcome!'
);
```

**3. Spy: Wraps real implementation to track calls**

```typescript
const logger = new Logger();
const logSpy = jest.spyOn(logger, 'info');

service.doSomething();

expect(logSpy).toHaveBeenCalledWith('Action completed');
logSpy.mockRestore();
```

### Python Mocking

```python
from unittest.mock import Mock, patch

# Mock object
def test_sends_welcome_email():
    email_service = Mock()
    user_service = UserService(email_service)

    user_service.create_user('test@example.com')

    email_service.send.assert_called_once_with(
        'test@example.com',
        'Welcome!'
    )

# Patch external dependencies
@patch('app.services.requests.get')
def test_fetches_user_from_api(mock_get):
    mock_get.return_value.json.return_value = {'name': 'John'}

    user = fetch_user_from_api(123)

    assert user.name == 'John'
    mock_get.assert_called_once_with('https://api.example.com/users/123')
```

## TDD for Different Scenarios

### 1. TDD for Algorithms

**Example: FizzBuzz**

```typescript
// Test 1: Numbers divisible by 3
test('returns Fizz for numbers divisible by 3', () => {
  expect(fizzBuzz(3)).toBe('Fizz');
  expect(fizzBuzz(6)).toBe('Fizz');
  expect(fizzBuzz(9)).toBe('Fizz');
});

// Test 2: Numbers divisible by 5
test('returns Buzz for numbers divisible by 5', () => {
  expect(fizzBuzz(5)).toBe('Buzz');
  expect(fizzBuzz(10)).toBe('Buzz');
});

// Test 3: Numbers divisible by both
test('returns FizzBuzz for numbers divisible by both 3 and 5', () => {
  expect(fizzBuzz(15)).toBe('FizzBuzz');
  expect(fizzBuzz(30)).toBe('FizzBuzz');
});

// Test 4: Regular numbers
test('returns the number as string for other numbers', () => {
  expect(fizzBuzz(1)).toBe('1');
  expect(fizzBuzz(2)).toBe('2');
  expect(fizzBuzz(4)).toBe('4');
});

// Implementation
function fizzBuzz(n: number): string {
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return n.toString();
}
```

### 2. TDD for APIs

```typescript
// Test HTTP endpoints using supertest
import request from 'supertest';
import { app } from './app';

describe('POST /users', () => {
  test('creates user with valid data', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'Password123',
        name: 'John Doe'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      email: 'test@example.com',
      name: 'John Doe'
    });
    expect(response.body.id).toBeDefined();
    expect(response.body.password).toBeUndefined(); // Never return password
  });

  test('returns 400 when email is invalid', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'invalid-email',
        password: 'Password123',
        name: 'John Doe'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/invalid email/i);
  });

  test('returns 409 when email already exists', async () => {
    // Create first user
    await request(app).post('/users').send({
      email: 'test@example.com',
      password: 'Password123',
      name: 'John Doe'
    });

    // Try to create duplicate
    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'Password456',
        name: 'Jane Doe'
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/already exists/i);
  });
});
```

**Python FastAPI Example:**

```python
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_create_user_with_valid_data():
    response = client.post('/users', json={
        'email': 'test@example.com',
        'password': 'Password123',
        'name': 'John Doe'
    })

    assert response.status_code == 201
    data = response.json()
    assert data['email'] == 'test@example.com'
    assert data['name'] == 'John Doe'
    assert 'id' in data
    assert 'password' not in data

def test_returns_400_when_email_invalid():
    response = client.post('/users', json={
        'email': 'invalid-email',
        'password': 'Password123',
        'name': 'John Doe'
    })

    assert response.status_code == 400
    assert 'invalid email' in response.json()['error'].lower()
```

### 3. TDD for UI Components

```typescript
// React component TDD with Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  test('renders email and password fields', () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('calls onSubmit with email and password when submitted', () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  test('shows error message when email is invalid', () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.blur(screen.getByLabelText(/email/i));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  test('disables submit button when form is invalid', () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /log in/i });

    expect(submitButton).toBeDisabled();

    // Fill valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    expect(submitButton).toBeEnabled();
  });
});

// Implementation would be written after tests
```

## Complete TDD Session: Shopping Cart

Let's build a shopping cart from scratch using TDD.

**Iteration 1: Create empty cart**

```typescript
// RED
test('creates empty cart', () => {
  const cart = new ShoppingCart();
  expect(cart.getItemCount()).toBe(0);
  expect(cart.getTotal()).toBe(0);
});

// GREEN
class ShoppingCart {
  getItemCount(): number {
    return 0;
  }

  getTotal(): number {
    return 0;
  }
}
```

**Iteration 2: Add item to cart**

```typescript
// RED
test('adds item to cart', () => {
  const cart = new ShoppingCart();
  cart.addItem('apple', 1.5, 2);

  expect(cart.getItemCount()).toBe(1);
  expect(cart.getTotal()).toBe(3.0);
});

// GREEN
interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

class ShoppingCart {
  private items: CartItem[] = [];

  addItem(name: string, price: number, quantity: number): void {
    this.items.push({ name, price, quantity });
  }

  getItemCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
```

**Iteration 3: Add same item increases quantity**

```typescript
// RED
test('increases quantity when adding same item', () => {
  const cart = new ShoppingCart();
  cart.addItem('apple', 1.5, 2);
  cart.addItem('apple', 1.5, 3);

  expect(cart.getItemCount()).toBe(1); // Still one unique item
  expect(cart.getTotal()).toBe(7.5); // 5 apples * 1.5
});

// GREEN - refactor addItem
class ShoppingCart {
  private items: Map<string, CartItem> = new Map();

  addItem(name: string, price: number, quantity: number): void {
    const existing = this.items.get(name);

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.set(name, { name, price, quantity });
    }
  }

  getItemCount(): number {
    return this.items.size;
  }

  getTotal(): number {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.price * item.quantity;
    }
    return total;
  }
}
```

**Iteration 4: Remove item from cart**

```typescript
// RED
test('removes item from cart', () => {
  const cart = new ShoppingCart();
  cart.addItem('apple', 1.5, 2);
  cart.addItem('banana', 2.0, 1);

  cart.removeItem('apple');

  expect(cart.getItemCount()).toBe(1);
  expect(cart.getTotal()).toBe(2.0);
});

// GREEN
class ShoppingCart {
  // ... previous code ...

  removeItem(name: string): void {
    this.items.delete(name);
  }
}
```

**Iteration 5: Apply discount**

```typescript
// RED
test('applies percentage discount to total', () => {
  const cart = new ShoppingCart();
  cart.addItem('apple', 10.0, 2);

  cart.applyDiscount(0.1); // 10% discount

  expect(cart.getTotal()).toBe(18.0); // 20 - 2
});

// GREEN
class ShoppingCart {
  private items: Map<string, CartItem> = new Map();
  private discountRate: number = 0;

  applyDiscount(rate: number): void {
    if (rate < 0 || rate > 1) {
      throw new Error('Discount rate must be between 0 and 1');
    }
    this.discountRate = rate;
  }

  getTotal(): number {
    let subtotal = 0;
    for (const item of this.items.values()) {
      subtotal += item.price * item.quantity;
    }
    return subtotal * (1 - this.discountRate);
  }

  // ... rest of the code ...
}
```

**Python Complete Shopping Cart:**

```python
from typing import Dict

class CartItem:
    def __init__(self, name: str, price: float, quantity: int):
        self.name = name
        self.price = price
        self.quantity = quantity

class ShoppingCart:
    def __init__(self):
        self._items: Dict[str, CartItem] = {}
        self._discount_rate: float = 0

    def add_item(self, name: str, price: float, quantity: int) -> None:
        if name in self._items:
            self._items[name].quantity += quantity
        else:
            self._items[name] = CartItem(name, price, quantity)

    def remove_item(self, name: str) -> None:
        if name in self._items:
            del self._items[name]

    def apply_discount(self, rate: float) -> None:
        if not 0 <= rate <= 1:
            raise ValueError("Discount rate must be between 0 and 1")
        self._discount_rate = rate

    def get_item_count(self) -> int:
        return len(self._items)

    def get_total(self) -> float:
        subtotal = sum(
            item.price * item.quantity
            for item in self._items.values()
        )
        return subtotal * (1 - self._discount_rate)

# Tests
def test_creates_empty_cart():
    cart = ShoppingCart()
    assert cart.get_item_count() == 0
    assert cart.get_total() == 0

def test_adds_item_to_cart():
    cart = ShoppingCart()
    cart.add_item('apple', 1.5, 2)
    assert cart.get_item_count() == 1
    assert cart.get_total() == 3.0

def test_increases_quantity_when_adding_same_item():
    cart = ShoppingCart()
    cart.add_item('apple', 1.5, 2)
    cart.add_item('apple', 1.5, 3)
    assert cart.get_item_count() == 1
    assert cart.get_total() == 7.5

def test_removes_item_from_cart():
    cart = ShoppingCart()
    cart.add_item('apple', 1.5, 2)
    cart.add_item('banana', 2.0, 1)
    cart.remove_item('apple')
    assert cart.get_item_count() == 1
    assert cart.get_total() == 2.0

def test_applies_discount():
    cart = ShoppingCart()
    cart.add_item('apple', 10.0, 2)
    cart.apply_discount(0.1)
    assert cart.get_total() == 18.0
```

## Common TDD Misconceptions

### Misconception 1: "TDD means 100% test coverage"

**Reality**: TDD naturally leads to high coverage, but the goal is testable, working code, not coverage numbers.

### Misconception 2: "TDD is slower"

**Reality**: TDD might feel slower initially, but it's faster overall because:
- Less debugging time
- Fewer bugs reaching production
- Easier refactoring
- Better design from the start

### Misconception 3: "Write all tests first, then implement"

**Reality**: TDD is incremental. Write one test, make it pass, refactor, repeat.

### Misconception 4: "TDD means no debugging"

**Reality**: You'll still debug, but less frequently and more efficiently because:
- Tests pinpoint exactly what broke
- You catch bugs immediately
- Regression tests prevent repeat issues

### Misconception 5: "TDD works for everything"

**Reality**: TDD works best for:
- Business logic
- Algorithms
- Data transformations
- APIs

It's less effective for:
- Visual design
- Performance optimization
- Exploratory coding

## Common TDD Pitfalls

### 1. Testing Implementation Instead of Behavior

```typescript
// ❌ Bad: Tests implementation details
test('uses array to store items', () => {
  const cart = new ShoppingCart();
  expect(cart.items).toBeInstanceOf(Array);
});

// ✅ Good: Tests behavior
test('stores items added to cart', () => {
  const cart = new ShoppingCart();
  cart.addItem('apple', 1.5, 2);
  expect(cart.getItemCount()).toBe(1);
});
```

### 2. Writing Tests That Are Too Large

```typescript
// ❌ Bad: One giant test
test('shopping cart', () => {
  const cart = new ShoppingCart();
  cart.addItem('apple', 1.5, 2);
  expect(cart.getTotal()).toBe(3.0);
  cart.addItem('banana', 2.0, 1);
  expect(cart.getTotal()).toBe(5.0);
  cart.removeItem('apple');
  expect(cart.getTotal()).toBe(2.0);
  cart.applyDiscount(0.1);
  expect(cart.getTotal()).toBe(1.8);
  // Too many behaviors in one test!
});

// ✅ Good: Separate tests for each behavior
test('calculates total for multiple items', () => { /* ... */ });
test('updates total when item removed', () => { /* ... */ });
test('applies discount to total', () => { /* ... */ });
```

### 3. Skipping the Refactor Step

```typescript
// After making tests pass, don't forget to refactor!

// Before refactoring
function calculateTotal(items: CartItem[]): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}

// After refactoring (tests still pass)
function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}
```

### 4. Not Running Tests Frequently

```
✅ Run tests after EVERY code change
✅ All tests should pass before moving to next test
✅ If a test fails, fix it immediately
```

## TDD Best Practices

1. **Write the smallest test possible**: Test one thing at a time
2. **Write the simplest code to pass**: Don't over-engineer
3. **Refactor with confidence**: Tests protect you
4. **Keep tests fast**: Slow tests discourage running them
5. **Make tests independent**: Order shouldn't matter
6. **Use descriptive test names**: Tests are documentation
7. **Follow the cycle strictly**: Red → Green → Refactor
8. **Don't skip tests because "it's easy"**: Simple code can have bugs too

## TDD Workflow Checklist

- [ ] Write a failing test (RED)
- [ ] Run test to see it fail (confirms test works)
- [ ] Write minimal code to pass (GREEN)
- [ ] Run test to see it pass
- [ ] Refactor if needed (REFACTOR)
- [ ] Run all tests to ensure nothing broke
- [ ] Commit changes
- [ ] Repeat for next piece of functionality

## Tools and Frameworks

### TypeScript/JavaScript
- **Jest**: Full-featured testing framework
- **Vitest**: Fast, modern alternative to Jest
- **Mocha + Chai**: Flexible combination
- **Supertest**: API testing
- **Testing Library**: React/Vue/Angular component testing

### Python
- **Pytest**: Modern, feature-rich testing framework
- **unittest**: Built-in testing framework
- **pytest-asyncio**: Async test support
- **pytest-mock**: Mocking utilities
- **httpx**: Async HTTP client for API testing

## References

- **Test Driven Development: By Example** by Kent Beck (2002) - The TDD classic
- **Growing Object-Oriented Software, Guided by Tests** by Steve Freeman & Nat Pryce
- **The Art of Unit Testing** by Roy Osherove
- [Martin Fowler on TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Uncle Bob's Three Rules of TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)
- [Jest Documentation](https://jestjs.io/)
- [Pytest Documentation](https://docs.pytest.org/)
