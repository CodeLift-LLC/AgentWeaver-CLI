---
name: Database Transactions
description: Comprehensive guide to ACID transactions, isolation levels, concurrency control, deadlock prevention, and transaction patterns for PostgreSQL, MySQL, and modern ORMs.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - WebFetch
tags:
  - database
  - transactions
  - acid
  - concurrency
  - isolation
mcp-servers:
  - socket
  - context7
---

# Database Transactions Skill

Master database transactions to ensure data consistency, handle concurrent operations safely, and implement reliable multi-step operations across PostgreSQL, MySQL, and popular ORMs.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Identify operations requiring transactions, choose appropriate isolation level, implement transaction boundaries, handle rollback scenarios, test for race conditions and deadlocks.

**Additional tools available**:
- Use Socket MCP to scan ORM/database library dependencies
- Use Context7 MCP for transaction pattern documentation

## When to Use

- Multiple database operations that must complete together
- Ensuring data consistency across related tables
- Handling concurrent user operations
- Implementing financial transactions or inventory management
- Rolling back changes on error
- Preventing race conditions and data corruption

## ACID Properties

### Atomicity
**All or nothing**: Either all operations complete successfully or none do

```sql
BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- Both updates succeed or both are rolled back
```

### Consistency
**Valid state**: Database moves from one valid state to another

```sql
-- Constraint ensures consistency
ALTER TABLE accounts ADD CONSTRAINT check_positive_balance
    CHECK (balance >= 0);

BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
    -- If balance goes negative, transaction fails
COMMIT;
```

### Isolation
**Concurrent transactions**: Transactions don't interfere with each other

```sql
-- Transaction 1
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SELECT balance FROM accounts WHERE id = 1;  -- Reads 100
    UPDATE accounts SET balance = balance - 50 WHERE id = 1;
COMMIT;

-- Transaction 2 (concurrent)
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SELECT balance FROM accounts WHERE id = 1;  -- Also reads 100
    UPDATE accounts SET balance = balance - 30 WHERE id = 1;
COMMIT;
-- One transaction will fail due to serialization conflict
```

### Durability
**Permanent changes**: Committed transactions survive system failures

```sql
COMMIT;
-- Changes are now permanent, even if server crashes
```

## Isolation Levels

### 1. READ UNCOMMITTED (Lowest Isolation)

**Allows**: Dirty reads, non-repeatable reads, phantom reads

```sql
-- PostgreSQL doesn't support READ UNCOMMITTED (uses READ COMMITTED instead)

-- MySQL
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
START TRANSACTION;
    SELECT * FROM accounts WHERE id = 1;
    -- Can see uncommitted changes from other transactions!
COMMIT;
```

**Use case**: Analytics queries where approximate data is acceptable
**Avoid**: Production applications with data integrity requirements

### 2. READ COMMITTED (PostgreSQL Default)

**Allows**: Non-repeatable reads, phantom reads
**Prevents**: Dirty reads

```sql
-- PostgreSQL
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
    SELECT balance FROM accounts WHERE id = 1;  -- Reads 100

    -- Another transaction commits: UPDATE accounts SET balance = 200 WHERE id = 1;

    SELECT balance FROM accounts WHERE id = 1;  -- Reads 200 (non-repeatable!)
COMMIT;
```

**Example Problem:**
```sql
-- Transaction 1: Process refund
BEGIN;
    SELECT balance FROM accounts WHERE id = 1;  -- 100
    -- Do some calculations...
    UPDATE accounts SET balance = 150 WHERE id = 1;  -- Based on old read
COMMIT;

-- Transaction 2: Concurrent deposit
BEGIN;
    UPDATE accounts SET balance = balance + 50 WHERE id = 1;  -- 100 -> 150
COMMIT;
-- Lost update! Final balance should be 200, but it's 150
```

**Solution**: Use locking or higher isolation level

### 3. REPEATABLE READ (MySQL Default)

**Allows**: Phantom reads
**Prevents**: Dirty reads, non-repeatable reads

```sql
-- PostgreSQL & MySQL
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    SELECT balance FROM accounts WHERE id = 1;  -- Reads 100

    -- Another transaction commits: UPDATE accounts SET balance = 200 WHERE id = 1;

    SELECT balance FROM accounts WHERE id = 1;  -- Still reads 100 (consistent!)
COMMIT;
```

**PostgreSQL Behavior:**
```sql
-- PostgreSQL REPEATABLE READ prevents phantom reads too!
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    SELECT COUNT(*) FROM orders WHERE status = 'pending';  -- 10

    -- Another transaction: INSERT INTO orders (status) VALUES ('pending');

    SELECT COUNT(*) FROM orders WHERE status = 'pending';  -- Still 10
COMMIT;
```

**MySQL Behavior:**
```sql
-- MySQL REPEATABLE READ allows phantom reads
START TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    SELECT COUNT(*) FROM orders WHERE status = 'pending';  -- 10

    -- Another transaction: INSERT INTO orders (status) VALUES ('pending');

    SELECT COUNT(*) FROM orders WHERE status = 'pending';  -- 11 (phantom!)
COMMIT;
```

### 4. SERIALIZABLE (Highest Isolation)

**Prevents**: All concurrency anomalies
**Trade-off**: Lower concurrency, potential for serialization failures

```sql
-- PostgreSQL
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SELECT * FROM accounts WHERE balance > 0;
    -- Any concurrent transaction modifying these rows will cause conflict
COMMIT;
-- May fail with: ERROR: could not serialize access due to concurrent update
```

**Use case**: Critical financial operations, inventory management

## Transaction Patterns

### 1. Basic Transaction (SQL)

**PostgreSQL:**
```sql
BEGIN;
    INSERT INTO orders (user_id, total) VALUES (1, 99.99);
    INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (currval('orders_id_seq'), 101, 2);
    UPDATE inventory SET quantity = quantity - 2 WHERE product_id = 101;
COMMIT;
```

**MySQL:**
```sql
START TRANSACTION;
    INSERT INTO orders (user_id, total) VALUES (1, 99.99);
    SET @order_id = LAST_INSERT_ID();
    INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (@order_id, 101, 2);
    UPDATE inventory SET quantity = quantity - 2 WHERE product_id = 101;
COMMIT;
```

### 2. Transaction with Error Handling

```sql
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;

    -- Check if balance is sufficient
    DO $$
    DECLARE
        current_balance DECIMAL;
    BEGIN
        SELECT balance INTO current_balance FROM accounts WHERE id = 1;
        IF current_balance < 0 THEN
            RAISE EXCEPTION 'Insufficient funds';
        END IF;
    END $$;

    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- Automatically rolls back on error
```

### 3. Savepoints

```sql
BEGIN;
    INSERT INTO users (name) VALUES ('Alice');

    SAVEPOINT after_user_insert;

    INSERT INTO profiles (user_id, bio) VALUES (1, 'Bio here');
    -- Error occurs

    ROLLBACK TO SAVEPOINT after_user_insert;
    -- User insert preserved, profile insert rolled back

    INSERT INTO profiles (user_id, bio) VALUES (1, 'Corrected bio');
COMMIT;
```

### 4. ORM Transactions

#### Prisma
```typescript
// Basic transaction
await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
        data: { email: 'user@example.com' },
    });

    await tx.profile.create({
        data: {
            userId: user.id,
            bio: 'User bio',
        },
    });
});

// With isolation level (PostgreSQL)
await prisma.$transaction(
    async (tx) => {
        await tx.account.update({
            where: { id: 1 },
            data: { balance: { decrement: 100 } },
        });

        await tx.account.update({
            where: { id: 2 },
            data: { balance: { increment: 100 } },
        });
    },
    {
        isolationLevel: 'Serializable',
        maxWait: 5000,
        timeout: 10000,
    }
);

// Interactive transactions
const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUnique({ where: { id: 1 } });

    if (account.balance < 100) {
        throw new Error('Insufficient funds');
    }

    return await tx.account.update({
        where: { id: 1 },
        data: { balance: account.balance - 100 },
    });
});
```

#### TypeORM
```typescript
// QueryRunner transactions
const queryRunner = dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
    const user = await queryRunner.manager.save(User, {
        email: 'user@example.com',
    });

    await queryRunner.manager.save(Profile, {
        userId: user.id,
        bio: 'User bio',
    });

    await queryRunner.commitTransaction();
} catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
} finally {
    await queryRunner.release();
}

// Transaction decorator
@Transaction()
async createUserWithProfile(
    @TransactionManager() manager: EntityManager,
    email: string,
    bio: string
) {
    const user = await manager.save(User, { email });
    await manager.save(Profile, { userId: user.id, bio });
    return user;
}

// With isolation level
await queryRunner.startTransaction('SERIALIZABLE');
```

#### Sequelize
```typescript
// Managed transaction
await sequelize.transaction(async (t) => {
    const user = await User.create({
        email: 'user@example.com'
    }, { transaction: t });

    await Profile.create({
        userId: user.id,
        bio: 'User bio'
    }, { transaction: t });
});

// With isolation level
await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
}, async (t) => {
    // Transaction code
});

// Unmanaged transaction
const t = await sequelize.transaction();
try {
    await User.create({ email: 'user@example.com' }, { transaction: t });
    await Profile.create({ userId: 1, bio: 'Bio' }, { transaction: t });
    await t.commit();
} catch (error) {
    await t.rollback();
    throw error;
}
```

#### SQLAlchemy (Python)
```python
from sqlalchemy.orm import Session

# Context manager
with Session(engine) as session:
    session.begin()
    try:
        user = User(email='user@example.com')
        session.add(user)
        session.flush()  # Get user.id

        profile = Profile(user_id=user.id, bio='User bio')
        session.add(profile)

        session.commit()
    except Exception:
        session.rollback()
        raise

# With isolation level
from sqlalchemy import create_engine
engine = create_engine(
    'postgresql://user:pass@localhost/db',
    isolation_level='SERIALIZABLE'
)
```

## Locking Strategies

### 1. Optimistic Locking (Version-Based)

```sql
-- Add version column
ALTER TABLE accounts ADD COLUMN version INTEGER DEFAULT 0;

-- Update with version check
UPDATE accounts
SET balance = balance - 100, version = version + 1
WHERE id = 1 AND version = 5;

-- Check affected rows
-- If 0 rows updated, version mismatch (concurrent update occurred)
```

**ORM Example (Prisma):**
```typescript
// Schema
model Account {
  id      Int @id @default(autoincrement())
  balance Int
  version Int @default(0)
}

// Application code
const account = await prisma.account.findUnique({ where: { id: 1 } });

try {
    await prisma.account.update({
        where: {
            id: 1,
            version: account.version,  // Optimistic lock
        },
        data: {
            balance: account.balance - 100,
            version: { increment: 1 },
        },
    });
} catch (error) {
    // Version mismatch - retry or handle conflict
    throw new Error('Account was modified by another transaction');
}
```

### 2. Pessimistic Locking (Row-Level Locks)

**FOR UPDATE (Exclusive Lock):**
```sql
BEGIN;
    -- Lock row for update
    SELECT * FROM accounts WHERE id = 1 FOR UPDATE;

    -- Other transactions trying to lock this row will wait
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

**FOR UPDATE NOWAIT:**
```sql
BEGIN;
    SELECT * FROM accounts WHERE id = 1 FOR UPDATE NOWAIT;
    -- Fails immediately if row is locked, instead of waiting
COMMIT;
```

**FOR UPDATE SKIP LOCKED:**
```sql
-- Queue processing: Skip locked rows
SELECT * FROM tasks
WHERE status = 'pending'
ORDER BY created_at
LIMIT 10
FOR UPDATE SKIP LOCKED;

-- Each worker gets different rows, no blocking
```

**FOR SHARE (Shared Lock):**
```sql
BEGIN;
    -- Allow concurrent reads, prevent writes
    SELECT * FROM accounts WHERE id = 1 FOR SHARE;

    -- Other transactions can also read
    -- But cannot UPDATE until this transaction completes
COMMIT;
```

**ORM Example (TypeORM):**
```typescript
await dataSource.transaction(async (manager) => {
    // Pessimistic write lock
    const account = await manager.findOne(Account, {
        where: { id: 1 },
        lock: { mode: 'pessimistic_write' },
    });

    account.balance -= 100;
    await manager.save(account);
});

// Pessimistic read lock
const account = await manager.findOne(Account, {
    where: { id: 1 },
    lock: { mode: 'pessimistic_read' },
});
```

### 3. Advisory Locks (PostgreSQL)

```sql
-- Session-level advisory lock
SELECT pg_advisory_lock(123456789);
-- Do critical work
SELECT pg_advisory_unlock(123456789);

-- Transaction-level advisory lock
BEGIN;
    SELECT pg_advisory_xact_lock(123456789);
    -- Lock automatically released on commit/rollback
COMMIT;

-- Try lock (non-blocking)
SELECT pg_try_advisory_lock(123456789);
-- Returns true if acquired, false if already locked
```

**Use case**: Application-level locking, job processing

```typescript
// Ensure only one instance processes a job
async function processJobWithLock(jobId: number) {
    const result = await prisma.$queryRaw`
        SELECT pg_try_advisory_lock(${jobId}) as acquired
    `;

    if (!result[0].acquired) {
        console.log('Job already being processed');
        return;
    }

    try {
        await processJob(jobId);
    } finally {
        await prisma.$queryRaw`
            SELECT pg_advisory_unlock(${jobId})
        `;
    }
}
```

## Deadlock Prevention

### What is a Deadlock?

```sql
-- Transaction 1
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Locks row 1
    -- Wait...
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Needs row 2
COMMIT;

-- Transaction 2 (concurrent)
BEGIN;
    UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- Locks row 2
    -- Wait...
    UPDATE accounts SET balance = balance + 50 WHERE id = 1;   -- Needs row 1
COMMIT;

-- DEADLOCK! Transaction 1 waits for Transaction 2, and vice versa
```

### Prevention Strategies

#### 1. Consistent Ordering
```sql
-- ✅ Good: Always lock in same order (by ID)
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Lower ID first
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Higher ID next
COMMIT;
```

#### 2. Lock Timeout
```sql
-- PostgreSQL
SET lock_timeout = '5s';

BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    -- If lock not acquired in 5 seconds, transaction fails
COMMIT;
```

#### 3. Retry Logic
```typescript
async function transferWithRetry(fromId: number, toId: number, amount: number) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            await prisma.$transaction(async (tx) => {
                // Lock in consistent order
                const [fromAccount, toAccount] = await Promise.all([
                    tx.account.findUnique({
                        where: { id: Math.min(fromId, toId) },
                    }),
                    tx.account.findUnique({
                        where: { id: Math.max(fromId, toId) },
                    }),
                ]);

                await tx.account.update({
                    where: { id: fromId },
                    data: { balance: { decrement: amount } },
                });

                await tx.account.update({
                    where: { id: toId },
                    data: { balance: { increment: amount } },
                });
            });

            return; // Success
        } catch (error) {
            if (error.code === '40P01') { // Deadlock detected
                attempt++;
                await sleep(100 * attempt); // Exponential backoff
            } else {
                throw error;
            }
        }
    }

    throw new Error('Transaction failed after retries');
}
```

## Best Practices

### 1. Keep Transactions Short
```typescript
// ❌ Bad: Long-running transaction
await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    await sendEmail(user.email);  // External API call!
    await tx.profile.create({ data: profileData });
});

// ✅ Good: Short transaction
const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    await tx.profile.create({ data: profileData });
    return user;
});
await sendEmail(user.email);  // After transaction
```

### 2. Use Appropriate Isolation Level
```typescript
// Read-only reporting query
await prisma.$transaction(
    async (tx) => {
        const stats = await tx.order.aggregate({ _sum: { total: true } });
        return stats;
    },
    { isolationLevel: 'ReadCommitted' }  // Sufficient for reads
);

// Critical financial transaction
await prisma.$transaction(
    async (tx) => {
        await transferMoney(fromId, toId, amount);
    },
    { isolationLevel: 'Serializable' }  // Highest safety
);
```

### 3. Handle Errors Gracefully
```typescript
try {
    await prisma.$transaction(async (tx) => {
        // Transaction operations
    });
} catch (error) {
    if (error.code === '40001') {
        // Serialization failure - retry
        return retryTransaction();
    } else if (error.code === '23505') {
        // Unique constraint violation
        throw new Error('Duplicate record');
    } else {
        // Unknown error
        throw error;
    }
}
```

### 4. Test Concurrent Scenarios
```typescript
// Test concurrent withdrawals
test('concurrent withdrawals should maintain consistency', async () => {
    const accountId = 1;
    await prisma.account.create({ data: { id: accountId, balance: 1000 } });

    // Simulate 10 concurrent withdrawals of 100 each
    await Promise.all(
        Array.from({ length: 10 }, () =>
            withdraw(accountId, 100)
        )
    );

    const account = await prisma.account.findUnique({ where: { id: accountId } });
    expect(account.balance).toBe(0);  // Should be exactly 0, not negative
});
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to Commit
```sql
BEGIN;
    UPDATE accounts SET balance = 100 WHERE id = 1;
-- Oops, forgot COMMIT!
-- Transaction stays open, holding locks
```

### ❌ Pitfall 2: Nested Transactions (Not Supported)
```typescript
// ❌ Bad: Nested transactions don't work as expected
await prisma.$transaction(async (tx1) => {
    await tx1.user.create({ data: userData });

    await prisma.$transaction(async (tx2) => {
        // This creates a separate transaction, not a nested one!
        await tx2.profile.create({ data: profileData });
    });
});

// ✅ Good: Use savepoints or flatten operations
await prisma.$transaction(async (tx) => {
    await tx.user.create({ data: userData });
    await tx.profile.create({ data: profileData });
});
```

### ❌ Pitfall 3: Transaction in Loop
```typescript
// ❌ Bad: Transaction per iteration
for (const user of users) {
    await prisma.$transaction(async (tx) => {
        await tx.user.update({ where: { id: user.id }, data: { active: true } });
    });
}

// ✅ Good: Single transaction for all
await prisma.$transaction(async (tx) => {
    for (const user of users) {
        await tx.user.update({ where: { id: user.id }, data: { active: true } });
    }
});

// ✅ Best: Batch update
await prisma.user.updateMany({
    where: { id: { in: users.map(u => u.id) } },
    data: { active: true },
});
```

## References

- [PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [MySQL InnoDB Locking](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html)
- [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Database Reliability Engineering](https://www.oreilly.com/library/view/database-reliability-engineering/9781491925935/)
