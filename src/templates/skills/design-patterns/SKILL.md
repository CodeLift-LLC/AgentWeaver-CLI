---
name: Design Patterns
description: Comprehensive guide to Gang of Four design patterns and modern architectural patterns with practical TypeScript and Python implementations for building maintainable, scalable applications.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - design-patterns
  - architecture
  - oop
  - software-design
  - typescript
  - python
  - best-practices
mcp-servers:
  - sequential-thinking
  - context7
---

# Design Patterns Skill

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Identify the problem pattern solves, select appropriate design pattern, implement pattern following best practices, refactor existing code to use pattern, test implementation.

**Additional tools available**:
- Use Sequential Thinking MCP for complex pattern selection decisions
- Use Context7 MCP to research design pattern examples and variations

Master essential design patterns from the Gang of Four and modern software development, with practical implementations in TypeScript and Python for building robust, maintainable applications.

## When to Use

- Designing scalable application architecture
- Refactoring legacy code for better maintainability
- Solving common software design problems
- Building flexible, extensible systems
- Improving code organization and testability
- Implementing proven solutions to recurring challenges
- Creating reusable component libraries

## Pattern Categories

### Creational Patterns
Focus on object creation mechanisms, providing flexibility in instantiation.

### Structural Patterns
Deal with object composition, creating relationships between objects.

### Behavioral Patterns
Handle communication between objects and responsibility assignment.

### Modern Patterns
Contemporary patterns for web development and enterprise applications.

---

## Creational Patterns

### 1. Singleton Pattern

**Intent**: Ensure a class has only one instance and provide global access to it.

**When to Use**:
- Database connection pools
- Configuration managers
- Logging services
- Cache managers
- Thread pools

**Structure**:
```
┌─────────────────────┐
│    Singleton        │
├─────────────────────┤
│ - instance          │
├─────────────────────┤
│ + getInstance()     │
│ - constructor()     │
└─────────────────────┘
```

**TypeScript Implementation**:
```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionString: string;
  private isConnected: boolean = false;

  // Private constructor prevents direct instantiation
  private constructor() {
    this.connectionString = process.env.DATABASE_URL || '';
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public connect(): void {
    if (!this.isConnected) {
      console.log('Connecting to database...');
      // Actual connection logic
      this.isConnected = true;
    }
  }

  public query(sql: string): any[] {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    // Query logic
    return [];
  }
}

// Usage
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true - same instance
```

**Python Implementation**:
```python
class DatabaseConnection:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.connection_string = os.getenv('DATABASE_URL', '')
        self.is_connected = False
        self._initialized = True

    def connect(self):
        if not self.is_connected:
            print('Connecting to database...')
            self.is_connected = True

    def query(self, sql: str) -> list:
        if not self.is_connected:
            raise Exception('Database not connected')
        return []

# Usage
db1 = DatabaseConnection()
db2 = DatabaseConnection()
print(db1 is db2)  # True - same instance
```

**Benefits**:
- Controlled access to single instance
- Reduced memory footprint
- Lazy initialization support

**Trade-offs**:
- Can make testing difficult (global state)
- Violates Single Responsibility Principle
- Can hide dependencies

**Real-World Use Case**: Logger service in a web application
```typescript
class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    this.logs.push(logMessage);
    console.log(logMessage);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

// Usage across application
const logger = Logger.getInstance();
logger.log('Application started', 'info');
logger.log('User logged in', 'info');
```

---

### 2. Factory Pattern

**Intent**: Define an interface for creating objects, but let subclasses decide which class to instantiate.

**When to Use**:
- Creating objects without specifying exact class
- System should be independent of object creation
- Multiple similar objects with slight variations
- Centralizing object creation logic

**Structure**:
```
┌─────────────────┐
│    Creator      │
├─────────────────┤
│ + factoryMethod │
└────────┬────────┘
         │
         │ creates
         ▼
┌─────────────────┐
│    Product      │
└─────────────────┘
```

**TypeScript Implementation**:
```typescript
// Product interface
interface Notification {
  send(recipient: string, message: string): void;
}

// Concrete products
class EmailNotification implements Notification {
  send(recipient: string, message: string): void {
    console.log(`Sending email to ${recipient}: ${message}`);
    // Email sending logic
  }
}

class SMSNotification implements Notification {
  send(recipient: string, message: string): void {
    console.log(`Sending SMS to ${recipient}: ${message}`);
    // SMS sending logic
  }
}

class PushNotification implements Notification {
  send(recipient: string, message: string): void {
    console.log(`Sending push notification to ${recipient}: ${message}`);
    // Push notification logic
  }
}

// Factory
class NotificationFactory {
  static createNotification(type: 'email' | 'sms' | 'push'): Notification {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

// Usage
const notification = NotificationFactory.createNotification('email');
notification.send('user@example.com', 'Welcome to our service!');
```

**Python Implementation**:
```python
from abc import ABC, abstractmethod

# Product interface
class Notification(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> None:
        pass

# Concrete products
class EmailNotification(Notification):
    def send(self, recipient: str, message: str) -> None:
        print(f"Sending email to {recipient}: {message}")

class SMSNotification(Notification):
    def send(self, recipient: str, message: str) -> None:
        print(f"Sending SMS to {recipient}: {message}")

class PushNotification(Notification):
    def send(self, recipient: str, message: str) -> None:
        print(f"Sending push notification to {recipient}: {message}")

# Factory
class NotificationFactory:
    @staticmethod
    def create_notification(notification_type: str) -> Notification:
        if notification_type == 'email':
            return EmailNotification()
        elif notification_type == 'sms':
            return SMSNotification()
        elif notification_type == 'push':
            return PushNotification()
        else:
            raise ValueError(f"Unknown notification type: {notification_type}")

# Usage
notification = NotificationFactory.create_notification('email')
notification.send('user@example.com', 'Welcome to our service!')
```

**Benefits**:
- Loose coupling between creator and concrete products
- Single Responsibility Principle (object creation in one place)
- Open/Closed Principle (easy to add new products)

**Trade-offs**:
- Can lead to many small classes
- More complex for simple scenarios

**Real-World Use Case**: Payment processor factory
```typescript
interface PaymentProcessor {
  processPayment(amount: number, currency: string): Promise<boolean>;
}

class StripeProcessor implements PaymentProcessor {
  async processPayment(amount: number, currency: string): Promise<boolean> {
    console.log(`Processing $${amount} via Stripe`);
    // Stripe API integration
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  async processPayment(amount: number, currency: string): Promise<boolean> {
    console.log(`Processing $${amount} via PayPal`);
    // PayPal API integration
    return true;
  }
}

class PaymentProcessorFactory {
  static create(provider: string): PaymentProcessor {
    const processors: Record<string, PaymentProcessor> = {
      stripe: new StripeProcessor(),
      paypal: new PayPalProcessor(),
    };

    if (!processors[provider]) {
      throw new Error(`Unknown payment provider: ${provider}`);
    }

    return processors[provider];
  }
}

// Usage
const processor = PaymentProcessorFactory.create('stripe');
await processor.processPayment(99.99, 'USD');
```

---

### 3. Builder Pattern

**Intent**: Separate the construction of a complex object from its representation, allowing the same construction process to create different representations.

**When to Use**:
- Complex objects with many optional parameters
- Object creation requires multiple steps
- Different representations of the same construction
- Immutable objects with many fields

**Structure**:
```
┌─────────────┐      ┌─────────────┐
│  Director   │─────▶│   Builder   │
└─────────────┘      └──────┬──────┘
                            │
                            │ builds
                            ▼
                     ┌─────────────┐
                     │   Product   │
                     └─────────────┘
```

**TypeScript Implementation**:
```typescript
// Product
class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly age?: number,
    public readonly phoneNumber?: string,
    public readonly address?: string,
    public readonly preferences?: Record<string, any>
  ) {}
}

// Builder
class UserBuilder {
  private id!: string;
  private email!: string;
  private firstName?: string;
  private lastName?: string;
  private age?: number;
  private phoneNumber?: string;
  private address?: string;
  private preferences?: Record<string, any>;

  setId(id: string): UserBuilder {
    this.id = id;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  setFirstName(firstName: string): UserBuilder {
    this.firstName = firstName;
    return this;
  }

  setLastName(lastName: string): UserBuilder {
    this.lastName = lastName;
    return this;
  }

  setAge(age: number): UserBuilder {
    this.age = age;
    return this;
  }

  setPhoneNumber(phoneNumber: string): UserBuilder {
    this.phoneNumber = phoneNumber;
    return this;
  }

  setAddress(address: string): UserBuilder {
    this.address = address;
    return this;
  }

  setPreferences(preferences: Record<string, any>): UserBuilder {
    this.preferences = preferences;
    return this;
  }

  build(): User {
    if (!this.id || !this.email) {
      throw new Error('ID and email are required');
    }

    return new User(
      this.id,
      this.email,
      this.firstName,
      this.lastName,
      this.age,
      this.phoneNumber,
      this.address,
      this.preferences
    );
  }
}

// Usage
const user = new UserBuilder()
  .setId('123')
  .setEmail('john@example.com')
  .setFirstName('John')
  .setLastName('Doe')
  .setAge(30)
  .setPreferences({ theme: 'dark', notifications: true })
  .build();
```

**Python Implementation**:
```python
from typing import Optional, Dict, Any

# Product
class User:
    def __init__(
        self,
        id: str,
        email: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        age: Optional[int] = None,
        phone_number: Optional[str] = None,
        address: Optional[str] = None,
        preferences: Optional[Dict[str, Any]] = None
    ):
        self.id = id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.age = age
        self.phone_number = phone_number
        self.address = address
        self.preferences = preferences or {}

# Builder
class UserBuilder:
    def __init__(self):
        self._id: Optional[str] = None
        self._email: Optional[str] = None
        self._first_name: Optional[str] = None
        self._last_name: Optional[str] = None
        self._age: Optional[int] = None
        self._phone_number: Optional[str] = None
        self._address: Optional[str] = None
        self._preferences: Dict[str, Any] = {}

    def set_id(self, id: str) -> 'UserBuilder':
        self._id = id
        return self

    def set_email(self, email: str) -> 'UserBuilder':
        self._email = email
        return self

    def set_first_name(self, first_name: str) -> 'UserBuilder':
        self._first_name = first_name
        return self

    def set_last_name(self, last_name: str) -> 'UserBuilder':
        self._last_name = last_name
        return self

    def set_age(self, age: int) -> 'UserBuilder':
        self._age = age
        return self

    def set_phone_number(self, phone_number: str) -> 'UserBuilder':
        self._phone_number = phone_number
        return self

    def set_address(self, address: str) -> 'UserBuilder':
        self._address = address
        return self

    def set_preferences(self, preferences: Dict[str, Any]) -> 'UserBuilder':
        self._preferences = preferences
        return self

    def build(self) -> User:
        if not self._id or not self._email:
            raise ValueError('ID and email are required')

        return User(
            id=self._id,
            email=self._email,
            first_name=self._first_name,
            last_name=self._last_name,
            age=self._age,
            phone_number=self._phone_number,
            address=self._address,
            preferences=self._preferences
        )

# Usage
user = (UserBuilder()
    .set_id('123')
    .set_email('john@example.com')
    .set_first_name('John')
    .set_last_name('Doe')
    .set_age(30)
    .set_preferences({'theme': 'dark', 'notifications': True})
    .build())
```

**Benefits**:
- Fluent interface for object construction
- Immutable objects support
- Clear separation of construction and representation
- Step-by-step object creation

**Trade-offs**:
- More verbose than simple constructors
- Duplication between builder and product

**Real-World Use Case**: HTTP request builder
```typescript
class HttpRequest {
  constructor(
    public readonly url: string,
    public readonly method: string,
    public readonly headers: Record<string, string>,
    public readonly body?: any,
    public readonly timeout?: number
  ) {}
}

class HttpRequestBuilder {
  private url!: string;
  private method: string = 'GET';
  private headers: Record<string, string> = {};
  private body?: any;
  private timeout: number = 30000;

  setUrl(url: string): HttpRequestBuilder {
    this.url = url;
    return this;
  }

  setMethod(method: string): HttpRequestBuilder {
    this.method = method;
    return this;
  }

  addHeader(key: string, value: string): HttpRequestBuilder {
    this.headers[key] = value;
    return this;
  }

  setBody(body: any): HttpRequestBuilder {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): HttpRequestBuilder {
    this.timeout = timeout;
    return this;
  }

  build(): HttpRequest {
    if (!this.url) {
      throw new Error('URL is required');
    }
    return new HttpRequest(this.url, this.method, this.headers, this.body, this.timeout);
  }
}

// Usage
const request = new HttpRequestBuilder()
  .setUrl('https://api.example.com/users')
  .setMethod('POST')
  .addHeader('Content-Type', 'application/json')
  .addHeader('Authorization', 'Bearer token123')
  .setBody({ name: 'John Doe' })
  .setTimeout(5000)
  .build();
```

---

### 4. Prototype Pattern

**Intent**: Create new objects by copying existing instances (prototypes).

**When to Use**:
- Object creation is expensive
- Need to avoid creating objects from scratch
- Want to hide complexities of object creation
- System should be independent of how objects are created

**TypeScript Implementation**:
```typescript
interface Prototype {
  clone(): this;
}

class Document implements Prototype {
  constructor(
    public title: string,
    public content: string,
    public metadata: Record<string, any>
  ) {}

  clone(): this {
    // Deep copy
    return new Document(
      this.title,
      this.content,
      JSON.parse(JSON.stringify(this.metadata))
    ) as this;
  }

  display(): void {
    console.log(`Title: ${this.title}`);
    console.log(`Content: ${this.content}`);
    console.log(`Metadata:`, this.metadata);
  }
}

// Usage
const originalDoc = new Document(
  'Report 2024',
  'Annual financial report...',
  { author: 'John Doe', year: 2024 }
);

const copiedDoc = originalDoc.clone();
copiedDoc.title = 'Report 2024 - Copy';
copiedDoc.metadata.author = 'Jane Smith';

originalDoc.display();
copiedDoc.display();
```

**Python Implementation**:
```python
import copy
from typing import Dict, Any

class Document:
    def __init__(self, title: str, content: str, metadata: Dict[str, Any]):
        self.title = title
        self.content = content
        self.metadata = metadata

    def clone(self) -> 'Document':
        # Deep copy
        return copy.deepcopy(self)

    def display(self) -> None:
        print(f"Title: {self.title}")
        print(f"Content: {self.content}")
        print(f"Metadata: {self.metadata}")

# Usage
original_doc = Document(
    'Report 2024',
    'Annual financial report...',
    {'author': 'John Doe', 'year': 2024}
)

copied_doc = original_doc.clone()
copied_doc.title = 'Report 2024 - Copy'
copied_doc.metadata['author'] = 'Jane Smith'

original_doc.display()
copied_doc.display()
```

**Benefits**:
- Reduces object creation overhead
- Simplifies complex object creation
- Runtime object configuration

**Trade-offs**:
- Requires implementing clone method
- Deep vs shallow copy considerations

---

## Structural Patterns

### 5. Adapter Pattern

**Intent**: Convert the interface of a class into another interface clients expect, allowing incompatible interfaces to work together.

**When to Use**:
- Integrating third-party libraries
- Legacy code integration
- Interface incompatibility issues
- Reusing existing classes with incompatible interfaces

**Structure**:
```
┌─────────┐      ┌─────────┐      ┌────────────┐
│ Client  │─────▶│ Adapter │─────▶│  Adaptee   │
└─────────┘      └─────────┘      └────────────┘
```

**TypeScript Implementation**:
```typescript
// Target interface (what client expects)
interface MediaPlayer {
  play(fileName: string): void;
}

// Adaptee (existing incompatible interface)
class AdvancedMediaPlayer {
  playVlc(fileName: string): void {
    console.log(`Playing VLC file: ${fileName}`);
  }

  playMp4(fileName: string): void {
    console.log(`Playing MP4 file: ${fileName}`);
  }
}

// Adapter
class MediaAdapter implements MediaPlayer {
  private advancedPlayer: AdvancedMediaPlayer;

  constructor(private audioType: string) {
    this.advancedPlayer = new AdvancedMediaPlayer();
  }

  play(fileName: string): void {
    if (this.audioType === 'vlc') {
      this.advancedPlayer.playVlc(fileName);
    } else if (this.audioType === 'mp4') {
      this.advancedPlayer.playMp4(fileName);
    }
  }
}

// Client code
class AudioPlayer implements MediaPlayer {
  play(fileName: string): void {
    const fileType = fileName.split('.').pop()?.toLowerCase();

    if (fileType === 'mp3') {
      console.log(`Playing MP3 file: ${fileName}`);
    } else if (fileType === 'vlc' || fileType === 'mp4') {
      const adapter = new MediaAdapter(fileType);
      adapter.play(fileName);
    } else {
      console.log(`Invalid media format: ${fileType}`);
    }
  }
}

// Usage
const player = new AudioPlayer();
player.play('song.mp3');
player.play('video.mp4');
player.play('movie.vlc');
```

**Python Implementation**:
```python
from abc import ABC, abstractmethod

# Target interface
class MediaPlayer(ABC):
    @abstractmethod
    def play(self, file_name: str) -> None:
        pass

# Adaptee
class AdvancedMediaPlayer:
    def play_vlc(self, file_name: str) -> None:
        print(f"Playing VLC file: {file_name}")

    def play_mp4(self, file_name: str) -> None:
        print(f"Playing MP4 file: {file_name}")

# Adapter
class MediaAdapter(MediaPlayer):
    def __init__(self, audio_type: str):
        self.audio_type = audio_type
        self.advanced_player = AdvancedMediaPlayer()

    def play(self, file_name: str) -> None:
        if self.audio_type == 'vlc':
            self.advanced_player.play_vlc(file_name)
        elif self.audio_type == 'mp4':
            self.advanced_player.play_mp4(file_name)

# Client
class AudioPlayer(MediaPlayer):
    def play(self, file_name: str) -> None:
        file_type = file_name.split('.')[-1].lower()

        if file_type == 'mp3':
            print(f"Playing MP3 file: {file_name}")
        elif file_type in ['vlc', 'mp4']:
            adapter = MediaAdapter(file_type)
            adapter.play(file_name)
        else:
            print(f"Invalid media format: {file_type}")

# Usage
player = AudioPlayer()
player.play('song.mp3')
player.play('video.mp4')
player.play('movie.vlc')
```

**Real-World Use Case**: Payment gateway adapter
```typescript
// Target interface
interface PaymentGateway {
  processPayment(amount: number, currency: string): Promise<string>;
}

// Adaptee - Stripe
class StripeAPI {
  async createCharge(amountInCents: number, currency: string): Promise<{ id: string }> {
    // Stripe expects amount in cents
    return { id: `ch_${Date.now()}` };
  }
}

// Adapter for Stripe
class StripeAdapter implements PaymentGateway {
  private stripe: StripeAPI;

  constructor() {
    this.stripe = new StripeAPI();
  }

  async processPayment(amount: number, currency: string): Promise<string> {
    // Convert dollars to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    const result = await this.stripe.createCharge(amountInCents, currency);
    return result.id;
  }
}

// Usage
const gateway: PaymentGateway = new StripeAdapter();
const transactionId = await gateway.processPayment(99.99, 'USD');
```

---

### 6. Decorator Pattern

**Intent**: Attach additional responsibilities to an object dynamically, providing a flexible alternative to subclassing.

**When to Use**:
- Adding responsibilities to objects without affecting other objects
- Responsibilities that can be withdrawn
- Extension by subclassing is impractical

**TypeScript Implementation**:
```typescript
// Component interface
interface Coffee {
  cost(): number;
  description(): string;
}

// Concrete component
class SimpleCoffee implements Coffee {
  cost(): number {
    return 2.0;
  }

  description(): string {
    return 'Simple coffee';
  }
}

// Decorator base class
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract cost(): number;
  abstract description(): string;
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return `${this.coffee.description()}, milk`;
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.2;
  }

  description(): string {
    return `${this.coffee.description()}, sugar`;
  }
}

class WhipDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.7;
  }

  description(): string {
    return `${this.coffee.description()}, whip`;
  }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
coffee = new WhipDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// Output: Simple coffee, milk, sugar, whip: $3.4
```

**Python Implementation**:
```python
from abc import ABC, abstractmethod

# Component interface
class Coffee(ABC):
    @abstractmethod
    def cost(self) -> float:
        pass

    @abstractmethod
    def description(self) -> str:
        pass

# Concrete component
class SimpleCoffee(Coffee):
    def cost(self) -> float:
        return 2.0

    def description(self) -> str:
        return 'Simple coffee'

# Decorator base class
class CoffeeDecorator(Coffee):
    def __init__(self, coffee: Coffee):
        self._coffee = coffee

    @abstractmethod
    def cost(self) -> float:
        pass

    @abstractmethod
    def description(self) -> str:
        pass

# Concrete decorators
class MilkDecorator(CoffeeDecorator):
    def cost(self) -> float:
        return self._coffee.cost() + 0.5

    def description(self) -> str:
        return f"{self._coffee.description()}, milk"

class SugarDecorator(CoffeeDecorator):
    def cost(self) -> float:
        return self._coffee.cost() + 0.2

    def description(self) -> str:
        return f"{self._coffee.description()}, sugar"

# Usage
coffee = SimpleCoffee()
coffee = MilkDecorator(coffee)
coffee = SugarDecorator(coffee)
print(f"{coffee.description()}: ${coffee.cost()}")
```

**Real-World Use Case**: HTTP middleware
```typescript
interface HttpHandler {
  handle(request: Request): Response;
}

class BaseHandler implements HttpHandler {
  handle(request: Request): Response {
    return { status: 200, body: 'Success' };
  }
}

class LoggingDecorator implements HttpHandler {
  constructor(private handler: HttpHandler) {}

  handle(request: Request): Response {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
    const response = this.handler.handle(request);
    console.log(`[${new Date().toISOString()}] Response: ${response.status}`);
    return response;
  }
}

class AuthenticationDecorator implements HttpHandler {
  constructor(private handler: HttpHandler) {}

  handle(request: Request): Response {
    if (!request.headers.authorization) {
      return { status: 401, body: 'Unauthorized' };
    }
    return this.handler.handle(request);
  }
}

// Usage
let handler: HttpHandler = new BaseHandler();
handler = new LoggingDecorator(handler);
handler = new AuthenticationDecorator(handler);

const response = handler.handle({
  method: 'GET',
  url: '/api/users',
  headers: { authorization: 'Bearer token' }
});
```

---

### 7. Proxy Pattern

**Intent**: Provide a surrogate or placeholder for another object to control access to it.

**When to Use**:
- Lazy initialization (virtual proxy)
- Access control (protection proxy)
- Remote object representation (remote proxy)
- Caching (caching proxy)
- Logging and monitoring

**TypeScript Implementation**:
```typescript
interface Image {
  display(): void;
}

// Real subject
class RealImage implements Image {
  constructor(private fileName: string) {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading image from disk: ${this.fileName}`);
    // Simulate expensive operation
  }

  display(): void {
    console.log(`Displaying image: ${this.fileName}`);
  }
}

// Proxy
class ImageProxy implements Image {
  private realImage?: RealImage;

  constructor(private fileName: string) {}

  display(): void {
    // Lazy loading - only create real object when needed
    if (!this.realImage) {
      this.realImage = new RealImage(this.fileName);
    }
    this.realImage.display();
  }
}

// Usage
const image1 = new ImageProxy('photo1.jpg');
const image2 = new ImageProxy('photo2.jpg');

// Images not loaded yet
console.log('Images created');

// Load and display only when needed
image1.display(); // Loads and displays
image1.display(); // Only displays (already loaded)
```

**Real-World Use Case**: API caching proxy
```typescript
interface DataService {
  fetchData(id: string): Promise<any>;
}

class RealDataService implements DataService {
  async fetchData(id: string): Promise<any> {
    console.log(`Fetching data from API: ${id}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, data: 'Some data' };
  }
}

class CachingProxy implements DataService {
  private cache: Map<string, any> = new Map();
  private realService: RealDataService;
  private cacheExpiry: number = 60000; // 1 minute

  constructor() {
    this.realService = new RealDataService();
  }

  async fetchData(id: string): Promise<any> {
    const cached = this.cache.get(id);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`Returning cached data for: ${id}`);
      return cached.data;
    }

    const data = await this.realService.fetchData(id);
    this.cache.set(id, { data, timestamp: Date.now() });
    return data;
  }
}

// Usage
const service = new CachingProxy();
await service.fetchData('user-123'); // Fetches from API
await service.fetchData('user-123'); // Returns from cache
```

---

### 8. Facade Pattern

**Intent**: Provide a unified interface to a set of interfaces in a subsystem, making the subsystem easier to use.

**When to Use**:
- Simplifying complex subsystems
- Layering systems
- Decoupling client from subsystem
- Providing a simple default view

**TypeScript Implementation**:
```typescript
// Complex subsystem classes
class CPU {
  freeze(): void {
    console.log('CPU: Freezing...');
  }

  jump(position: number): void {
    console.log(`CPU: Jumping to position ${position}`);
  }

  execute(): void {
    console.log('CPU: Executing...');
  }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory: Loading data at position ${position}`);
  }
}

class HardDrive {
  read(sector: number, size: number): string {
    console.log(`HardDrive: Reading sector ${sector}, size ${size}`);
    return 'boot data';
  }
}

// Facade
class ComputerFacade {
  private cpu: CPU;
  private memory: Memory;
  private hardDrive: HardDrive;

  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start(): void {
    console.log('Computer starting...');
    this.cpu.freeze();
    this.memory.load(0, this.hardDrive.read(0, 1024));
    this.cpu.jump(0);
    this.cpu.execute();
    console.log('Computer started!');
  }
}

// Usage
const computer = new ComputerFacade();
computer.start(); // Simple interface hides complex subsystem
```

**Real-World Use Case**: Order processing facade
```typescript
class InventorySystem {
  checkStock(productId: string, quantity: number): boolean {
    console.log(`Checking stock for ${productId}`);
    return true;
  }

  reserveStock(productId: string, quantity: number): void {
    console.log(`Reserving ${quantity} units of ${productId}`);
  }
}

class PaymentSystem {
  processPayment(amount: number, method: string): string {
    console.log(`Processing payment: $${amount} via ${method}`);
    return `txn_${Date.now()}`;
  }
}

class ShippingSystem {
  scheduleShipping(orderId: string, address: string): void {
    console.log(`Scheduling shipping for order ${orderId} to ${address}`);
  }
}

class NotificationSystem {
  sendConfirmation(email: string, orderId: string): void {
    console.log(`Sending confirmation to ${email} for order ${orderId}`);
  }
}

// Facade
class OrderFacade {
  private inventory: InventorySystem;
  private payment: PaymentSystem;
  private shipping: ShippingSystem;
  private notification: NotificationSystem;

  constructor() {
    this.inventory = new InventorySystem();
    this.payment = new PaymentSystem();
    this.shipping = new ShippingSystem();
    this.notification = new NotificationSystem();
  }

  placeOrder(
    productId: string,
    quantity: number,
    amount: number,
    paymentMethod: string,
    email: string,
    address: string
  ): string {
    console.log('Processing order...');

    // Check inventory
    if (!this.inventory.checkStock(productId, quantity)) {
      throw new Error('Product out of stock');
    }

    // Reserve stock
    this.inventory.reserveStock(productId, quantity);

    // Process payment
    const transactionId = this.payment.processPayment(amount, paymentMethod);

    // Schedule shipping
    const orderId = `order_${Date.now()}`;
    this.shipping.scheduleShipping(orderId, address);

    // Send confirmation
    this.notification.sendConfirmation(email, orderId);

    console.log('Order processed successfully!');
    return orderId;
  }
}

// Usage - Simple interface for complex process
const orderSystem = new OrderFacade();
const orderId = orderSystem.placeOrder(
  'product-123',
  2,
  49.99,
  'credit-card',
  'customer@example.com',
  '123 Main St'
);
```

---

## Behavioral Patterns

### 9. Strategy Pattern

**Intent**: Define a family of algorithms, encapsulate each one, and make them interchangeable.

**When to Use**:
- Multiple related classes differ only in behavior
- Need different variants of an algorithm
- Algorithm uses data that clients shouldn't know about
- Class has many conditional statements for behavior selection

**TypeScript Implementation**:
```typescript
// Strategy interface
interface SortStrategy {
  sort(data: number[]): number[];
}

// Concrete strategies
class BubbleSortStrategy implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('Sorting using bubble sort');
    const arr = [...data];
    // Bubble sort implementation
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSortStrategy implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('Sorting using quick sort');
    if (data.length <= 1) return data;

    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter(x => x < pivot);
    const middle = data.filter(x => x === pivot);
    const right = data.filter(x => x > pivot);

    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

class MergeSortStrategy implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('Sorting using merge sort');
    if (data.length <= 1) return data;

    const mid = Math.floor(data.length / 2);
    const left = this.sort(data.slice(0, mid));
    const right = this.sort(data.slice(mid));

    return this.merge(left, right);
  }

  private merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
  }
}

// Context
class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

// Usage
const data = [64, 34, 25, 12, 22, 11, 90];

const sorter = new Sorter(new QuickSortStrategy());
console.log(sorter.sort(data));

sorter.setStrategy(new MergeSortStrategy());
console.log(sorter.sort(data));
```

**Real-World Use Case**: Payment strategy
```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardStrategy implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiryDate: string
  ) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using PayPal account ${this.email}`);
  }
}

class CryptoStrategy implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Crypto wallet ${this.walletAddress}`);
  }
}

class ShoppingCart {
  private items: { name: string; price: number }[] = [];
  private paymentStrategy?: PaymentStrategy;

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);

    if (!this.paymentStrategy) {
      throw new Error('Please select a payment method');
    }

    this.paymentStrategy.pay(total);
  }
}

// Usage
const cart = new ShoppingCart();
cart.addItem('Book', 29.99);
cart.addItem('Headphones', 79.99);

cart.setPaymentStrategy(new CreditCardStrategy('1234-5678-9012-3456', '123', '12/25'));
cart.checkout();
```

---

### 10. Observer Pattern

**Intent**: Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

**When to Use**:
- Event handling systems
- Model-View architecture
- Publish-subscribe systems
- Real-time data updates

**TypeScript Implementation**:
```typescript
// Observer interface
interface Observer {
  update(data: any): void;
}

// Subject interface
interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

// Concrete subject
class WeatherStation implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;
  private humidity: number = 0;
  private pressure: number = 0;

  attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
      console.log('Observer attached');
    }
  }

  detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
      console.log('Observer detached');
    }
  }

  notify(): void {
    console.log('Notifying observers...');
    for (const observer of this.observers) {
      observer.update({
        temperature: this.temperature,
        humidity: this.humidity,
        pressure: this.pressure,
      });
    }
  }

  setMeasurements(temperature: number, humidity: number, pressure: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.notify();
  }
}

// Concrete observers
class CurrentConditionsDisplay implements Observer {
  update(data: any): void {
    console.log(
      `Current conditions: ${data.temperature}°C and ${data.humidity}% humidity`
    );
  }
}

class StatisticsDisplay implements Observer {
  private temperatures: number[] = [];

  update(data: any): void {
    this.temperatures.push(data.temperature);
    const avg = this.temperatures.reduce((a, b) => a + b) / this.temperatures.length;
    console.log(`Avg temperature: ${avg.toFixed(1)}°C`);
  }
}

// Usage
const weatherStation = new WeatherStation();

const currentDisplay = new CurrentConditionsDisplay();
const statsDisplay = new StatisticsDisplay();

weatherStation.attach(currentDisplay);
weatherStation.attach(statsDisplay);

weatherStation.setMeasurements(25, 65, 1013);
weatherStation.setMeasurements(27, 70, 1012);

weatherStation.detach(statsDisplay);
weatherStation.setMeasurements(26, 68, 1014);
```

**Real-World Use Case**: Event emitter
```typescript
type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on('user:login', (user) => {
  console.log(`User ${user.name} logged in`);
});

emitter.on('user:login', (user) => {
  console.log(`Sending welcome email to ${user.email}`);
});

emitter.emit('user:login', { name: 'John', email: 'john@example.com' });
```

---

### 11. Command Pattern

**Intent**: Encapsulate a request as an object, allowing parameterization and queuing of requests.

**When to Use**:
- Implementing undo/redo functionality
- Queuing operations
- Logging changes
- Transaction systems

**TypeScript Implementation**:
```typescript
// Command interface
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver
class TextEditor {
  private text: string = '';

  getText(): string {
    return this.text;
  }

  append(text: string): void {
    this.text += text;
  }

  delete(length: number): void {
    this.text = this.text.slice(0, -length);
  }
}

// Concrete commands
class AppendCommand implements Command {
  constructor(
    private editor: TextEditor,
    private text: string
  ) {}

  execute(): void {
    this.editor.append(this.text);
  }

  undo(): void {
    this.editor.delete(this.text.length);
  }
}

class DeleteCommand implements Command {
  private deletedText: string = '';

  constructor(
    private editor: TextEditor,
    private length: number
  ) {}

  execute(): void {
    const text = this.editor.getText();
    this.deletedText = text.slice(-this.length);
    this.editor.delete(this.length);
  }

  undo(): void {
    this.editor.append(this.deletedText);
  }
}

// Invoker
class CommandManager {
  private history: Command[] = [];
  private currentIndex: number = -1;

  execute(command: Command): void {
    // Remove any commands after current index
    this.history = this.history.slice(0, this.currentIndex + 1);

    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }

  undo(): void {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo(): void {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }
}

// Usage
const editor = new TextEditor();
const manager = new CommandManager();

manager.execute(new AppendCommand(editor, 'Hello '));
console.log(editor.getText()); // "Hello "

manager.execute(new AppendCommand(editor, 'World!'));
console.log(editor.getText()); // "Hello World!"

manager.undo();
console.log(editor.getText()); // "Hello "

manager.redo();
console.log(editor.getText()); // "Hello World!"
```

---

### 12. Template Method Pattern

**Intent**: Define the skeleton of an algorithm in a base class, letting subclasses override specific steps.

**When to Use**:
- Common algorithm structure with varying steps
- Controlling extension points
- Avoiding code duplication

**TypeScript Implementation**:
```typescript
abstract class DataProcessor {
  // Template method
  process(): void {
    this.readData();
    this.processData();
    this.validateData();
    this.saveData();
    this.sendNotification();
  }

  protected abstract readData(): void;
  protected abstract processData(): void;
  protected abstract saveData(): void;

  protected validateData(): void {
    console.log('Validating data...');
  }

  protected sendNotification(): void {
    console.log('Sending notification...');
  }
}

class CSVDataProcessor extends DataProcessor {
  protected readData(): void {
    console.log('Reading data from CSV file');
  }

  protected processData(): void {
    console.log('Processing CSV data');
  }

  protected saveData(): void {
    console.log('Saving processed CSV data to database');
  }
}

class JSONDataProcessor extends DataProcessor {
  protected readData(): void {
    console.log('Reading data from JSON file');
  }

  protected processData(): void {
    console.log('Processing JSON data');
  }

  protected saveData(): void {
    console.log('Saving processed JSON data to database');
  }

  // Override hook method
  protected sendNotification(): void {
    console.log('Sending JSON processing notification via webhook');
  }
}

// Usage
const csvProcessor = new CSVDataProcessor();
csvProcessor.process();

const jsonProcessor = new JSONDataProcessor();
jsonProcessor.process();
```

---

## Modern Patterns

### 13. Repository Pattern

**Intent**: Mediate between the domain and data mapping layers, providing a collection-like interface for accessing domain objects.

**TypeScript Implementation**:
```typescript
interface Entity {
  id: string;
}

interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

interface User extends Entity {
  email: string;
  name: string;
}

class UserRepository implements Repository<User> {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      ...userData,
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

// Usage
const userRepo = new UserRepository();
const user = await userRepo.create({ email: 'john@example.com', name: 'John' });
const foundUser = await userRepo.findById(user.id);
```

---

### 14. Unit of Work Pattern

**Intent**: Maintain a list of objects affected by a business transaction and coordinates writing changes.

**TypeScript Implementation**:
```typescript
class UnitOfWork {
  private newEntities: Set<any> = new Set();
  private dirtyEntities: Set<any> = new Set();
  private deletedEntities: Set<any> = new Set();

  registerNew(entity: any): void {
    this.newEntities.add(entity);
  }

  registerDirty(entity: any): void {
    if (!this.newEntities.has(entity)) {
      this.dirtyEntities.add(entity);
    }
  }

  registerDeleted(entity: any): void {
    if (this.newEntities.has(entity)) {
      this.newEntities.delete(entity);
    } else {
      this.dirtyEntities.delete(entity);
      this.deletedEntities.add(entity);
    }
  }

  async commit(): Promise<void> {
    // Insert new entities
    for (const entity of this.newEntities) {
      await this.insert(entity);
    }

    // Update dirty entities
    for (const entity of this.dirtyEntities) {
      await this.update(entity);
    }

    // Delete removed entities
    for (const entity of this.deletedEntities) {
      await this.delete(entity);
    }

    this.clear();
  }

  private async insert(entity: any): Promise<void> {
    console.log('Inserting:', entity);
  }

  private async update(entity: any): Promise<void> {
    console.log('Updating:', entity);
  }

  private async delete(entity: any): Promise<void> {
    console.log('Deleting:', entity);
  }

  private clear(): void {
    this.newEntities.clear();
    this.dirtyEntities.clear();
    this.deletedEntities.clear();
  }
}
```

---

### 15. Dependency Injection Pattern

**Intent**: Achieve Inversion of Control between classes and their dependencies.

**TypeScript Implementation**:
```typescript
// Services
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE] ${message}`);
    // Write to file
  }
}

// Dependency Injection Container
class Container {
  private services: Map<string, any> = new Map();

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }
}

// Service using dependency injection
class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name}`);
    // Create user logic
  }
}

// Usage
const container = new Container();
container.register('logger', new ConsoleLogger());

const logger = container.resolve<Logger>('logger');
const userService = new UserService(logger);
userService.createUser('John Doe');
```

---

## Best Practices

### When to Use Design Patterns
- Recognize recurring problems
- Don't force patterns where they don't fit
- Start simple, refactor to patterns when needed
- Understand trade-offs

### Common Anti-Patterns to Avoid
- God Object (knows/does too much)
- Golden Hammer (using one pattern for everything)
- Premature Optimization
- Copy-Paste Programming

### Testing Patterns
- Use dependency injection for testability
- Mock dependencies in tests
- Test behavior, not implementation

---

## Resources

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns) (Gang of Four)
- [Refactoring.Guru Design Patterns](https://refactoring.guru/design-patterns)
- [TypeScript Design Patterns](https://github.com/torokmark/design_patterns_in_typescript)
- [Python Design Patterns](https://python-patterns.guide/)
- [Martin Fowler's Patterns](https://martinfowler.com/articles/enterprisePatterns.html)
