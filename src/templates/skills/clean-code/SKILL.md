---
name: Clean Code Principles
description: Comprehensive guide to Clean Code principles by Robert C. Martin covering meaningful names, function design, comments, formatting, error handling, and essential principles (DRY, KISS, YAGNI).
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - clean-code
  - refactoring
  - best-practices
  - code-quality
  - maintainability
  - readability
---

# Clean Code Principles Skill

This skill provides comprehensive guidance on writing clean, maintainable code based on Robert C. Martin's (Uncle Bob) Clean Code principles. Includes practical examples, before/after refactoring patterns, and anti-patterns to avoid.

## When to Use

- Writing new code from scratch
- Refactoring existing codebases
- Code review processes
- Mentoring junior developers
- Improving code readability and maintainability
- Reducing technical debt
- Establishing team coding standards

## What is Clean Code?

Clean code is code that is:
- **Readable**: Easy to understand by humans
- **Simple**: Does one thing well
- **Maintainable**: Easy to modify and extend
- **Tested**: Has comprehensive test coverage
- **Minimal**: Contains no unnecessary complexity

> "Clean code always looks like it was written by someone who cares." - Robert C. Martin

---

## 1. Meaningful Names

### Principle

Names should reveal intent, be pronounceable, searchable, and avoid mental mapping.

### Use Intention-Revealing Names

```typescript
// ❌ BAD: Unclear, requires comments
let d: number; // elapsed time in days
let data: any[];
let list1: string[];

function get(): any[] {
  // What does this get?
}

// ✅ GOOD: Self-documenting
let elapsedTimeInDays: number;
let customers: Customer[];
let activeUsers: User[];

function getActiveCustomers(): Customer[] {
  return customers.filter(c => c.isActive);
}
```

### Avoid Disinformation

```typescript
// ❌ BAD: Misleading names
let accountList: Set<Account>; // It's a Set, not a List!
let hp: number; // Hypotenuse? Hit points? HorsePower?
let theCustomer: Customer; // 'the' adds no value
let customerInfo: any; // 'Info' is vague
let customerData: any; // 'Data' is vague

// ✅ GOOD: Accurate names
let accounts: Set<Account>;
let hypotenuse: number;
let customer: Customer;
let customerAddress: Address;
let customerProfile: CustomerProfile;
```

### Make Meaningful Distinctions

```typescript
// ❌ BAD: Number series, noise words
function copyChars(a1: char[], a2: char[]): void {}

class ProductInfo {}
class ProductData {}
// What's the difference between Info and Data?

let nameString: string; // String is obvious from type
let customerObject: Customer; // Object is noise

// ✅ GOOD: Distinct, meaningful names
function copyChars(source: char[], destination: char[]): void {}

class Product {} // Domain entity
class ProductViewModel {} // Presentation layer
class ProductDTO {} // Data transfer

let name: string;
let customer: Customer;
```

### Use Pronounceable Names

```typescript
// ❌ BAD: Unpronounceable
class DtaRcrd102 {
  private genymdhms: Date;
  private modymdhms: Date;
  private pszqint: string = '102';
}

// ✅ GOOD: Pronounceable
class Customer {
  private generatedTimestamp: Date;
  private modifiedTimestamp: Date;
  private recordId: string = '102';
}
```

### Use Searchable Names

```typescript
// ❌ BAD: Magic numbers, single-letter names
for (let i = 0; i < 7; i++) {
  sum += t[i] * 4;
}

if (s === 4) {
  // What is 4?
}

// ✅ GOOD: Named constants, descriptive variables
const DAYS_IN_WEEK = 7;
const WORK_HOURS_PER_DAY = 4;

for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex++) {
  sum += timesheet[dayIndex] * WORK_HOURS_PER_DAY;
}

const STATUS_COMPLETED = 4;
if (status === STATUS_COMPLETED) {
  // Clear what we're checking
}
```

### Class Names and Method Names

```typescript
// ❌ BAD: Verbs for classes, nouns for methods
class Manage {} // Verb - too vague
class Process {} // Verb - too vague
class Data {} // Noun - too generic

interface Customer {
  name: string; // Method should be verb
  age: number;
}

// ✅ GOOD: Nouns for classes, verbs for methods
class CustomerManager {}
class OrderProcessor {}
class UserRepository {}

interface Customer {
  getName(): string;
  getAge(): number;
  setName(name: string): void;
  isActive(): boolean;
}
```

### Python Examples

```python
# ❌ BAD: Poor naming
def calc(a, b, c):
    return a * b + c

lst = []
for i in range(10):
    if i % 2 == 0:
        lst.append(i)

# ✅ GOOD: Clear naming
def calculate_total_price(unit_price: float, quantity: int, tax: float) -> float:
    """Calculate total price including tax."""
    return unit_price * quantity + tax

even_numbers = []
for number in range(10):
    if number % 2 == 0:
        even_numbers.append(number)

# Even better with list comprehension
even_numbers = [number for number in range(10) if number % 2 == 0]
```

---

## 2. Functions

### Principle

Functions should be small, do one thing, and do it well.

### Small Functions

```typescript
// ❌ BAD: Large function doing many things
function processOrder(order: Order): void {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Order has no items');
  }
  for (const item of order.items) {
    if (item.quantity <= 0) {
      throw new Error('Invalid quantity');
    }
    if (item.price < 0) {
      throw new Error('Invalid price');
    }
  }

  // Calculate total
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Apply discount
  let discount = 0;
  if (order.customer.isPremium) {
    discount = total * 0.15;
  } else if (order.customer.loyaltyPoints > 100) {
    discount = total * 0.1;
  }

  // Process payment
  const finalAmount = total - discount;
  const paymentGateway = new PaymentGateway();
  paymentGateway.connect();
  const result = paymentGateway.charge(finalAmount, order.paymentMethod);
  if (!result.success) {
    throw new Error('Payment failed');
  }
  paymentGateway.disconnect();

  // Save to database
  const db = new Database();
  db.connect();
  db.save('orders', order);
  db.disconnect();

  // Send confirmation
  const emailService = new EmailService();
  emailService.send(
    order.customer.email,
    'Order Confirmation',
    `Your order #${order.id} has been confirmed`
  );
}

// ✅ GOOD: Small, focused functions
function processOrder(order: Order): void {
  validateOrder(order);
  const total = calculateTotal(order);
  const discount = calculateDiscount(order, total);
  const finalAmount = total - discount;
  processPayment(finalAmount, order.paymentMethod);
  saveOrder(order);
  sendConfirmation(order);
}

function validateOrder(order: Order): void {
  if (!order.items || order.items.length === 0) {
    throw new Error('Order has no items');
  }

  order.items.forEach(validateOrderItem);
}

function validateOrderItem(item: OrderItem): void {
  if (item.quantity <= 0) {
    throw new Error('Invalid quantity');
  }
  if (item.price < 0) {
    throw new Error('Invalid price');
  }
}

function calculateTotal(order: Order): number {
  const subtotal = calculateSubtotal(order);
  const tax = calculateTax(subtotal);
  return subtotal + tax;
}

function calculateSubtotal(order: Order): number {
  return order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
}

function calculateTax(subtotal: number): number {
  const TAX_RATE = 0.1;
  return subtotal * TAX_RATE;
}

function calculateDiscount(order: Order, total: number): number {
  if (order.customer.isPremium) {
    return total * 0.15;
  }
  if (order.customer.loyaltyPoints > 100) {
    return total * 0.1;
  }
  return 0;
}

function processPayment(amount: number, paymentMethod: PaymentMethod): void {
  const gateway = new PaymentGateway();
  gateway.connect();

  try {
    const result = gateway.charge(amount, paymentMethod);
    if (!result.success) {
      throw new Error('Payment failed');
    }
  } finally {
    gateway.disconnect();
  }
}

function saveOrder(order: Order): void {
  const db = new Database();
  db.connect();

  try {
    db.save('orders', order);
  } finally {
    db.disconnect();
  }
}

function sendConfirmation(order: Order): void {
  const emailService = new EmailService();
  emailService.send(
    order.customer.email,
    'Order Confirmation',
    `Your order #${order.id} has been confirmed`
  );
}
```

### Do One Thing

```typescript
// ❌ BAD: Function does multiple things
function saveCustomerAndSendEmail(customer: Customer): void {
  // Thing 1: Save customer
  database.save(customer);

  // Thing 2: Send email
  emailService.send(customer.email, 'Welcome', 'Welcome to our service!');

  // Thing 3: Log action
  logger.log(`Customer ${customer.id} registered`);
}

// ✅ GOOD: Separate concerns
function registerCustomer(customer: Customer): void {
  saveCustomer(customer);
  sendWelcomeEmail(customer);
  logRegistration(customer);
}

function saveCustomer(customer: Customer): void {
  database.save(customer);
}

function sendWelcomeEmail(customer: Customer): void {
  emailService.send(
    customer.email,
    'Welcome',
    'Welcome to our service!'
  );
}

function logRegistration(customer: Customer): void {
  logger.log(`Customer ${customer.id} registered`);
}
```

### Function Arguments

```typescript
// ❌ BAD: Too many arguments
function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  age: number,
  address: string,
  city: string,
  country: string,
  phone: string,
  role: string
): User {
  // Hard to remember order, easy to make mistakes
}

// ✅ GOOD: Use objects for multiple parameters
interface CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  role: string;
}

function createUser(params: CreateUserParams): User {
  // Clear, self-documenting, order doesn't matter
  return new User(params);
}

// Usage
const user = createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'secure123',
  age: 30,
  address: '123 Main St',
  city: 'New York',
  country: 'USA',
  phone: '555-1234',
  role: 'admin'
});
```

### Avoid Flag Arguments

```typescript
// ❌ BAD: Boolean flags indicate multiple responsibilities
function renderPage(isAdmin: boolean): void {
  if (isAdmin) {
    renderAdminPage();
  } else {
    renderUserPage();
  }
}

function saveUser(user: User, validate: boolean): void {
  if (validate) {
    validateUser(user);
  }
  database.save(user);
}

// ✅ GOOD: Separate functions
function renderAdminPage(): void {
  // Render admin interface
}

function renderUserPage(): void {
  // Render user interface
}

function saveUser(user: User): void {
  database.save(user);
}

function saveValidatedUser(user: User): void {
  validateUser(user);
  saveUser(user);
}
```

### Python Examples

```python
# ❌ BAD: Large, complex function
def process_data(data):
    result = []
    for item in data:
        if item['type'] == 'A':
            value = item['value'] * 2
        elif item['type'] == 'B':
            value = item['value'] * 3
        else:
            value = item['value']

        if value > 100:
            value = 100

        result.append({
            'id': item['id'],
            'processed_value': value,
            'timestamp': datetime.now()
        })
    return result

# ✅ GOOD: Small, focused functions
def process_data(data: List[Dict]) -> List[Dict]:
    """Process list of data items."""
    return [process_item(item) for item in data]

def process_item(item: Dict) -> Dict:
    """Process a single data item."""
    value = calculate_value(item)
    value = cap_value(value)
    return create_result(item['id'], value)

def calculate_value(item: Dict) -> float:
    """Calculate value based on item type."""
    multipliers = {'A': 2, 'B': 3}
    multiplier = multipliers.get(item['type'], 1)
    return item['value'] * multiplier

def cap_value(value: float, max_value: float = 100) -> float:
    """Cap value at maximum."""
    return min(value, max_value)

def create_result(item_id: str, value: float) -> Dict:
    """Create result dictionary."""
    return {
        'id': item_id,
        'processed_value': value,
        'timestamp': datetime.now()
    }
```

---

## 3. Comments

### Principle

Comments should explain WHY, not WHAT. Good code is self-documenting.

### Good Comments

```typescript
// ✅ GOOD: Legal comments
/*
 * Copyright (C) 2024 Company Name
 * Licensed under the MIT License
 */

// ✅ GOOD: Explanation of intent
// We're using a binary search here because the list is always sorted
// and can contain millions of entries. Linear search would be too slow.
const index = binarySearch(sortedList, target);

// ✅ GOOD: Warning of consequences
// DO NOT remove this sleep - the API rate limits to 100 requests/minute
await sleep(600);

// ✅ GOOD: TODO comments
// TODO: Refactor this to use the new payment gateway API (v2)
// See ticket: JIRA-1234
function processPayment() {}

// ✅ GOOD: Amplification
// The trim is critical here - whitespace causes the API to fail
const username = input.trim();

// ✅ GOOD: Documentation for public APIs
/**
 * Calculates the compound interest.
 *
 * @param principal - Initial investment amount
 * @param rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param years - Investment duration in years
 * @returns Final amount including interest
 *
 * @example
 * ```ts
 * const amount = calculateCompoundInterest(1000, 0.05, 10);
 * // Returns 1628.89
 * ```
 */
function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number
): number {
  return principal * Math.pow(1 + rate, years);
}
```

### Bad Comments

```typescript
// ❌ BAD: Redundant comments that just repeat the code
// Set the name
user.name = 'John';

// Increment i
i++;

// Check if user is admin
if (user.role === 'admin') {
  // Grant access
  grantAccess();
}

// ❌ BAD: Misleading comments
// Check if user has permission
// (But actually checks if user is admin - different thing!)
if (user.role === 'admin') {}

// ❌ BAD: Commented-out code
function processOrder(order: Order): void {
  validateOrder(order);
  // const discount = calculateDiscount(order);
  // const tax = calculateTax(order);
  const total = calculateTotal(order);
  // sendEmail(order.customer);
}

// ❌ BAD: Noise comments
/** The name */
private name: string;

/** Constructor */
constructor() {}

/** Default constructor */
constructor() {}

// ❌ BAD: Journal comments (use version control)
/**
 * Changes:
 * 2024-01-15: Added validation
 * 2024-01-20: Fixed bug with email
 * 2024-02-01: Refactored for performance
 */

// ❌ BAD: Position markers
// =============================================
// Public Methods
// =============================================

//////// Getters and Setters ////////

// ❌ BAD: Closing brace comments (function too long!)
function longFunction() {
  if (condition) {
    for (let i = 0; i < 10; i++) {
      if (anotherCondition) {
        // 100 lines of code
      } // end if anotherCondition
    } // end for
  } // end if condition
} // end function longFunction
```

### Replace Comments with Code

```typescript
// ❌ BAD: Comment explaining complex logic
// Check if employee is eligible for full benefits
if ((employee.flags & HOURLY_FLAG) && (employee.age > 65)) {}

// ✅ GOOD: Extract to well-named function
if (employee.isEligibleForFullBenefits()) {}

// ❌ BAD: Comment block explaining variables
// temp is used to store the current temperature in Celsius
// max is the maximum allowed temperature
// min is the minimum allowed temperature
const temp = sensor.readTemperature();
const max = 100;
const min = -50;

// ✅ GOOD: Self-documenting variable names
const currentTemperatureInCelsius = sensor.readTemperature();
const maxAllowedTemperature = 100;
const minAllowedTemperature = -50;
```

### Python Examples

```python
# ❌ BAD: Obvious comments
# Iterate through users
for user in users:
    # Print user name
    print(user.name)

# ❌ BAD: Commented-out code
def calculate_price(item):
    base_price = item.price
    # tax = base_price * 0.1
    # discount = base_price * 0.05
    return base_price

# ✅ GOOD: Explanation of WHY
def fetch_user_data(user_id: str) -> Dict:
    """
    Fetch user data from cache first, then database.

    We check the cache first because database queries are 100x slower
    and user data changes infrequently (cached for 1 hour).
    """
    cached_data = cache.get(f"user:{user_id}")
    if cached_data:
        return cached_data

    user_data = database.query(f"SELECT * FROM users WHERE id = {user_id}")
    cache.set(f"user:{user_id}", user_data, ttl=3600)
    return user_data

# ✅ GOOD: Warning about non-obvious behavior
def delete_user(user_id: str) -> None:
    """
    Delete user and all related data.

    WARNING: This is a hard delete. User data cannot be recovered.
    Consider using soft delete (user.is_active = False) instead
    to maintain referential integrity.
    """
    database.execute(f"DELETE FROM users WHERE id = {user_id}")
```

---

## 4. Formatting

### Principle

Code formatting should be consistent, reveal structure, and enhance readability.

### Vertical Formatting

```typescript
// ✅ GOOD: Newspaper metaphor - most important at top
class UserService {
  // High-level public interface first
  async registerUser(email: string, password: string): Promise<User> {
    const validated = await this.validateCredentials(email, password);
    const user = await this.createUser(validated);
    await this.sendWelcomeEmail(user);
    return user;
  }

  async loginUser(email: string, password: string): Promise<LoginResult> {
    const user = await this.findUser(email);
    const valid = await this.verifyPassword(user, password);
    return this.generateSession(user);
  }

  // Lower-level private helpers below
  private async validateCredentials(
    email: string,
    password: string
  ): Promise<ValidatedCredentials> {
    // Validation logic
  }

  private async createUser(credentials: ValidatedCredentials): Promise<User> {
    // User creation logic
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    // Email logic
  }

  private async findUser(email: string): Promise<User> {
    // Database query
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    // Password verification
  }

  private generateSession(user: User): LoginResult {
    // Session generation
  }
}
```

### Vertical Openness

```typescript
// ❌ BAD: No separation between concepts
function calculateOrderTotal(order: Order): number {
  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const shipping = order.items.length > 5 ? 0 : 10;
  const discount = order.customer.isPremium ? subtotal * 0.1 : 0;
  return subtotal + tax + shipping - discount;
}

// ✅ GOOD: Blank lines separate concepts
function calculateOrderTotal(order: Order): number {
  // Calculate base amounts
  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
  const tax = calculateTax(subtotal);

  // Calculate additional fees
  const shipping = calculateShipping(order);

  // Calculate discounts
  const discount = calculateDiscount(order, subtotal);

  // Return final total
  return subtotal + tax + shipping - discount;
}
```

### Horizontal Formatting

```typescript
// ❌ BAD: Too long, forces horizontal scrolling
function createUser(firstName: string, lastName: string, email: string, password: string, age: number, address: string, city: string, state: string, zipCode: string, country: string, phoneNumber: string, role: string, permissions: string[], createdBy: string, createdAt: Date): User {
  return new User(firstName, lastName, email, password, age, address, city, state, zipCode, country, phoneNumber, role, permissions, createdBy, createdAt);
}

// ✅ GOOD: Break long lines
function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  age: number,
  address: string,
  city: string,
  state: string,
  zipCode: string,
  country: string,
  phoneNumber: string,
  role: string,
  permissions: string[],
  createdBy: string,
  createdAt: Date
): User {
  return new User(
    firstName,
    lastName,
    email,
    password,
    age,
    address,
    city,
    state,
    zipCode,
    country,
    phoneNumber,
    role,
    permissions,
    createdBy,
    createdAt
  );
}

// ✅ EVEN BETTER: Use parameter object
interface CreateUserParams {
  personalInfo: {
    firstName: string;
    lastName: string;
    age: number;
  };
  contactInfo: {
    email: string;
    phoneNumber: string;
    address: Address;
  };
  credentials: {
    password: string;
  };
  authorization: {
    role: string;
    permissions: string[];
  };
  metadata: {
    createdBy: string;
    createdAt: Date;
  };
}

function createUser(params: CreateUserParams): User {
  return new User(params);
}
```

### Indentation

```python
# ❌ BAD: Inconsistent indentation
def process_order(order):
  if order.items:
      for item in order.items:
        if item.quantity > 0:
            total = item.price * item.quantity
              if total > 100:
              apply_discount(item)

# ✅ GOOD: Consistent indentation (4 spaces in Python)
def process_order(order: Order) -> None:
    if not order.items:
        return

    for item in order.items:
        if item.quantity > 0:
            total = item.price * item.quantity
            if total > 100:
                apply_discount(item)
```

### Team Rules

```typescript
// Establish and follow team conventions
// Example: .prettierrc configuration
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}

// Use automated formatting tools
// - Prettier for JavaScript/TypeScript
// - Black for Python
// - gofmt for Go
// - rustfmt for Rust
```

---

## 5. Error Handling

### Principle

Error handling should not obscure logic. Use exceptions over error codes.

### Use Exceptions

```typescript
// ❌ BAD: Error codes obscure logic
function saveUser(user: User): number {
  if (!user.email) {
    return -1; // What does -1 mean?
  }

  if (!validateEmail(user.email)) {
    return -2; // What does -2 mean?
  }

  const result = database.save(user);
  if (result === 0) {
    return -3; // Database error
  }

  return 1; // Success?
}

// Caller has to remember error codes
const result = saveUser(user);
if (result === -1) {
  console.log('Missing email');
} else if (result === -2) {
  console.log('Invalid email');
} else if (result === -3) {
  console.log('Database error');
}

// ✅ GOOD: Exceptions separate error handling from logic
function saveUser(user: User): void {
  validateUser(user);
  database.save(user);
}

function validateUser(user: User): void {
  if (!user.email) {
    throw new ValidationError('Email is required');
  }

  if (!validateEmail(user.email)) {
    throw new ValidationError('Email format is invalid');
  }
}

// Clean, readable error handling
try {
  saveUser(user);
  console.log('User saved successfully');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed: ${error.message}`);
  } else if (error instanceof DatabaseError) {
    console.log(`Database error: ${error.message}`);
  } else {
    console.log('Unexpected error occurred');
  }
}
```

### Provide Context with Exceptions

```typescript
// ❌ BAD: Generic error with no context
class OrderService {
  processOrder(orderId: string): void {
    const order = this.getOrder(orderId);
    if (!order) {
      throw new Error('Not found');
    }
  }
}

// ✅ GOOD: Specific errors with context
class OrderService {
  processOrder(orderId: string): void {
    const order = this.getOrder(orderId);
    if (!order) {
      throw new OrderNotFoundError(
        `Order with ID ${orderId} was not found`,
        { orderId }
      );
    }
  }
}

class OrderNotFoundError extends Error {
  constructor(message: string, public context: { orderId: string }) {
    super(message);
    this.name = 'OrderNotFoundError';
  }
}
```

### Don't Return Null

```typescript
// ❌ BAD: Returning null forces null checks everywhere
function getUser(id: string): User | null {
  const user = database.findUser(id);
  return user || null;
}

// Caller forced to check for null
const user = getUser('123');
if (user !== null) {
  console.log(user.name); // Have to check every time
}

// ✅ GOOD: Throw exception or use Optional/Maybe pattern
function getUser(id: string): User {
  const user = database.findUser(id);
  if (!user) {
    throw new UserNotFoundError(`User ${id} not found`);
  }
  return user;
}

// Or use Optional pattern
function findUser(id: string): Optional<User> {
  const user = database.findUser(id);
  return Optional.ofNullable(user);
}

// Clean usage
const user = findUser('123')
  .orElseThrow(() => new UserNotFoundError('User not found'));

const userName = findUser('123')
  .map(u => u.name)
  .orElse('Anonymous');
```

### Don't Pass Null

```typescript
// ❌ BAD: Accepting null requires defensive checks
function calculateTotal(items: OrderItem[] | null): number {
  if (!items) {
    return 0; // What if null was a mistake?
  }

  return items.reduce((sum, item) => {
    // Still need to check item isn't null!
    if (!item) {
      return sum;
    }
    return sum + item.price;
  }, 0);
}

// ✅ GOOD: Don't accept null
function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// If empty is valid, use empty array
const total = calculateTotal(order.items || []);
```

### Python Examples

```python
# ❌ BAD: Silently catching and ignoring errors
def load_config():
    try:
        with open('config.json') as f:
            return json.load(f)
    except:
        return {}  # Hides real errors!

# ✅ GOOD: Specific exception handling
def load_config() -> Dict:
    """Load configuration from file."""
    try:
        with open('config.json') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning("Config file not found, using defaults")
        return get_default_config()
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in config file: {e}")
        raise ConfigurationError(f"Failed to parse config: {e}") from e
    except PermissionError:
        logger.error("Permission denied reading config file")
        raise ConfigurationError("Cannot read config file - permission denied")

# ✅ GOOD: Custom exception with context
class ConfigurationError(Exception):
    """Raised when configuration is invalid or cannot be loaded."""
    def __init__(self, message: str, config_path: str = None):
        super().__init__(message)
        self.config_path = config_path

# ✅ GOOD: Context manager handles cleanup
class DatabaseConnection:
    def __enter__(self):
        self.conn = database.connect()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()  # Always closes, even if error occurs
        return False

# Clean usage
with DatabaseConnection() as conn:
    conn.execute("SELECT * FROM users")
    # Connection automatically closed
```

---

## 6. Core Principles

### DRY (Don't Repeat Yourself)

```typescript
// ❌ BAD: Repeated logic
function validateUsername(username: string): boolean {
  if (!username) return false;
  if (username.length < 3) return false;
  if (username.length > 20) return false;
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;
  return true;
}

function validatePassword(password: string): boolean {
  if (!password) return false;
  if (password.length < 8) return false;
  if (password.length > 50) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

function validateEmail(email: string): boolean {
  if (!email) return false;
  if (email.length < 5) return false;
  if (email.length > 100) return false;
  if (!/@/.test(email)) return false;
  return true;
}

// ✅ GOOD: Extract common validation logic
interface ValidationRule {
  check: (value: string) => boolean;
  message: string;
}

function validate(value: string, rules: ValidationRule[]): ValidationResult {
  for (const rule of rules) {
    if (!rule.check(value)) {
      return { valid: false, error: rule.message };
    }
  }
  return { valid: true };
}

const usernameRules: ValidationRule[] = [
  {
    check: (v) => v.length >= 3,
    message: 'Username must be at least 3 characters'
  },
  {
    check: (v) => v.length <= 20,
    message: 'Username must be at most 20 characters'
  },
  {
    check: (v) => /^[a-zA-Z0-9_]+$/.test(v),
    message: 'Username can only contain letters, numbers, and underscores'
  }
];

const passwordRules: ValidationRule[] = [
  {
    check: (v) => v.length >= 8,
    message: 'Password must be at least 8 characters'
  },
  {
    check: (v) => /[A-Z]/.test(v),
    message: 'Password must contain uppercase letter'
  },
  {
    check: (v) => /[a-z]/.test(v),
    message: 'Password must contain lowercase letter'
  },
  {
    check: (v) => /[0-9]/.test(v),
    message: 'Password must contain number'
  }
];

// Reusable validation
const usernameResult = validate(username, usernameRules);
const passwordResult = validate(password, passwordRules);
```

### KISS (Keep It Simple, Stupid)

```typescript
// ❌ BAD: Overly complex
function calculateDiscountedPrice(price: number, customer: Customer): number {
  return price * (1 - (
    customer.isPremium
      ? (customer.loyaltyYears > 5
        ? (customer.totalSpent > 10000 ? 0.25 : 0.20)
        : (customer.totalSpent > 5000 ? 0.15 : 0.10))
      : (customer.loyaltyYears > 3 ? 0.05 : 0)
  ));
}

// ✅ GOOD: Simple and clear
function calculateDiscountedPrice(price: number, customer: Customer): number {
  const discount = calculateDiscount(customer);
  return price * (1 - discount);
}

function calculateDiscount(customer: Customer): number {
  if (!customer.isPremium) {
    return customer.loyaltyYears > 3 ? 0.05 : 0;
  }

  if (customer.loyaltyYears > 5) {
    return customer.totalSpent > 10000 ? 0.25 : 0.20;
  }

  return customer.totalSpent > 5000 ? 0.15 : 0.10;
}
```

### YAGNI (You Aren't Gonna Need It)

```typescript
// ❌ BAD: Over-engineering for future requirements
class User {
  // Maybe we'll need these someday?
  private alternativeEmails: string[] = [];
  private previousAddresses: Address[] = [];
  private loginHistory: LoginRecord[] = [];
  private preferences: Map<string, any> = new Map();
  private customFields: Map<string, any> = new Map();
  private metadata: Map<string, any> = new Map();

  // Complex system for something we don't need yet
  async syncWithExternalSystems(): Promise<void> {}
  async exportToMultipleFormats(format: string): Promise<void> {}
  async scheduleAutomatedBackup(): Promise<void> {}
}

// ✅ GOOD: Only implement what's needed now
class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public createdAt: Date
  ) {}
}

// Add features when actually needed, not "just in case"
```

### Composition Over Inheritance

```typescript
// ❌ BAD: Deep inheritance hierarchy
class Animal {
  eat() {}
  sleep() {}
}

class Mammal extends Animal {
  breathe() {}
  giveBirth() {}
}

class Dog extends Mammal {
  bark() {}
  fetch() {}
}

class Poodle extends Dog {
  groom() {}
}

// What if we need a RobotDog? It can't inherit from Animal!

// ✅ GOOD: Composition
interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Barkable {
  bark(): void;
}

class Dog implements Eatable, Sleepable, Barkable {
  private eating: EatingBehavior;
  private sleeping: SleepingBehavior;
  private barking: BarkingBehavior;

  constructor() {
    this.eating = new MammalEating();
    this.sleeping = new MammalSleeping();
    this.barking = new DogBarking();
  }

  eat(): void {
    this.eating.eat();
  }

  sleep(): void {
    this.sleeping.sleep();
  }

  bark(): void {
    this.barking.bark();
  }
}

class RobotDog implements Barkable {
  private barking: BarkingBehavior;

  constructor() {
    this.barking = new ElectronicBarking();
  }

  bark(): void {
    this.barking.bark();
  }

  // No eating or sleeping - composition allows picking only what's needed
}
```

### Python Examples

```python
# DRY Principle
# ❌ BAD: Repeated database connection logic
def get_users():
    conn = psycopg2.connect("dbname=mydb user=postgres")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

def get_orders():
    conn = psycopg2.connect("dbname=mydb user=postgres")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

# ✅ GOOD: Extract common logic
class Database:
    def __init__(self, connection_string: str):
        self.connection_string = connection_string

    def query(self, sql: str) -> List[Tuple]:
        """Execute query and return results."""
        with psycopg2.connect(self.connection_string) as conn:
            with conn.cursor() as cursor:
                cursor.execute(sql)
                return cursor.fetchall()

db = Database("dbname=mydb user=postgres")
users = db.query("SELECT * FROM users")
orders = db.query("SELECT * FROM orders")

# KISS Principle
# ❌ BAD: Overly complex
def process(items):
    return [{'id': i['id'], 'value': i['value'] * 2 if i['type'] == 'A' else i['value'] * 3 if i['type'] == 'B' else i['value']} for i in items if i['value'] > 0]

# ✅ GOOD: Simple and readable
def process(items: List[Dict]) -> List[Dict]:
    """Process items based on type."""
    return [
        process_item(item)
        for item in items
        if is_valid_item(item)
    ]

def process_item(item: Dict) -> Dict:
    multiplier = get_multiplier(item['type'])
    return {
        'id': item['id'],
        'value': item['value'] * multiplier
    }

def get_multiplier(item_type: str) -> int:
    multipliers = {'A': 2, 'B': 3}
    return multipliers.get(item_type, 1)

def is_valid_item(item: Dict) -> bool:
    return item['value'] > 0
```

---

## Before/After Refactoring Examples

### Example 1: User Registration

```typescript
// ❌ BEFORE: Messy, hard to test, multiple responsibilities
class UserController {
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password too short' });
    }

    // Check if exists
    const db = new Database();
    await db.connect();
    const existing = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
    if (existing.length > 0) {
      await db.disconnect();
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(password, 10);

    // Save user
    await db.query(`INSERT INTO users (email, password, name) VALUES ('${email}', '${hash}', '${name}')`);
    await db.disconnect();

    // Send email
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail({
      to: email,
      subject: 'Welcome',
      text: `Welcome ${name}!`
    });

    return res.status(201).json({ message: 'User created' });
  }
}

// ✅ AFTER: Clean, testable, single responsibility
// Domain layer
interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

// Validation layer
class UserValidator {
  validate(data: CreateUserDTO): ValidationResult {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Email format is invalid');
    }

    if (!data.password) {
      errors.push('Password is required');
    } else if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!data.name) {
      errors.push('Name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// Repository layer
class UserRepository {
  constructor(private database: Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.database.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result[0] || null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const result = await this.database.query(
      `INSERT INTO users (email, password_hash, name, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user.email, user.passwordHash, user.name, user.createdAt]
    );
    return result[0];
  }
}

// Service layer
class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private emailService: EmailService,
    private validator: UserValidator
  ) {}

  async registerUser(dto: CreateUserDTO): Promise<User> {
    // Validate
    const validation = this.validator.validate(dto);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    // Check if exists
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    // Create user
    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      createdAt: new Date()
    });

    // Send welcome email (async, don't wait)
    this.emailService.sendWelcomeEmail(user).catch(error => {
      logger.error('Failed to send welcome email', { error, userId: user.id });
    });

    return user;
  }
}

// Controller layer
class UserController {
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(201).json({
        data: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ errors: error.errors });
      } else if (error instanceof ConflictError) {
        res.status(409).json({ error: error.message });
      } else {
        logger.error('Registration failed', { error });
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

// Easy to test each layer independently!
```

---

## Anti-Patterns to Avoid

### 1. Magic Numbers

```typescript
// ❌ BAD
if (user.age > 18 && user.accountBalance > 1000) {
  // What do 18 and 1000 mean?
}

// ✅ GOOD
const MINIMUM_AGE = 18;
const MINIMUM_BALANCE = 1000;

if (user.age > MINIMUM_AGE && user.accountBalance > MINIMUM_BALANCE) {
  // Clear and maintainable
}
```

### 2. Primitive Obsession

```typescript
// ❌ BAD: Using primitives for domain concepts
function sendEmail(to: string, subject: string, body: string): void {}

// Easy to mix up parameters
sendEmail('Welcome', 'user@example.com', 'Hello'); // Oops!

// ✅ GOOD: Create domain types
class Email {
  constructor(
    public readonly address: string
  ) {
    if (!this.isValid(address)) {
      throw new Error('Invalid email address');
    }
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

class EmailMessage {
  constructor(
    public readonly to: Email,
    public readonly subject: string,
    public readonly body: string
  ) {}
}

function sendEmail(message: EmailMessage): void {
  // Type-safe, impossible to mix up
}
```

### 3. Long Parameter Lists

```typescript
// ❌ BAD
function createOrder(
  customerId: string,
  items: OrderItem[],
  shippingAddress: string,
  billingAddress: string,
  paymentMethod: string,
  discountCode: string,
  giftMessage: string,
  notes: string
): Order {}

// ✅ GOOD
interface CreateOrderParams {
  customerId: string;
  items: OrderItem[];
  addresses: {
    shipping: Address;
    billing: Address;
  };
  payment: PaymentMethod;
  options?: {
    discountCode?: string;
    giftMessage?: string;
    notes?: string;
  };
}

function createOrder(params: CreateOrderParams): Order {}
```

---

## Summary Checklist

### Names
- [ ] Names reveal intent
- [ ] No misleading names
- [ ] Pronounceable and searchable
- [ ] No encodings or prefixes
- [ ] Class names are nouns, methods are verbs

### Functions
- [ ] Functions are small (< 20 lines)
- [ ] Functions do one thing
- [ ] Max 3 parameters (use objects for more)
- [ ] No flag arguments
- [ ] No side effects

### Comments
- [ ] Explain WHY, not WHAT
- [ ] No commented-out code
- [ ] No redundant comments
- [ ] Updated when code changes

### Formatting
- [ ] Consistent style
- [ ] Proper indentation
- [ ] Blank lines separate concepts
- [ ] Related code is close together

### Error Handling
- [ ] Use exceptions, not error codes
- [ ] Provide context in exceptions
- [ ] Don't return null
- [ ] Don't pass null

### Principles
- [ ] DRY - no duplication
- [ ] KISS - keep it simple
- [ ] YAGNI - implement only what's needed
- [ ] Small, focused classes and modules

---

## References

- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring - Martin Fowler](https://refactoring.com/)
- [The Pragmatic Programmer - Hunt & Thomas](https://pragprog.com/titles/tpp20/)
- [Code Complete - Steve McConnell](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670)
- [Clean Code Blog](https://blog.cleancoder.com/)
- [Refactoring Guru](https://refactoring.guru/)
