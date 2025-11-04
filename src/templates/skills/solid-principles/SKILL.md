---
name: SOLID Principles
description: Comprehensive guide to SOLID principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) with practical examples and refactoring patterns.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - architecture
  - design-patterns
  - solid
  - refactoring
  - best-practices
  - oop
mcp-servers:
  - sequential-thinking
  - context7
---

# SOLID Principles Skill

This skill provides comprehensive guidance on applying SOLID principles to create maintainable, scalable, and testable object-oriented code. Includes detailed explanations, code examples in TypeScript and Python, and real-world refactoring patterns.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Analyze code for SOLID violations, identify which principle is violated, refactor code to comply with principles, test refactored code, validate improved maintainability.

**Additional tools available**:
- Use Sequential Thinking MCP for complex refactoring decisions
- Use Context7 MCP to research SOLID principle examples

## When to Use

- Designing new classes and modules
- Refactoring legacy code for better maintainability
- Reviewing code architecture and identifying design issues
- Building extensible systems that need to accommodate future changes
- Reducing coupling between components
- Improving testability of existing code
- Mentoring team members on OOP best practices

## What are SOLID Principles?

SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable:

- **S**ingle Responsibility Principle (SRP)
- **O**pen-Closed Principle (OCP)
- **L**iskov Substitution Principle (LSP)
- **I**nterface Segregation Principle (ISP)
- **D**ependency Inversion Principle (DIP)

These principles were introduced by Robert C. Martin (Uncle Bob) and have become fundamental to object-oriented design.

## 1. Single Responsibility Principle (SRP)

### Definition

**A class should have one, and only one, reason to change.**

Each class should have a single responsibility or job. If a class has multiple responsibilities, changes to one responsibility can affect or break the others.

### Why It Matters

- **Maintainability**: Easier to understand and modify
- **Testability**: Simpler to write focused unit tests
- **Reusability**: Focused classes are easier to reuse
- **Reduced Coupling**: Classes depend on fewer things

### Violation Example (TypeScript)

```typescript
// ❌ BAD: UserManager has multiple responsibilities
class UserManager {
  private users: User[] = [];

  // Responsibility 1: User management
  addUser(user: User): void {
    this.users.push(user);
  }

  removeUser(userId: string): void {
    this.users = this.users.filter(u => u.id !== userId);
  }

  // Responsibility 2: Data persistence
  saveToDatabase(): void {
    const db = new Database();
    db.connect();
    db.save('users', this.users);
    db.disconnect();
  }

  // Responsibility 3: Email notifications
  sendWelcomeEmail(user: User): void {
    const emailService = new EmailService();
    emailService.send({
      to: user.email,
      subject: 'Welcome!',
      body: `Welcome ${user.name}!`
    });
  }

  // Responsibility 4: Report generation
  generateUserReport(): string {
    let report = 'User Report\n';
    this.users.forEach(user => {
      report += `${user.name} - ${user.email}\n`;
    });
    return report;
  }

  // Responsibility 5: Validation
  validateUser(user: User): boolean {
    return user.email.includes('@') && user.name.length > 0;
  }
}
```

**Problems:**
- Changes to database logic require modifying UserManager
- Changes to email service require modifying UserManager
- Changes to report format require modifying UserManager
- Difficult to test individual responsibilities
- High coupling to multiple external services

### Proper Implementation (TypeScript)

```typescript
// ✅ GOOD: Separated responsibilities

// Responsibility 1: User management
class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  removeUser(userId: string): void {
    this.users = this.users.filter(u => u.id !== userId);
  }

  getUsers(): User[] {
    return [...this.users];
  }

  findUser(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }
}

// Responsibility 2: Data persistence
class UserRepository {
  constructor(private database: Database) {}

  async save(users: User[]): Promise<void> {
    await this.database.connect();
    await this.database.save('users', users);
    await this.database.disconnect();
  }

  async load(): Promise<User[]> {
    await this.database.connect();
    const users = await this.database.load('users');
    await this.database.disconnect();
    return users;
  }
}

// Responsibility 3: Email notifications
class UserNotificationService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmail(user: User): Promise<void> {
    await this.emailService.send({
      to: user.email,
      subject: 'Welcome!',
      body: `Welcome ${user.name}!`
    });
  }

  async sendPasswordReset(user: User, resetToken: string): Promise<void> {
    await this.emailService.send({
      to: user.email,
      subject: 'Password Reset',
      body: `Reset your password: ${resetToken}`
    });
  }
}

// Responsibility 4: Report generation
class UserReportGenerator {
  generateReport(users: User[]): string {
    let report = 'User Report\n';
    report += '=============\n\n';
    users.forEach(user => {
      report += `Name: ${user.name}\n`;
      report += `Email: ${user.email}\n`;
      report += `Joined: ${user.createdAt}\n\n`;
    });
    return report;
  }

  generateCsvReport(users: User[]): string {
    let csv = 'Name,Email,Joined\n';
    users.forEach(user => {
      csv += `${user.name},${user.email},${user.createdAt}\n`;
    });
    return csv;
  }
}

// Responsibility 5: Validation
class UserValidator {
  validate(user: User): ValidationResult {
    const errors: string[] = [];

    if (!user.email.includes('@')) {
      errors.push('Invalid email format');
    }

    if (user.name.length === 0) {
      errors.push('Name is required');
    }

    if (user.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Usage
const userManager = new UserManager();
const userRepo = new UserRepository(new Database());
const notificationService = new UserNotificationService(new EmailService());
const validator = new UserValidator();
const reportGenerator = new UserReportGenerator();

// Add and validate user
const newUser = new User('John Doe', 'john@example.com');
const validation = validator.validate(newUser);

if (validation.isValid) {
  userManager.addUser(newUser);
  await userRepo.save(userManager.getUsers());
  await notificationService.sendWelcomeEmail(newUser);
}

// Generate report
const report = reportGenerator.generateReport(userManager.getUsers());
```

### Python Example

```python
# ❌ BAD: Multiple responsibilities
class OrderProcessor:
    def __init__(self):
        self.orders = []

    def add_order(self, order):
        """Responsibility 1: Order management"""
        self.orders.append(order)

    def calculate_total(self, order):
        """Responsibility 2: Business logic"""
        total = sum(item.price * item.quantity for item in order.items)
        tax = total * 0.1
        return total + tax

    def save_to_database(self, order):
        """Responsibility 3: Persistence"""
        conn = Database.connect()
        conn.execute("INSERT INTO orders VALUES (?)", order)
        conn.close()

    def send_confirmation_email(self, order):
        """Responsibility 4: Notifications"""
        email = EmailService()
        email.send(order.customer_email, "Order Confirmation",
                   f"Your order {order.id} has been confirmed")

    def generate_invoice(self, order):
        """Responsibility 5: Reporting"""
        invoice = f"Invoice #{order.id}\n"
        invoice += f"Customer: {order.customer_name}\n"
        for item in order.items:
            invoice += f"{item.name}: ${item.price}\n"
        return invoice

# ✅ GOOD: Separated responsibilities
class OrderManager:
    """Manages order collection"""
    def __init__(self):
        self.orders = []

    def add_order(self, order):
        self.orders.append(order)

    def get_order(self, order_id):
        return next((o for o in self.orders if o.id == order_id), None)

    def get_all_orders(self):
        return self.orders.copy()

class OrderCalculator:
    """Handles order calculations"""
    def __init__(self, tax_rate=0.1):
        self.tax_rate = tax_rate

    def calculate_subtotal(self, order):
        return sum(item.price * item.quantity for item in order.items)

    def calculate_tax(self, subtotal):
        return subtotal * self.tax_rate

    def calculate_total(self, order):
        subtotal = self.calculate_subtotal(order)
        tax = self.calculate_tax(subtotal)
        return subtotal + tax

class OrderRepository:
    """Handles order persistence"""
    def __init__(self, database):
        self.database = database

    def save(self, order):
        with self.database.connection() as conn:
            conn.execute(
                "INSERT INTO orders (id, customer_id, total) VALUES (?, ?, ?)",
                (order.id, order.customer_id, order.total)
            )

    def find_by_id(self, order_id):
        with self.database.connection() as conn:
            result = conn.execute(
                "SELECT * FROM orders WHERE id = ?", (order_id,)
            ).fetchone()
            return Order.from_dict(result) if result else None

class OrderNotificationService:
    """Handles order notifications"""
    def __init__(self, email_service):
        self.email_service = email_service

    def send_confirmation(self, order):
        self.email_service.send(
            to=order.customer_email,
            subject="Order Confirmation",
            body=f"Your order {order.id} has been confirmed"
        )

    def send_shipment_notification(self, order, tracking_number):
        self.email_service.send(
            to=order.customer_email,
            subject="Order Shipped",
            body=f"Your order {order.id} has shipped. Tracking: {tracking_number}"
        )

class OrderInvoiceGenerator:
    """Generates order invoices"""
    def generate(self, order, calculator):
        subtotal = calculator.calculate_subtotal(order)
        tax = calculator.calculate_tax(subtotal)
        total = calculator.calculate_total(order)

        invoice = f"INVOICE #{order.id}\n"
        invoice += "=" * 40 + "\n"
        invoice += f"Customer: {order.customer_name}\n"
        invoice += f"Date: {order.created_at}\n\n"
        invoice += "Items:\n"
        for item in order.items:
            invoice += f"  {item.name} x{item.quantity}: ${item.price * item.quantity:.2f}\n"
        invoice += "\n"
        invoice += f"Subtotal: ${subtotal:.2f}\n"
        invoice += f"Tax: ${tax:.2f}\n"
        invoice += f"Total: ${total:.2f}\n"
        return invoice
```

### When to Apply SRP

- **During Design**: When creating new classes, ask "What is this class's single responsibility?"
- **During Code Review**: If a class is hard to name without using "And" or "Or", it likely has multiple responsibilities
- **During Refactoring**: When you find yourself changing a class for different reasons
- **Red Flags**:
  - Classes with many dependencies
  - Classes with many public methods
  - Classes that are difficult to test
  - Classes with names like "Manager", "Handler", "Utility" (often catch-all classes)

---

## 2. Open-Closed Principle (OCP)

### Definition

**Software entities (classes, modules, functions) should be open for extension but closed for modification.**

You should be able to add new functionality without changing existing code.

### Why It Matters

- **Stability**: Existing code remains unchanged and tested
- **Flexibility**: Easy to add new features
- **Risk Reduction**: Less chance of introducing bugs
- **Backward Compatibility**: Existing functionality continues to work

### Violation Example (TypeScript)

```typescript
// ❌ BAD: Must modify class to add new shapes
class AreaCalculator {
  calculateArea(shapes: any[]): number {
    let totalArea = 0;

    for (const shape of shapes) {
      if (shape.type === 'circle') {
        totalArea += Math.PI * shape.radius * shape.radius;
      } else if (shape.type === 'rectangle') {
        totalArea += shape.width * shape.height;
      } else if (shape.type === 'triangle') {
        totalArea += 0.5 * shape.base * shape.height;
      }
      // Need to modify this class every time we add a new shape!
    }

    return totalArea;
  }
}

// Adding a new shape requires modifying AreaCalculator
```

### Proper Implementation (TypeScript)

```typescript
// ✅ GOOD: Open for extension, closed for modification

// Define a common interface
interface Shape {
  calculateArea(): number;
}

// Each shape implements the interface
class Circle implements Shape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }
}

class Triangle implements Shape {
  constructor(private base: number, private height: number) {}

  calculateArea(): number {
    return 0.5 * this.base * this.height;
  }
}

// AreaCalculator doesn't need modification for new shapes
class AreaCalculator {
  calculateArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }
}

// Adding a new shape doesn't require modifying existing code
class Pentagon implements Shape {
  constructor(private side: number) {}

  calculateArea(): number {
    return (5 * this.side * this.side) / (4 * Math.tan(Math.PI / 5));
  }
}

// Usage
const calculator = new AreaCalculator();
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 8),
  new Pentagon(4)
];

const totalArea = calculator.calculateArea(shapes);
```

### Real-World Example: Payment Processing (Python)

```python
# ❌ BAD: Must modify to add payment methods
class PaymentProcessor:
    def process_payment(self, amount, method, details):
        if method == "credit_card":
            # Credit card processing logic
            card_number = details["card_number"]
            cvv = details["cvv"]
            # Process credit card...
            return {"status": "success", "transaction_id": "CC123"}

        elif method == "paypal":
            # PayPal processing logic
            email = details["email"]
            # Process PayPal...
            return {"status": "success", "transaction_id": "PP456"}

        elif method == "bank_transfer":
            # Bank transfer logic
            account = details["account"]
            routing = details["routing"]
            # Process bank transfer...
            return {"status": "success", "transaction_id": "BT789"}

        # Adding new payment method requires modifying this class!

# ✅ GOOD: Open for extension, closed for modification
from abc import ABC, abstractmethod
from typing import Dict, Any

class PaymentMethod(ABC):
    """Abstract base class for payment methods"""

    @abstractmethod
    def process(self, amount: float, details: Dict[str, Any]) -> Dict[str, Any]:
        """Process payment and return transaction result"""
        pass

    @abstractmethod
    def validate(self, details: Dict[str, Any]) -> bool:
        """Validate payment details"""
        pass

class CreditCardPayment(PaymentMethod):
    def validate(self, details: Dict[str, Any]) -> bool:
        required_fields = ["card_number", "cvv", "expiry"]
        return all(field in details for field in required_fields)

    def process(self, amount: float, details: Dict[str, Any]) -> Dict[str, Any]:
        if not self.validate(details):
            return {"status": "error", "message": "Invalid card details"}

        # Credit card processing logic
        card_number = details["card_number"]
        cvv = details["cvv"]

        # Simulate processing
        transaction_id = f"CC{card_number[-4:]}"

        return {
            "status": "success",
            "transaction_id": transaction_id,
            "amount": amount,
            "method": "credit_card"
        }

class PayPalPayment(PaymentMethod):
    def validate(self, details: Dict[str, Any]) -> bool:
        return "email" in details and "@" in details["email"]

    def process(self, amount: float, details: Dict[str, Any]) -> Dict[str, Any]:
        if not self.validate(details):
            return {"status": "error", "message": "Invalid PayPal details"}

        email = details["email"]

        # Simulate PayPal API call
        transaction_id = f"PP{hash(email) % 10000}"

        return {
            "status": "success",
            "transaction_id": transaction_id,
            "amount": amount,
            "method": "paypal"
        }

class BankTransferPayment(PaymentMethod):
    def validate(self, details: Dict[str, Any]) -> bool:
        required_fields = ["account_number", "routing_number"]
        return all(field in details for field in required_fields)

    def process(self, amount: float, details: Dict[str, Any]) -> Dict[str, Any]:
        if not self.validate(details):
            return {"status": "error", "message": "Invalid bank details"}

        account = details["account_number"]
        routing = details["routing_number"]

        # Simulate bank transfer
        transaction_id = f"BT{account[-4:]}"

        return {
            "status": "success",
            "transaction_id": transaction_id,
            "amount": amount,
            "method": "bank_transfer"
        }

# Payment processor doesn't need modification for new methods
class PaymentProcessor:
    def __init__(self):
        self.payment_methods: Dict[str, PaymentMethod] = {}

    def register_method(self, name: str, method: PaymentMethod) -> None:
        """Register a new payment method"""
        self.payment_methods[name] = method

    def process_payment(self, method_name: str, amount: float,
                       details: Dict[str, Any]) -> Dict[str, Any]:
        if method_name not in self.payment_methods:
            return {"status": "error", "message": "Unsupported payment method"}

        method = self.payment_methods[method_name]
        return method.process(amount, details)

# Adding cryptocurrency payment doesn't require modifying existing classes
class CryptoPayment(PaymentMethod):
    def validate(self, details: Dict[str, Any]) -> bool:
        return "wallet_address" in details and "currency" in details

    def process(self, amount: float, details: Dict[str, Any]) -> Dict[str, Any]:
        if not self.validate(details):
            return {"status": "error", "message": "Invalid crypto details"}

        wallet = details["wallet_address"]
        currency = details["currency"]

        # Simulate crypto transaction
        transaction_id = f"CRYPTO{wallet[:8]}"

        return {
            "status": "success",
            "transaction_id": transaction_id,
            "amount": amount,
            "method": "cryptocurrency",
            "currency": currency
        }

# Usage
processor = PaymentProcessor()
processor.register_method("credit_card", CreditCardPayment())
processor.register_method("paypal", PayPalPayment())
processor.register_method("bank_transfer", BankTransferPayment())
processor.register_method("crypto", CryptoPayment())

# Process payments
result1 = processor.process_payment("credit_card", 100.0, {
    "card_number": "1234567890123456",
    "cvv": "123",
    "expiry": "12/25"
})

result2 = processor.process_payment("crypto", 500.0, {
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "currency": "ETH"
})
```

### When to Apply OCP

- **Plugin Architectures**: Allow adding plugins without modifying core system
- **Strategy Pattern**: Different algorithms that can be swapped
- **Template Method**: Base behavior with extension points
- **Factory Pattern**: Creating objects of different types
- **Red Flags**:
  - Long if-else or switch statements based on type
  - Frequent modifications to add new features
  - Tight coupling to concrete implementations

---

## 3. Liskov Substitution Principle (LSP)

### Definition

**Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.**

Subclasses should enhance, not break or alter, the behavior of the parent class.

### Why It Matters

- **Reliability**: Guarantees predictable behavior
- **Polymorphism**: Safe to use inheritance and interfaces
- **Contract Preservation**: Maintains expected behavior
- **Testing**: Subclasses can be tested as their parent type

### Violation Example (TypeScript)

```typescript
// ❌ BAD: Square violates LSP
class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }

  // Square overrides setters to maintain square invariant
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Forces height to match
  }

  setHeight(height: number): void {
    this.width = height; // Forces width to match
    this.height = height;
  }
}

// This function works fine with Rectangle
function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(4);

  // Expected: area = 20
  console.log(`Area: ${rectangle.getArea()}`);
}

// But breaks with Square!
const rect = new Rectangle(2, 3);
resizeRectangle(rect); // Output: Area: 20 ✓

const square = new Square(2);
resizeRectangle(square); // Output: Area: 16 ✗ (Expected 20!)
// Square cannot substitute Rectangle without breaking behavior
```

### Proper Implementation (TypeScript)

```typescript
// ✅ GOOD: Separate hierarchies for different behaviors

interface Shape {
  getArea(): number;
  getPerimeter(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Square implements Shape {
  constructor(private size: number) {}

  setSize(size: number): void {
    this.size = size;
  }

  getSize(): number {
    return this.size;
  }

  getArea(): number {
    return this.size * this.size;
  }

  getPerimeter(): number {
    return 4 * this.size;
  }
}

// Functions work with Shape interface
function printShapeInfo(shape: Shape): void {
  console.log(`Area: ${shape.getArea()}`);
  console.log(`Perimeter: ${shape.getPerimeter()}`);
}

// Both work correctly
printShapeInfo(new Rectangle(5, 4)); // Area: 20, Perimeter: 18
printShapeInfo(new Square(5));      // Area: 25, Perimeter: 20
```

### Real-World Example: Bird Hierarchy (Python)

```python
# ❌ BAD: Penguin violates LSP
class Bird:
    def fly(self):
        return "Flying high!"

    def eat(self):
        return "Eating food"

class Sparrow(Bird):
    def fly(self):
        return "Sparrow flying!"

class Penguin(Bird):
    def fly(self):
        # Penguins can't fly! This violates LSP
        raise Exception("Penguins can't fly!")

# This breaks when using Penguin
def make_bird_fly(bird: Bird):
    return bird.fly()

sparrow = Sparrow()
print(make_bird_fly(sparrow))  # Works fine

penguin = Penguin()
print(make_bird_fly(penguin))  # Crashes! Penguin can't substitute Bird

# ✅ GOOD: Proper abstraction hierarchy
from abc import ABC, abstractmethod

class Bird(ABC):
    @abstractmethod
    def eat(self):
        pass

    @abstractmethod
    def move(self):
        pass

class FlyingBird(Bird):
    @abstractmethod
    def fly(self):
        pass

    def move(self):
        return self.fly()

class FlightlessBird(Bird):
    @abstractmethod
    def walk(self):
        pass

    def move(self):
        return self.walk()

class Sparrow(FlyingBird):
    def eat(self):
        return "Eating seeds"

    def fly(self):
        return "Sparrow flying in the sky!"

class Eagle(FlyingBird):
    def eat(self):
        return "Eating prey"

    def fly(self):
        return "Eagle soaring high!"

class Penguin(FlightlessBird):
    def eat(self):
        return "Eating fish"

    def walk(self):
        return "Penguin waddling on ice"

    def swim(self):
        return "Penguin swimming underwater"

class Ostrich(FlightlessBird):
    def eat(self):
        return "Eating plants"

    def walk(self):
        return "Ostrich running fast!"

# Now functions work correctly with proper types
def make_bird_move(bird: Bird):
    return bird.move()

def feed_bird(bird: Bird):
    return bird.eat()

# All birds work correctly
sparrow = Sparrow()
eagle = Eagle()
penguin = Penguin()
ostrich = Ostrich()

print(make_bird_move(sparrow))   # Sparrow flying in the sky!
print(make_bird_move(penguin))   # Penguin waddling on ice
print(feed_bird(eagle))          # Eating prey
```

### Contract Preservation Example

```python
# ❌ BAD: Violates preconditions/postconditions
class BankAccount:
    def __init__(self, balance: float):
        self.balance = balance

    def withdraw(self, amount: float) -> float:
        """
        Precondition: amount > 0
        Postcondition: balance decreased by amount
        """
        if amount <= 0:
            raise ValueError("Amount must be positive")

        if amount > self.balance:
            raise ValueError("Insufficient funds")

        self.balance -= amount
        return self.balance

class OverdraftAccount(BankAccount):
    def __init__(self, balance: float, overdraft_limit: float):
        super().__init__(balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount: float) -> float:
        # Weakens precondition - allows negative amounts!
        # This violates LSP
        self.balance -= amount
        return self.balance

# ✅ GOOD: Maintains contracts
class BankAccount:
    def __init__(self, balance: float):
        self._balance = balance

    def withdraw(self, amount: float) -> bool:
        """
        Precondition: amount > 0
        Returns: True if successful, False otherwise
        """
        if amount <= 0:
            raise ValueError("Amount must be positive")

        if not self._can_withdraw(amount):
            return False

        self._deduct(amount)
        return True

    def _can_withdraw(self, amount: float) -> bool:
        return amount <= self._balance

    def _deduct(self, amount: float) -> None:
        self._balance -= amount

    def get_balance(self) -> float:
        return self._balance

class OverdraftAccount(BankAccount):
    def __init__(self, balance: float, overdraft_limit: float):
        super().__init__(balance)
        self.overdraft_limit = overdraft_limit

    # Strengthens ability to withdraw (allows overdraft)
    # This is acceptable - it doesn't break the contract
    def _can_withdraw(self, amount: float) -> bool:
        return amount <= (self._balance + self.overdraft_limit)

    def get_available_balance(self) -> float:
        return self._balance + self.overdraft_limit

# Usage works correctly with both types
def process_withdrawal(account: BankAccount, amount: float):
    if account.withdraw(amount):
        print(f"Withdrawal successful. New balance: ${account.get_balance():.2f}")
    else:
        print("Withdrawal failed - insufficient funds")

regular = BankAccount(100)
overdraft = OverdraftAccount(100, 50)

process_withdrawal(regular, 150)    # Fails correctly
process_withdrawal(overdraft, 150)  # Succeeds (has overdraft)
```

### When to Apply LSP

- **Designing Inheritance**: Ensure subclasses can truly substitute parent
- **Interface Design**: Methods should work with all implementations
- **Testing**: If you need type checks, LSP is likely violated
- **Red Flags**:
  - Type checking (instanceof, typeof)
  - Throwing "not implemented" exceptions
  - Overriding methods to do nothing or throw errors
  - Subclasses that weaken preconditions or strengthen postconditions

---

## 4. Interface Segregation Principle (ISP)

### Definition

**No client should be forced to depend on methods it does not use.**

Many specific interfaces are better than one general-purpose interface.

### Why It Matters

- **Flexibility**: Clients only depend on what they need
- **Decoupling**: Changes to unused methods don't affect clients
- **Clarity**: Smaller interfaces are easier to understand
- **Implementation**: Easier to implement focused interfaces

### Violation Example (TypeScript)

```typescript
// ❌ BAD: Monolithic interface forces unnecessary dependencies
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  getSalary(): number;
  attendMeeting(): void;
  submitReport(): void;
  takeBreak(): void;
}

// Robot worker doesn't eat or sleep, but must implement them
class RobotWorker implements Worker {
  work(): void {
    console.log("Robot working");
  }

  eat(): void {
    // Robots don't eat! Forced to implement unnecessary method
    throw new Error("Robots don't eat");
  }

  sleep(): void {
    // Robots don't sleep! Forced to implement unnecessary method
    throw new Error("Robots don't sleep");
  }

  getSalary(): number {
    // Robots don't get salary!
    throw new Error("Robots don't get paid");
  }

  attendMeeting(): void {
    throw new Error("Robots don't attend meetings");
  }

  submitReport(): void {
    console.log("Generating report");
  }

  takeBreak(): void {
    throw new Error("Robots don't take breaks");
  }
}

// Intern doesn't attend meetings or submit reports
class Intern implements Worker {
  work(): void {
    console.log("Intern working");
  }

  eat(): void {
    console.log("Intern eating");
  }

  sleep(): void {
    console.log("Intern sleeping");
  }

  getSalary(): number {
    return 0; // Unpaid intern
  }

  attendMeeting(): void {
    throw new Error("Interns don't attend meetings");
  }

  submitReport(): void {
    throw new Error("Interns don't submit reports");
  }

  takeBreak(): void {
    console.log("Taking break");
  }
}
```

### Proper Implementation (TypeScript)

```typescript
// ✅ GOOD: Segregated interfaces

// Core interfaces
interface Workable {
  work(): void;
}

interface Reportable {
  submitReport(): void;
}

interface Payable {
  getSalary(): number;
}

interface Biological {
  eat(): void;
  sleep(): void;
}

interface HumanResource {
  attendMeeting(): void;
  takeBreak(): void;
}

// Implementations compose only what they need
class RobotWorker implements Workable, Reportable {
  work(): void {
    console.log("Robot working 24/7");
  }

  submitReport(): void {
    console.log("Robot generating automated report");
  }
}

class Employee implements Workable, Reportable, Payable, Biological, HumanResource {
  constructor(private salary: number) {}

  work(): void {
    console.log("Employee working");
  }

  submitReport(): void {
    console.log("Employee submitting report");
  }

  getSalary(): number {
    return this.salary;
  }

  eat(): void {
    console.log("Employee eating lunch");
  }

  sleep(): void {
    console.log("Employee resting");
  }

  attendMeeting(): void {
    console.log("Employee attending meeting");
  }

  takeBreak(): void {
    console.log("Employee taking break");
  }
}

class Intern implements Workable, Biological, HumanResource {
  work(): void {
    console.log("Intern working and learning");
  }

  eat(): void {
    console.log("Intern eating");
  }

  sleep(): void {
    console.log("Intern resting");
  }

  attendMeeting(): void {
    console.log("Intern observing meeting");
  }

  takeBreak(): void {
    console.log("Intern taking break");
  }
}

// Functions only depend on what they need
function assignWork(worker: Workable): void {
  worker.work();
}

function processPayroll(payable: Payable): void {
  const salary = payable.getSalary();
  console.log(`Processing salary: $${salary}`);
}

function scheduleMeeting(attendee: HumanResource): void {
  attendee.attendMeeting();
}

// Usage
const robot = new RobotWorker();
const employee = new Employee(50000);
const intern = new Intern();

assignWork(robot);        // Works
assignWork(employee);     // Works
assignWork(intern);       // Works

processPayroll(employee); // Works
// processPayroll(robot); // Compile error - robot is not Payable

scheduleMeeting(employee); // Works
scheduleMeeting(intern);   // Works
// scheduleMeeting(robot); // Compile error - robot is not HumanResource
```

### Real-World Example: Document System (Python)

```python
# ❌ BAD: Fat interface
from abc import ABC, abstractmethod

class Document(ABC):
    @abstractmethod
    def open(self):
        pass

    @abstractmethod
    def save(self):
        pass

    @abstractmethod
    def print(self):
        pass

    @abstractmethod
    def scan(self):
        pass

    @abstractmethod
    def fax(self):
        pass

    @abstractmethod
    def email(self):
        pass

# ReadOnlyDocument can't implement save, print, etc.
class ReadOnlyDocument(Document):
    def open(self):
        return "Opening document"

    def save(self):
        raise NotImplementedError("Cannot save read-only document")

    def print(self):
        raise NotImplementedError("Cannot print")

    def scan(self):
        raise NotImplementedError("Cannot scan")

    def fax(self):
        raise NotImplementedError("Cannot fax")

    def email(self):
        raise NotImplementedError("Cannot email")

# ✅ GOOD: Segregated interfaces
from abc import ABC, abstractmethod
from typing import Protocol

class Openable(Protocol):
    def open(self) -> str:
        ...

class Saveable(Protocol):
    def save(self) -> str:
        ...

class Printable(Protocol):
    def print(self) -> str:
        ...

class Scannable(Protocol):
    def scan(self) -> str:
        ...

class Faxable(Protocol):
    def fax(self, number: str) -> str:
        ...

class Emailable(Protocol):
    def email(self, address: str) -> str:
        ...

# Implementations only include what they need
class ReadOnlyDocument:
    def __init__(self, content: str):
        self.content = content

    def open(self) -> str:
        return f"Opening read-only document: {self.content}"

class EditableDocument:
    def __init__(self, content: str):
        self.content = content

    def open(self) -> str:
        return f"Opening document: {self.content}"

    def save(self) -> str:
        return f"Saving document: {self.content}"

class PrintableDocument:
    def __init__(self, content: str):
        self.content = content

    def open(self) -> str:
        return f"Opening document: {self.content}"

    def save(self) -> str:
        return f"Saving document: {self.content}"

    def print(self) -> str:
        return f"Printing document: {self.content}"

class MultiFunctionDocument:
    def __init__(self, content: str):
        self.content = content

    def open(self) -> str:
        return f"Opening document: {self.content}"

    def save(self) -> str:
        return f"Saving document: {self.content}"

    def print(self) -> str:
        return f"Printing document: {self.content}"

    def scan(self) -> str:
        return f"Scanning document"

    def fax(self, number: str) -> str:
        return f"Faxing document to {number}"

    def email(self, address: str) -> str:
        return f"Emailing document to {address}"

# Functions only require the interfaces they use
def open_document(doc: Openable) -> None:
    print(doc.open())

def save_document(doc: Saveable) -> None:
    print(doc.save())

def print_document(doc: Printable) -> None:
    print(doc.print())

def send_fax(doc: Faxable, number: str) -> None:
    print(doc.fax(number))

# Usage
read_only = ReadOnlyDocument("Annual Report")
editable = EditableDocument("Meeting Notes")
printable = PrintableDocument("Invoice")
multi = MultiFunctionDocument("Contract")

open_document(read_only)      # Works
open_document(multi)          # Works

save_document(editable)       # Works
# save_document(read_only)    # Type error - doesn't implement Saveable

print_document(printable)     # Works
print_document(multi)         # Works
# print_document(read_only)   # Type error

send_fax(multi, "555-1234")   # Works
# send_fax(printable, "555")  # Type error
```

### When to Apply ISP

- **API Design**: Create focused, minimal interfaces
- **Microservices**: Each service should have a specific contract
- **Plugin Systems**: Plugins implement only required capabilities
- **Red Flags**:
  - Interfaces with many methods
  - Implementations with empty or exception-throwing methods
  - Frequent use of "not implemented" errors
  - Interfaces with unrelated responsibilities

---

## 5. Dependency Inversion Principle (DIP)

### Definition

**High-level modules should not depend on low-level modules. Both should depend on abstractions.**

**Abstractions should not depend on details. Details should depend on abstractions.**

### Why It Matters

- **Flexibility**: Easy to swap implementations
- **Testability**: Can inject mocks and stubs
- **Decoupling**: Reduces tight coupling between modules
- **Maintainability**: Changes to low-level code don't affect high-level code

### Violation Example (TypeScript)

```typescript
// ❌ BAD: High-level depends on low-level concrete classes

// Low-level modules
class MySQLDatabase {
  connect(): void {
    console.log("Connecting to MySQL");
  }

  query(sql: string): any[] {
    console.log(`Executing MySQL query: ${sql}`);
    return [];
  }
}

class EmailService {
  send(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}`);
  }
}

// High-level module directly depends on concrete implementations
class UserService {
  private database: MySQLDatabase;
  private emailService: EmailService;

  constructor() {
    this.database = new MySQLDatabase(); // Tight coupling!
    this.emailService = new EmailService(); // Tight coupling!
  }

  createUser(name: string, email: string): void {
    this.database.connect();
    this.database.query(`INSERT INTO users (name, email) VALUES ('${name}', '${email}')`);
    this.emailService.send(email, "Welcome", `Welcome ${name}!`);
  }
}

// Cannot test without real MySQL and Email service!
// Cannot switch to PostgreSQL without modifying UserService!
```

### Proper Implementation (TypeScript)

```typescript
// ✅ GOOD: Both depend on abstractions

// Abstractions (interfaces)
interface Database {
  connect(): Promise<void>;
  query(sql: string): Promise<any[]>;
  disconnect(): Promise<void>;
}

interface Notification {
  send(recipient: string, message: string): Promise<void>;
}

// Low-level modules implement abstractions
class MySQLDatabase implements Database {
  async connect(): Promise<void> {
    console.log("Connecting to MySQL");
  }

  async query(sql: string): Promise<any[]> {
    console.log(`Executing MySQL query: ${sql}`);
    return [];
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting from MySQL");
  }
}

class PostgreSQLDatabase implements Database {
  async connect(): Promise<void> {
    console.log("Connecting to PostgreSQL");
  }

  async query(sql: string): Promise<any[]> {
    console.log(`Executing PostgreSQL query: ${sql}`);
    return [];
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting from PostgreSQL");
  }
}

class EmailNotification implements Notification {
  async send(recipient: string, message: string): Promise<void> {
    console.log(`Sending email to ${recipient}: ${message}`);
  }
}

class SMSNotification implements Notification {
  async send(recipient: string, message: string): Promise<void> {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  }
}

// High-level module depends on abstractions
class UserService {
  constructor(
    private database: Database,
    private notification: Notification
  ) {}

  async createUser(name: string, email: string): Promise<void> {
    await this.database.connect();
    await this.database.query(
      `INSERT INTO users (name, email) VALUES ('${name}', '${email}')`
    );
    await this.notification.send(email, `Welcome ${name}!`);
    await this.database.disconnect();
  }
}

// Dependency injection - easy to swap implementations
const mysqlService = new UserService(
  new MySQLDatabase(),
  new EmailNotification()
);

const postgresService = new UserService(
  new PostgreSQLDatabase(),
  new SMSNotification()
);

// Easy to test with mocks
class MockDatabase implements Database {
  async connect(): Promise<void> {}
  async query(sql: string): Promise<any[]> { return []; }
  async disconnect(): Promise<void> {}
}

class MockNotification implements Notification {
  async send(recipient: string, message: string): Promise<void> {}
}

const testService = new UserService(
  new MockDatabase(),
  new MockNotification()
);
```

### Real-World Example: E-commerce Order System (Python)

```python
# ❌ BAD: Concrete dependencies
class MySQLDatabase:
    def save_order(self, order_data):
        print(f"Saving to MySQL: {order_data}")

class StripePaymentGateway:
    def charge(self, amount, card_token):
        print(f"Charging ${amount} via Stripe")
        return "charge_id_123"

class SendGridEmail:
    def send(self, to, subject, body):
        print(f"Sending email via SendGrid to {to}")

class OrderService:
    def __init__(self):
        # Tightly coupled to concrete implementations
        self.db = MySQLDatabase()
        self.payment = StripePaymentGateway()
        self.email = SendGridEmail()

    def place_order(self, order_data, card_token):
        # Process payment
        charge_id = self.payment.charge(order_data['total'], card_token)

        # Save to database
        order_data['charge_id'] = charge_id
        self.db.save_order(order_data)

        # Send confirmation
        self.email.send(
            order_data['customer_email'],
            "Order Confirmation",
            f"Your order has been placed"
        )

# Cannot test without real Stripe, MySQL, SendGrid!
# Cannot switch to PayPal without modifying OrderService!

# ✅ GOOD: Dependency Inversion
from abc import ABC, abstractmethod
from typing import Dict, Any

# Abstractions
class OrderRepository(ABC):
    @abstractmethod
    def save(self, order: Dict[str, Any]) -> str:
        """Save order and return order ID"""
        pass

    @abstractmethod
    def find_by_id(self, order_id: str) -> Dict[str, Any]:
        pass

class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> str:
        """Process payment and return transaction ID"""
        pass

    @abstractmethod
    def refund(self, transaction_id: str) -> bool:
        pass

class NotificationService(ABC):
    @abstractmethod
    def send_notification(self, recipient: str, subject: str, content: str) -> bool:
        pass

# Low-level modules implement abstractions
class MySQLOrderRepository(OrderRepository):
    def save(self, order: Dict[str, Any]) -> str:
        print(f"Saving order to MySQL: {order}")
        return f"order_{hash(str(order)) % 10000}"

    def find_by_id(self, order_id: str) -> Dict[str, Any]:
        print(f"Finding order {order_id} in MySQL")
        return {"id": order_id, "status": "completed"}

class MongoDBOrderRepository(OrderRepository):
    def save(self, order: Dict[str, Any]) -> str:
        print(f"Saving order to MongoDB: {order}")
        return f"order_{hash(str(order)) % 10000}"

    def find_by_id(self, order_id: str) -> Dict[str, Any]:
        print(f"Finding order {order_id} in MongoDB")
        return {"id": order_id, "status": "completed"}

class StripePaymentGateway(PaymentGateway):
    def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> str:
        card_token = payment_details.get('card_token')
        print(f"Processing ${amount} via Stripe with token {card_token}")
        return f"stripe_charge_{hash(card_token) % 10000}"

    def refund(self, transaction_id: str) -> bool:
        print(f"Refunding Stripe transaction {transaction_id}")
        return True

class PayPalPaymentGateway(PaymentGateway):
    def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> str:
        email = payment_details.get('paypal_email')
        print(f"Processing ${amount} via PayPal for {email}")
        return f"paypal_tx_{hash(email) % 10000}"

    def refund(self, transaction_id: str) -> bool:
        print(f"Refunding PayPal transaction {transaction_id}")
        return True

class EmailNotificationService(NotificationService):
    def send_notification(self, recipient: str, subject: str, content: str) -> bool:
        print(f"Sending email to {recipient}: {subject}")
        return True

class SMSNotificationService(NotificationService):
    def send_notification(self, recipient: str, subject: str, content: str) -> bool:
        print(f"Sending SMS to {recipient}: {content}")
        return True

# High-level module depends on abstractions
class OrderService:
    def __init__(
        self,
        repository: OrderRepository,
        payment_gateway: PaymentGateway,
        notification: NotificationService
    ):
        self.repository = repository
        self.payment_gateway = payment_gateway
        self.notification = notification

    def place_order(self, order_data: Dict[str, Any],
                   payment_details: Dict[str, Any]) -> str:
        # Process payment
        transaction_id = self.payment_gateway.process_payment(
            order_data['total'],
            payment_details
        )

        # Save order
        order_data['transaction_id'] = transaction_id
        order_data['status'] = 'completed'
        order_id = self.repository.save(order_data)

        # Send confirmation
        self.notification.send_notification(
            order_data['customer_email'],
            "Order Confirmation",
            f"Your order #{order_id} has been confirmed. Transaction: {transaction_id}"
        )

        return order_id

    def refund_order(self, order_id: str) -> bool:
        order = self.repository.find_by_id(order_id)
        if not order:
            return False

        transaction_id = order.get('transaction_id')
        if self.payment_gateway.refund(transaction_id):
            order['status'] = 'refunded'
            self.repository.save(order)

            self.notification.send_notification(
                order['customer_email'],
                "Refund Processed",
                f"Your refund for order #{order_id} has been processed"
            )
            return True

        return False

# Dependency injection - flexible configurations
# Production with Stripe and MySQL
production_service = OrderService(
    MySQLOrderRepository(),
    StripePaymentGateway(),
    EmailNotificationService()
)

# Alternative configuration with PayPal and MongoDB
alternative_service = OrderService(
    MongoDBOrderRepository(),
    PayPalPaymentGateway(),
    SMSNotificationService()
)

# Testing with mocks
class MockOrderRepository(OrderRepository):
    def __init__(self):
        self.orders = {}

    def save(self, order: Dict[str, Any]) -> str:
        order_id = f"mock_order_{len(self.orders)}"
        self.orders[order_id] = order
        return order_id

    def find_by_id(self, order_id: str) -> Dict[str, Any]:
        return self.orders.get(order_id, {})

class MockPaymentGateway(PaymentGateway):
    def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> str:
        return "mock_transaction_123"

    def refund(self, transaction_id: str) -> bool:
        return True

class MockNotificationService(NotificationService):
    def __init__(self):
        self.sent_notifications = []

    def send_notification(self, recipient: str, subject: str, content: str) -> bool:
        self.sent_notifications.append({
            'recipient': recipient,
            'subject': subject,
            'content': content
        })
        return True

# Test service with mocks
test_service = OrderService(
    MockOrderRepository(),
    MockPaymentGateway(),
    MockNotificationService()
)

# Usage
order = {
    'items': ['Product A', 'Product B'],
    'total': 99.99,
    'customer_email': 'customer@example.com'
}

payment = {
    'card_token': 'tok_visa_4242'
}

order_id = production_service.place_order(order, payment)
print(f"Order placed: {order_id}")
```

### When to Apply DIP

- **Module Design**: Design from interfaces down to implementations
- **Testing**: When you need to mock dependencies
- **Plugin Architecture**: Allow runtime swapping of implementations
- **Microservices**: Services communicate through contracts
- **Red Flags**:
  - Using `new` keyword for dependencies inside classes
  - Difficult to unit test classes
  - Cannot swap implementations without code changes
  - Circular dependencies

---

## Common Violations and Fixes

### Anti-Pattern 1: God Object

```typescript
// ❌ Violates SRP, ISP
class ApplicationManager {
  // Handles everything!
  authenticateUser() {}
  sendEmail() {}
  processPayment() {}
  generateReport() {}
  logError() {}
  cacheData() {}
  // ... 50 more methods
}

// ✅ Split into focused services
class AuthService {}
class EmailService {}
class PaymentService {}
class ReportService {}
class Logger {}
class CacheService {}
```

### Anti-Pattern 2: Shotgun Surgery

```typescript
// ❌ Changes require modifying many classes
class OrderValidator {
  validate(order) {
    if (order.total > 1000) // Change this threshold = modify many files
  }
}

// ✅ Centralize configuration
class OrderConfiguration {
  static MAX_ORDER_AMOUNT = 1000; // Change in one place
}
```

### Anti-Pattern 3: Feature Envy

```typescript
// ❌ Method uses more data from another class
class Order {
  calculateDiscount(customer: Customer) {
    if (customer.isPremium && customer.loyaltyPoints > 100) {
      return customer.loyaltyPoints * 0.01;
    }
  }
}

// ✅ Move behavior to where data lives
class Customer {
  calculateDiscount(): number {
    if (this.isPremium && this.loyaltyPoints > 100) {
      return this.loyaltyPoints * 0.01;
    }
    return 0;
  }
}
```

## Best Practices

1. **Start with Interfaces**: Design contracts before implementations
2. **Compose Over Inherit**: Prefer composition to deep inheritance hierarchies
3. **Dependency Injection**: Use DI containers or constructor injection
4. **Test-Driven Development**: SOLID makes TDD easier
5. **Refactor Incrementally**: Apply principles gradually during refactoring
6. **Document Decisions**: Explain why you chose certain abstractions

## Testing SOLID Code

```typescript
// SOLID code is easy to test
describe('OrderService', () => {
  it('should place order successfully', async () => {
    // Arrange - inject mocks
    const mockRepo = new MockOrderRepository();
    const mockPayment = new MockPaymentGateway();
    const mockNotification = new MockNotificationService();
    const service = new OrderService(mockRepo, mockPayment, mockNotification);

    // Act
    const orderId = await service.placeOrder(orderData, paymentDetails);

    // Assert
    expect(orderId).toBeDefined();
    expect(mockRepo.saved).toHaveLength(1);
    expect(mockPayment.processed).toBe(true);
    expect(mockNotification.sent).toBe(true);
  });
});
```

## When NOT to Apply SOLID

- **Simple Scripts**: Don't over-engineer one-off scripts
- **Prototypes**: Get it working first, refactor later
- **Performance Critical**: Sometimes concrete types are faster
- **Premature Abstraction**: Don't abstract until you have 2-3 implementations

## References

- [Robert C. Martin - SOLID Principles](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)
- [Martin Fowler - Refactoring](https://refactoring.com/)
- [Clean Architecture - Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [SOLID Principles Wikipedia](https://en.wikipedia.org/wiki/SOLID)
