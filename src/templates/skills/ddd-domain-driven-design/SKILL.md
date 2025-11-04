---
name: Domain-Driven Design
description: Comprehensive guide to implementing Domain-Driven Design patterns including Strategic DDD (Bounded Contexts, Context Maps) and Tactical DDD (Entities, Value Objects, Aggregates, Domain Events) with practical examples.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - ddd
  - domain-driven-design
  - architecture
  - design-patterns
  - eric-evans
  - bounded-context
  - aggregate
  - domain-events
---

# Domain-Driven Design Skill

A comprehensive guide to implementing Domain-Driven Design (DDD) as introduced by Eric Evans. This skill covers both Strategic and Tactical DDD patterns with battle-tested examples.

## When to Use

- Building complex business applications with rich domain logic
- Working on projects where business rules are complex and evolving
- Need clear boundaries between different parts of a large system
- Team needs a common language with domain experts
- Long-term projects that will evolve significantly over time

## When DDD is Overkill

- Simple CRUD applications with minimal business logic
- Prototypes or short-lived projects
- Applications with straightforward data transformations
- Small teams without access to domain experts
- Projects where time-to-market is more critical than domain accuracy

## Strategic DDD: High-Level Design

### 1. Ubiquitous Language

A shared language between developers and domain experts used consistently in code, conversations, and documentation.

**Example: E-commerce Domain**

```typescript
// ❌ Bad: Technical jargon, inconsistent terms
class ShoppingBasket {
  items: Product[];
  calculatePrice(): number { /* ... */ }
}

// ✅ Good: Uses business language consistently
class ShoppingCart {
  lineItems: LineItem[];
  calculateTotal(): Money { /* ... */ }
}

// The term "ShoppingCart" and "LineItem" match what business users say
```

**Key Principles:**
- Use terms from the business domain, not technical terms
- Keep the language consistent across code, docs, and conversations
- Refine the language as understanding deepens
- Challenge ambiguous terms with domain experts

### 2. Bounded Contexts

A bounded context is an explicit boundary within which a domain model exists. Same terms can have different meanings in different contexts.

**Example: E-commerce System**

```typescript
// Catalog Context - focuses on browsing and product information
namespace CatalogContext {
  export class Product {
    id: ProductId;
    name: string;
    description: string;
    price: Money;
    category: Category;
    images: Image[];
    specifications: Specification[];
  }
}

// Order Context - focuses on purchasing
namespace OrderContext {
  export class Product {
    id: ProductId;
    name: string;
    price: Money;
    // Only the data needed for ordering - no images, specs, etc.
  }

  export class Order {
    id: OrderId;
    customerId: CustomerId;
    lineItems: LineItem[];
    shippingAddress: Address;
    status: OrderStatus;

    calculateTotal(): Money { /* ... */ }
    markAsShipped(): void { /* ... */ }
  }
}

// Inventory Context - focuses on stock management
namespace InventoryContext {
  export class Product {
    id: ProductId;
    sku: SKU;
    quantityOnHand: number;
    reorderPoint: number;

    needsReorder(): boolean {
      return this.quantityOnHand <= this.reorderPoint;
    }
  }
}
```

**Benefits:**
- Each context can evolve independently
- Reduces coupling between different parts of the system
- Teams can work on different contexts without conflicts
- Same concept can have different models in different contexts

### 3. Context Maps

Visual representation of how different bounded contexts relate and integrate.

**Relationship Patterns:**

```typescript
// Partnership: Two contexts collaborate closely
// Example: Order Context <-> Payment Context
class Order {
  async confirmPayment(paymentService: PaymentService): Promise<void> {
    const payment = await paymentService.processPayment(this.total);
    this.paymentId = payment.id;
    this.status = OrderStatus.Paid;
  }
}

// Customer-Supplier: Downstream depends on upstream
// Example: Shipping Context depends on Order Context
class ShippingService {
  async createShipment(order: OrderDTO): Promise<Shipment> {
    // Order context is upstream, Shipping is downstream
    return new Shipment({
      orderId: order.id,
      address: order.shippingAddress,
      items: order.lineItems
    });
  }
}

// Anti-Corruption Layer: Protect your model from external systems
// Example: Integrating with legacy inventory system
class LegacyInventoryAdapter {
  async checkStock(productId: ProductId): Promise<number> {
    // Legacy system uses different data format
    const legacyData = await this.legacyApi.getItem(productId.value);

    // ACL translates legacy model to our domain model
    return this.translateQuantity(legacyData.qty_on_hand);
  }

  private translateQuantity(legacyQty: string): number {
    // Legacy system stores quantity as string with "pcs" suffix
    return parseInt(legacyQty.replace(' pcs', ''));
  }
}
```

## Tactical DDD: Building Blocks

### 1. Entities

Objects with a unique identity that persists over time, even if attributes change.

```typescript
// TypeScript Implementation
class CustomerId {
  constructor(private readonly value: string) {
    if (!value || value.length === 0) {
      throw new Error('Customer ID cannot be empty');
    }
  }

  equals(other: CustomerId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

class Customer {
  private constructor(
    private readonly id: CustomerId,
    private name: string,
    private email: Email,
    private readonly createdAt: Date
  ) {}

  static create(name: string, email: string): Customer {
    return new Customer(
      new CustomerId(generateId()),
      name,
      new Email(email),
      new Date()
    );
  }

  // Identity comparison - two customers are the same if IDs match
  equals(other: Customer): boolean {
    return this.id.equals(other.id);
  }

  // Business behavior
  changeName(newName: string): void {
    if (!newName || newName.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    this.name = newName;
  }

  changeEmail(newEmail: string): void {
    this.email = new Email(newEmail); // Email validation in Value Object
  }
}
```

```python
# Python Implementation
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass(frozen=True)
class CustomerId:
    value: str

    def __post_init__(self):
        if not self.value:
            raise ValueError("Customer ID cannot be empty")

    def __str__(self):
        return self.value

class Customer:
    def __init__(
        self,
        id: CustomerId,
        name: str,
        email: 'Email',
        created_at: datetime
    ):
        self._id = id
        self._name = name
        self._email = email
        self._created_at = created_at

    @classmethod
    def create(cls, name: str, email: str) -> 'Customer':
        return cls(
            id=CustomerId(str(uuid.uuid4())),
            name=name,
            email=Email(email),
            created_at=datetime.now()
        )

    @property
    def id(self) -> CustomerId:
        return self._id

    def __eq__(self, other) -> bool:
        if not isinstance(other, Customer):
            return False
        return self._id == other._id

    def __hash__(self):
        return hash(self._id)

    def change_name(self, new_name: str) -> None:
        if not new_name or len(new_name) < 2:
            raise ValueError("Name must be at least 2 characters")
        self._name = new_name

    def change_email(self, new_email: str) -> None:
        self._email = Email(new_email)
```

### 2. Value Objects

Objects defined by their attributes, with no unique identity. Two value objects with the same attributes are considered equal.

```typescript
// TypeScript: Email Value Object
class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(`Invalid email: ${email}`);
    }
    this.value = email.toLowerCase();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

// TypeScript: Money Value Object
class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be 3-letter code (ISO 4217)');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  greaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount > other.amount;
  }
}

// TypeScript: Address Value Object
class Address {
  constructor(
    private readonly street: string,
    private readonly city: string,
    private readonly postalCode: string,
    private readonly country: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.street || !this.city || !this.postalCode || !this.country) {
      throw new Error('All address fields are required');
    }
  }

  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }

  // Value objects can have behavior
  isSameCity(other: Address): boolean {
    return this.city === other.city && this.country === other.country;
  }
}
```

```python
# Python: Value Objects
from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self):
        if not self._is_valid(self.value):
            raise ValueError(f"Invalid email: {self.value}")
        # Normalize email
        object.__setattr__(self, 'value', self.value.lower())

    def _is_valid(self, email: str) -> bool:
        pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return bool(re.match(pattern, email))

    def __str__(self):
        return self.value

@dataclass(frozen=True)
class Money:
    amount: float
    currency: str

    def __post_init__(self):
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")
        if not self.currency or len(self.currency) != 3:
            raise ValueError("Currency must be 3-letter code (ISO 4217)")

    def add(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)

    def multiply(self, multiplier: float) -> 'Money':
        return Money(self.amount * multiplier, self.currency)

    def __gt__(self, other: 'Money') -> bool:
        if self.currency != other.currency:
            raise ValueError("Cannot compare different currencies")
        return self.amount > other.amount

@dataclass(frozen=True)
class Address:
    street: str
    city: str
    postal_code: str
    country: str

    def __post_init__(self):
        if not all([self.street, self.city, self.postal_code, self.country]):
            raise ValueError("All address fields are required")

    def is_same_city(self, other: 'Address') -> bool:
        return self.city == other.city and self.country == other.country
```

### 3. Aggregates

A cluster of entities and value objects with a single root entity. The aggregate root is the only entry point for modifications.

**Complete Example: E-commerce Order Aggregate**

```typescript
// TypeScript Implementation
enum OrderStatus {
  Pending = 'PENDING',
  Paid = 'PAID',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED'
}

class LineItem {
  constructor(
    private readonly productId: ProductId,
    private readonly productName: string,
    private readonly unitPrice: Money,
    private quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
  }

  getTotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  changeQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.quantity = newQuantity;
  }

  getProductId(): ProductId {
    return this.productId;
  }
}

// Order is the Aggregate Root
class Order {
  private lineItems: LineItem[] = [];
  private status: OrderStatus = OrderStatus.Pending;
  private shippingAddress?: Address;

  private constructor(
    private readonly id: OrderId,
    private readonly customerId: CustomerId,
    private readonly createdAt: Date
  ) {}

  static create(customerId: CustomerId): Order {
    return new Order(
      new OrderId(generateId()),
      customerId,
      new Date()
    );
  }

  // Aggregate root controls all modifications
  addLineItem(
    productId: ProductId,
    productName: string,
    unitPrice: Money,
    quantity: number
  ): void {
    if (this.status !== OrderStatus.Pending) {
      throw new Error('Cannot modify order after it has been placed');
    }

    // Check if product already in cart
    const existingItem = this.lineItems.find(
      item => item.getProductId().equals(productId)
    );

    if (existingItem) {
      existingItem.changeQuantity(quantity);
    } else {
      this.lineItems.push(
        new LineItem(productId, productName, unitPrice, quantity)
      );
    }
  }

  removeLineItem(productId: ProductId): void {
    if (this.status !== OrderStatus.Pending) {
      throw new Error('Cannot modify order after it has been placed');
    }

    this.lineItems = this.lineItems.filter(
      item => !item.getProductId().equals(productId)
    );
  }

  setShippingAddress(address: Address): void {
    if (this.status !== OrderStatus.Pending) {
      throw new Error('Cannot change shipping address after order is placed');
    }
    this.shippingAddress = address;
  }

  calculateTotal(): Money {
    if (this.lineItems.length === 0) {
      return new Money(0, 'USD');
    }

    return this.lineItems
      .map(item => item.getTotal())
      .reduce((total, itemTotal) => total.add(itemTotal));
  }

  // State transitions
  markAsPaid(): void {
    if (this.status !== OrderStatus.Pending) {
      throw new Error(`Cannot mark order as paid from status: ${this.status}`);
    }
    if (!this.shippingAddress) {
      throw new Error('Cannot mark as paid without shipping address');
    }
    if (this.lineItems.length === 0) {
      throw new Error('Cannot mark empty order as paid');
    }
    this.status = OrderStatus.Paid;
  }

  markAsShipped(): void {
    if (this.status !== OrderStatus.Paid) {
      throw new Error('Can only ship paid orders');
    }
    this.status = OrderStatus.Shipped;
  }

  markAsDelivered(): void {
    if (this.status !== OrderStatus.Shipped) {
      throw new Error('Can only mark shipped orders as delivered');
    }
    this.status = OrderStatus.Delivered;
  }

  cancel(): void {
    if (this.status === OrderStatus.Shipped || this.status === OrderStatus.Delivered) {
      throw new Error('Cannot cancel shipped or delivered orders');
    }
    this.status = OrderStatus.Cancelled;
  }

  // Aggregate invariants
  isValid(): boolean {
    return (
      this.lineItems.length > 0 &&
      this.shippingAddress !== undefined
    );
  }
}
```

```python
# Python Implementation
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, Optional
import uuid

class OrderStatus(Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class LineItem:
    def __init__(
        self,
        product_id: 'ProductId',
        product_name: str,
        unit_price: Money,
        quantity: int
    ):
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        self._product_id = product_id
        self._product_name = product_name
        self._unit_price = unit_price
        self._quantity = quantity

    def get_total(self) -> Money:
        return self._unit_price.multiply(self._quantity)

    def change_quantity(self, new_quantity: int) -> None:
        if new_quantity <= 0:
            raise ValueError("Quantity must be positive")
        self._quantity = new_quantity

    @property
    def product_id(self) -> 'ProductId':
        return self._product_id

class Order:
    """Order Aggregate Root"""

    def __init__(
        self,
        id: 'OrderId',
        customer_id: 'CustomerId',
        created_at: datetime
    ):
        self._id = id
        self._customer_id = customer_id
        self._created_at = created_at
        self._line_items: List[LineItem] = []
        self._status = OrderStatus.PENDING
        self._shipping_address: Optional[Address] = None

    @classmethod
    def create(cls, customer_id: 'CustomerId') -> 'Order':
        return cls(
            id=OrderId(str(uuid.uuid4())),
            customer_id=customer_id,
            created_at=datetime.now()
        )

    def add_line_item(
        self,
        product_id: 'ProductId',
        product_name: str,
        unit_price: Money,
        quantity: int
    ) -> None:
        if self._status != OrderStatus.PENDING:
            raise ValueError("Cannot modify order after it has been placed")

        # Check if product already in cart
        existing_item = next(
            (item for item in self._line_items
             if item.product_id == product_id),
            None
        )

        if existing_item:
            existing_item.change_quantity(quantity)
        else:
            self._line_items.append(
                LineItem(product_id, product_name, unit_price, quantity)
            )

    def remove_line_item(self, product_id: 'ProductId') -> None:
        if self._status != OrderStatus.PENDING:
            raise ValueError("Cannot modify order after it has been placed")

        self._line_items = [
            item for item in self._line_items
            if item.product_id != product_id
        ]

    def set_shipping_address(self, address: Address) -> None:
        if self._status != OrderStatus.PENDING:
            raise ValueError("Cannot change shipping address after order is placed")
        self._shipping_address = address

    def calculate_total(self) -> Money:
        if not self._line_items:
            return Money(0, "USD")

        totals = [item.get_total() for item in self._line_items]
        return sum(totals[1:], totals[0])

    def mark_as_paid(self) -> None:
        if self._status != OrderStatus.PENDING:
            raise ValueError(f"Cannot mark order as paid from status: {self._status}")
        if not self._shipping_address:
            raise ValueError("Cannot mark as paid without shipping address")
        if not self._line_items:
            raise ValueError("Cannot mark empty order as paid")
        self._status = OrderStatus.PAID

    def mark_as_shipped(self) -> None:
        if self._status != OrderStatus.PAID:
            raise ValueError("Can only ship paid orders")
        self._status = OrderStatus.SHIPPED

    def mark_as_delivered(self) -> None:
        if self._status != OrderStatus.SHIPPED:
            raise ValueError("Can only mark shipped orders as delivered")
        self._status = OrderStatus.DELIVERED

    def cancel(self) -> None:
        if self._status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
            raise ValueError("Cannot cancel shipped or delivered orders")
        self._status = OrderStatus.CANCELLED
```

### 4. Domain Events

Events that represent something meaningful that happened in the domain.

```typescript
// TypeScript: Domain Events
interface DomainEvent {
  occurredAt: Date;
  aggregateId: string;
}

class OrderPlacedEvent implements DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly total: Money,
    public readonly occurredAt: Date = new Date()
  ) {}

  get aggregateId(): string {
    return this.orderId;
  }
}

class OrderShippedEvent implements DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly trackingNumber: string,
    public readonly occurredAt: Date = new Date()
  ) {}

  get aggregateId(): string {
    return this.orderId;
  }
}

// Enhanced Order with Events
class OrderWithEvents {
  private domainEvents: DomainEvent[] = [];

  markAsPaid(): void {
    // ... validation logic ...
    this.status = OrderStatus.Paid;

    // Raise domain event
    this.domainEvents.push(
      new OrderPlacedEvent(
        this.id.toString(),
        this.customerId.toString(),
        this.calculateTotal()
      )
    );
  }

  markAsShipped(trackingNumber: string): void {
    // ... validation logic ...
    this.status = OrderStatus.Shipped;

    this.domainEvents.push(
      new OrderShippedEvent(
        this.id.toString(),
        trackingNumber
      )
    );
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
```

```python
# Python: Domain Events
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List

@dataclass
class DomainEvent(ABC):
    occurred_at: datetime = field(default_factory=datetime.now)

    @property
    @abstractmethod
    def aggregate_id(self) -> str:
        pass

@dataclass
class OrderPlacedEvent(DomainEvent):
    order_id: str
    customer_id: str
    total: Money

    @property
    def aggregate_id(self) -> str:
        return self.order_id

@dataclass
class OrderShippedEvent(DomainEvent):
    order_id: str
    tracking_number: str

    @property
    def aggregate_id(self) -> str:
        return self.order_id

class OrderWithEvents(Order):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._domain_events: List[DomainEvent] = []

    def mark_as_paid(self) -> None:
        super().mark_as_paid()

        self._domain_events.append(
            OrderPlacedEvent(
                order_id=str(self._id),
                customer_id=str(self._customer_id),
                total=self.calculate_total()
            )
        )

    def mark_as_shipped(self, tracking_number: str) -> None:
        super().mark_as_shipped()

        self._domain_events.append(
            OrderShippedEvent(
                order_id=str(self._id),
                tracking_number=tracking_number
            )
        )

    def get_domain_events(self) -> List[DomainEvent]:
        return self._domain_events.copy()

    def clear_domain_events(self) -> None:
        self._domain_events.clear()
```

### 5. Repositories

Abstraction for accessing and persisting aggregates. Only aggregate roots have repositories.

```typescript
// TypeScript: Repository Pattern
interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  findByCustomerId(customerId: CustomerId): Promise<Order[]>;
  save(order: Order): Promise<void>;
  delete(id: OrderId): Promise<void>;
}

// In-Memory Implementation (for testing)
class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.toString()) || null;
  }

  async findByCustomerId(customerId: CustomerId): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.customerId.equals(customerId)
    );
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id.toString(), order);
  }

  async delete(id: OrderId): Promise<void> {
    this.orders.delete(id.toString());
  }
}

// Database Implementation (PostgreSQL with Prisma)
class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: OrderId): Promise<Order | null> {
    const data = await this.prisma.order.findUnique({
      where: { id: id.toString() },
      include: { lineItems: true }
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async save(order: Order): Promise<void> {
    const data = this.toPersistence(order);

    await this.prisma.order.upsert({
      where: { id: data.id },
      create: data,
      update: data
    });

    // Publish domain events after successful save
    const events = order.getDomainEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
    order.clearDomainEvents();
  }

  private toDomain(data: any): Order {
    // Map database model to domain model
    const order = Order.reconstitute(
      new OrderId(data.id),
      new CustomerId(data.customerId),
      data.status,
      data.createdAt
    );

    for (const item of data.lineItems) {
      order.addLineItem(
        new ProductId(item.productId),
        item.productName,
        new Money(item.unitPrice, item.currency),
        item.quantity
      );
    }

    return order;
  }

  private toPersistence(order: Order): any {
    // Map domain model to database model
    return {
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      status: order.status,
      // ... more fields
    };
  }
}
```

### 6. Domain Services vs Application Services

**Domain Service**: Business logic that doesn't naturally fit in an entity or value object.

```typescript
// TypeScript: Domain Service
class PricingService {
  calculateOrderDiscount(
    order: Order,
    customer: Customer,
    campaign: Campaign
  ): Money {
    // Complex pricing logic involving multiple aggregates
    let discount = new Money(0, 'USD');

    // Premium customers get 10% off
    if (customer.isPremium()) {
      discount = discount.add(
        order.calculateTotal().multiply(0.1)
      );
    }

    // Campaign discounts
    if (campaign.isActive() && campaign.appliesTo(order)) {
      discount = discount.add(campaign.calculateDiscount(order));
    }

    return discount;
  }
}
```

**Application Service**: Orchestrates use cases, coordinates between different aggregates.

```typescript
// TypeScript: Application Service
class PlaceOrderService {
  constructor(
    private orderRepo: OrderRepository,
    private inventoryService: InventoryService,
    private paymentService: PaymentService,
    private eventBus: EventBus
  ) {}

  async execute(command: PlaceOrderCommand): Promise<OrderId> {
    // 1. Load aggregate
    const order = await this.orderRepo.findById(command.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // 2. Check inventory (different bounded context)
    for (const item of order.lineItems) {
      const available = await this.inventoryService.checkStock(item.productId);
      if (!available) {
        throw new Error(`Product ${item.productId} out of stock`);
      }
    }

    // 3. Process payment (different bounded context)
    const payment = await this.paymentService.charge(
      order.customerId,
      order.calculateTotal()
    );

    // 4. Update aggregate
    order.markAsPaid();

    // 5. Save (events are published in repository)
    await this.orderRepo.save(order);

    // 6. Reserve inventory
    await this.inventoryService.reserve(order.lineItems);

    return order.id;
  }
}
```

## Anemic vs Rich Domain Models

### Anemic Domain Model (Anti-pattern)

```typescript
// ❌ Anemic: Just data, no behavior
class Order {
  id: string;
  customerId: string;
  items: LineItem[];
  status: string;
  total: number;
}

// Logic is in services, not in domain
class OrderService {
  placeOrder(order: Order): void {
    // Validation
    if (order.items.length === 0) {
      throw new Error('Order must have items');
    }

    // Business logic
    order.total = order.items.reduce((sum, item) => sum + item.price, 0);
    order.status = 'PLACED';

    // Save
    this.repository.save(order);
  }
}
```

### Rich Domain Model (DDD Approach)

```typescript
// ✅ Rich: Behavior is in the domain
class Order {
  private constructor(
    private readonly id: OrderId,
    private lineItems: LineItem[],
    private status: OrderStatus
  ) {}

  // Factory method
  static create(customerId: CustomerId): Order {
    return new Order(
      OrderId.generate(),
      [],
      OrderStatus.Draft
    );
  }

  // Business behavior
  addItem(product: Product, quantity: number): void {
    if (this.status !== OrderStatus.Draft) {
      throw new Error('Cannot modify placed order');
    }
    this.lineItems.push(LineItem.create(product, quantity));
  }

  place(): void {
    if (this.lineItems.length === 0) {
      throw new Error('Cannot place empty order');
    }
    if (this.status !== OrderStatus.Draft) {
      throw new Error('Order already placed');
    }
    this.status = OrderStatus.Placed;
  }

  calculateTotal(): Money {
    return this.lineItems
      .map(item => item.getTotal())
      .reduce((a, b) => a.add(b));
  }
}

// Service only orchestrates
class PlaceOrderService {
  async execute(orderId: OrderId): Promise<void> {
    const order = await this.repository.findById(orderId);
    order.place(); // Domain handles validation and state transition
    await this.repository.save(order);
  }
}
```

## Event Sourcing Basics

Instead of storing current state, store all events that led to that state.

```typescript
// Event Sourcing Example
interface OrderEvent {
  aggregateId: string;
  version: number;
  occurredAt: Date;
}

class OrderCreatedEvent implements OrderEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly customerId: string,
    public readonly version: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}

class ItemAddedEvent implements OrderEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly version: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}

class EventSourcedOrder {
  private id!: OrderId;
  private customerId!: CustomerId;
  private lineItems: Map<string, number> = new Map();
  private version = 0;

  // Rebuild state from events
  static fromEvents(events: OrderEvent[]): EventSourcedOrder {
    const order = new EventSourcedOrder();
    for (const event of events) {
      order.apply(event);
    }
    return order;
  }

  private apply(event: OrderEvent): void {
    if (event instanceof OrderCreatedEvent) {
      this.id = new OrderId(event.aggregateId);
      this.customerId = new CustomerId(event.customerId);
      this.version = event.version;
    } else if (event instanceof ItemAddedEvent) {
      this.lineItems.set(event.productId, event.quantity);
      this.version = event.version;
    }
    // ... handle other events
  }
}
```

## Best Practices

1. **Start with Ubiquitous Language**: Before writing code, establish clear terminology with domain experts
2. **Identify Bounded Contexts Early**: Don't try to create one model for everything
3. **Protect Aggregate Invariants**: All modifications must go through the aggregate root
4. **Keep Aggregates Small**: Large aggregates are hard to maintain and cause performance issues
5. **Use Value Objects Liberally**: They make code safer and more expressive
6. **Don't Over-Engineer**: Apply DDD patterns where they add value, not everywhere

## Common Pitfalls

- **Too Large Aggregates**: Keep aggregates focused; split if they grow too large
- **Anemic Domain Models**: Putting all logic in services defeats the purpose of DDD
- **Ignoring Bounded Contexts**: Trying to create one universal model leads to complexity
- **Premature Abstraction**: Start simple, refactor towards patterns as understanding deepens
- **Repository for Every Entity**: Only aggregate roots should have repositories

## References

- **Domain-Driven Design** by Eric Evans (2003) - The original blue book
- **Implementing Domain-Driven Design** by Vaughn Vernon (2013) - Practical implementation guide
- **Domain-Driven Design Distilled** by Vaughn Vernon (2016) - Quick overview
- [DDD Community](https://github.com/ddd-crew) - Patterns and practices
- [Awesome DDD](https://github.com/heynickc/awesome-ddd) - Curated resources
