---
name: Database Indexes
description: Comprehensive guide to database indexing strategies, index types, performance optimization, and query analysis for PostgreSQL, MySQL, and other relational databases.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
tags:
  - database
  - indexes
  - performance
  - optimization
  - queries
---

# Database Indexes Skill

Master database indexing to dramatically improve query performance, understand index types, and learn when (and when not) to create indexes.

## When to Use

- Queries running slower than expected
- Full table scans detected in query plans
- Columns frequently used in WHERE, JOIN, ORDER BY clauses
- Unique constraints needed
- Full-text search requirements
- Optimizing database read performance

## Index Fundamentals

### What is an Index?

An index is a data structure that improves the speed of data retrieval operations at the cost of additional writes and storage space.

**Without Index (Sequential Scan):**
```
Searching 1,000,000 rows: ~1000ms
Time Complexity: O(n)
```

**With Index (Index Scan):**
```
Searching 1,000,000 rows: ~5ms
Time Complexity: O(log n)
```

### Index Types

#### 1. B-Tree Index (Default)

**Best for**: Equality and range queries, most common use case

```sql
-- PostgreSQL & MySQL
CREATE INDEX idx_users_email ON users(email);

-- Supports:
WHERE email = 'user@example.com'
WHERE age > 25
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY email
```

**Structure:**
```
Root Node
├── Internal Node (1-1000)
│   ├── Leaf: Row Pointers
│   └── Leaf: Row Pointers
└── Internal Node (1001-2000)
    ├── Leaf: Row Pointers
    └── Leaf: Row Pointers
```

#### 2. Hash Index

**Best for**: Exact match lookups (PostgreSQL 10+)

```sql
-- PostgreSQL
CREATE INDEX idx_users_id_hash ON users USING HASH(id);

-- Supports:
WHERE id = 123  -- Fast

-- Does NOT support:
WHERE id > 100  -- Won't use hash index
ORDER BY id     -- Won't use hash index
```

**When to use:**
- Very large tables with exact lookups only
- No need for range queries
- PostgreSQL-specific optimization

#### 3. GiST (Generalized Search Tree)

**Best for**: Full-text search, geometric data, range types

```sql
-- Full-text search
CREATE INDEX idx_posts_content_fts ON posts
USING GiST(to_tsvector('english', content));

SELECT * FROM posts
WHERE to_tsvector('english', content) @@ to_tsquery('database & performance');

-- Geometric data
CREATE INDEX idx_locations_point ON locations USING GiST(coordinates);

SELECT * FROM locations
WHERE coordinates <-> point(40.7128, -74.0060) < 10;
```

#### 4. GIN (Generalized Inverted Index)

**Best for**: JSONB, arrays, full-text search

```sql
-- JSONB indexing
CREATE INDEX idx_users_metadata ON users USING GIN(metadata);

SELECT * FROM users WHERE metadata @> '{"premium": true}';

-- Array indexing
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

SELECT * FROM posts WHERE tags @> ARRAY['postgresql', 'performance'];

-- Full-text search (faster than GiST for static data)
CREATE INDEX idx_posts_content_gin ON posts
USING GIN(to_tsvector('english', content));
```

**GIN vs GiST:**
- GIN: Faster lookups, slower updates, larger size
- GiST: Faster updates, slower lookups, smaller size

#### 5. BRIN (Block Range Index)

**Best for**: Very large tables with natural ordering

```sql
-- PostgreSQL
CREATE INDEX idx_logs_created_at ON logs USING BRIN(created_at);

-- Best for:
-- - Time-series data
-- - Naturally ordered data (sequential IDs, timestamps)
-- - Tables too large for standard indexes
```

**Advantages:**
- Extremely small size (1000x smaller than B-tree)
- Fast creation and maintenance
- Good for append-only tables

**Example:**
```sql
-- 100 million row table
-- B-tree index: 2.5 GB
-- BRIN index: 2.5 MB

CREATE INDEX idx_events_timestamp ON events USING BRIN(created_at);
```

#### 6. Partial Index

**Best for**: Indexing subset of rows

```sql
-- Index only active users
CREATE INDEX idx_active_users_email ON users(email)
WHERE active = true;

-- Index only recent orders
CREATE INDEX idx_recent_orders ON orders(created_at)
WHERE created_at > '2024-01-01';

-- Index only non-null values
CREATE INDEX idx_users_phone ON users(phone)
WHERE phone IS NOT NULL;
```

**Benefits:**
- Smaller index size
- Faster index scans
- Lower maintenance cost

#### 7. Composite Index (Multi-Column)

**Best for**: Queries with multiple WHERE conditions

```sql
-- Order matters!
CREATE INDEX idx_users_lastname_firstname ON users(last_name, first_name);

-- Will use index (left to right):
WHERE last_name = 'Smith'                           -- ✅ Uses index
WHERE last_name = 'Smith' AND first_name = 'John'   -- ✅ Uses index
WHERE first_name = 'John'                           -- ❌ Won't use index
```

**Column Order Strategy:**
```sql
-- Rule: Most selective column first
-- Bad (last_name is not selective)
CREATE INDEX idx_bad ON users(last_name, email);

-- Good (email is unique, highly selective)
CREATE INDEX idx_good ON users(email, last_name);
```

**Equality vs Range:**
```sql
-- Equality columns first, range columns last
CREATE INDEX idx_orders_optimal ON orders(
    status,        -- Equality (status = 'pending')
    user_id,       -- Equality (user_id = 123)
    created_at     -- Range (created_at > '2024-01-01')
);
```

#### 8. Covering Index (Include Columns)

**Best for**: Index-only scans, avoiding table lookups

```sql
-- PostgreSQL 11+
CREATE INDEX idx_users_email_include ON users(email)
INCLUDE (name, created_at);

-- Query can be satisfied entirely from index
SELECT name, created_at FROM users WHERE email = 'user@example.com';
-- No need to access the table!
```

**MySQL (InnoDB):**
```sql
-- InnoDB automatically includes PK in secondary indexes
CREATE INDEX idx_users_email ON users(email);
-- Automatically includes: (email, id)
```

#### 9. Unique Index

**Best for**: Enforcing uniqueness, primary keys

```sql
-- Unique constraint
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite unique constraint
CREATE UNIQUE INDEX idx_unique_username_per_org ON users(organization_id, username);

-- Partial unique index
CREATE UNIQUE INDEX idx_unique_active_email ON users(email)
WHERE deleted_at IS NULL;
```

## When to Create Indexes

### ✅ DO Index:

1. **Primary Keys (Automatic)**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY  -- Automatically indexed
);
```

2. **Foreign Keys**
```sql
CREATE TABLE posts (
    user_id INT REFERENCES users(id)
);
-- Add index for JOIN performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

3. **Columns in WHERE Clauses**
```sql
-- Frequent query
SELECT * FROM orders WHERE status = 'pending';

-- Create index
CREATE INDEX idx_orders_status ON orders(status);
```

4. **Columns in ORDER BY**
```sql
-- Frequent query
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;

-- Create index
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

5. **Columns in JOIN Conditions**
```sql
-- Frequent join
SELECT u.*, p.* FROM users u
JOIN posts p ON p.user_id = u.id;

-- Index both sides
CREATE INDEX idx_posts_user_id ON posts(user_id);
-- users.id is already indexed (PK)
```

6. **Columns in GROUP BY**
```sql
-- Analytics query
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- Index can help
CREATE INDEX idx_orders_status ON orders(status);
```

### ❌ DON'T Index:

1. **Small Tables (<1000 rows)**
```
Sequential scan is faster than index scan for small tables
```

2. **Low Cardinality Columns**
```sql
-- Bad: gender column (only 2-3 distinct values)
CREATE INDEX idx_users_gender ON users(gender);

-- Exception: Partial index if querying minority
CREATE INDEX idx_female_users ON users(gender) WHERE gender = 'female';
```

3. **Frequently Updated Columns**
```sql
-- Bad: last_login is updated on every login
CREATE INDEX idx_users_last_login ON users(last_login);
-- Every login now requires index update!
```

4. **Columns with Many NULLs (unless partial)**
```sql
-- Bad: 90% of users have NULL middle_name
CREATE INDEX idx_users_middle_name ON users(middle_name);

-- Good: Partial index
CREATE INDEX idx_users_middle_name ON users(middle_name)
WHERE middle_name IS NOT NULL;
```

## Index Analysis and Optimization

### PostgreSQL

#### Analyze Query Plans
```sql
-- Show query plan
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';

-- Show actual execution
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Look for:
-- Seq Scan          ❌ Bad (full table scan)
-- Index Scan        ✅ Good (using index)
-- Index Only Scan   ✅ Best (no table access)
-- Bitmap Index Scan ✅ Good (multiple index merge)
```

**Example Output:**
```
Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=100)
                                           (actual time=0.015..0.016 rows=1 loops=1)
  Index Cond: (email = 'user@example.com')
Planning Time: 0.123 ms
Execution Time: 0.045 ms
```

#### Index Usage Statistics
```sql
-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Find unused indexes
SELECT
    schemaname || '.' || tablename as table,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
    AND indexname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

#### Index Size
```sql
-- Check index sizes
SELECT
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

#### Missing Indexes
```sql
-- Tables with high sequential scans
SELECT
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    seq_tup_read / seq_scan as avg_seq_read
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 20;
```

### MySQL

#### Analyze Query Plans
```sql
-- Show query plan
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';

-- Detailed analysis
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE email = 'user@example.com';

-- Look for:
-- type: ALL           ❌ Bad (full table scan)
-- type: index         ⚠️  Okay (full index scan)
-- type: range         ✅ Good (range scan)
-- type: ref           ✅ Good (non-unique index)
-- type: eq_ref        ✅ Best (unique index)
-- type: const         ✅ Best (primary key lookup)
```

#### Index Usage Statistics
```sql
-- Show index statistics
SHOW INDEX FROM users;

-- Check index cardinality
SELECT
    TABLE_NAME,
    INDEX_NAME,
    SEQ_IN_INDEX,
    COLUMN_NAME,
    CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'mydb'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
```

#### Unused Indexes
```sql
-- MySQL 5.6+
SELECT * FROM sys.schema_unused_indexes;
```

## Query Optimization Examples

### Example 1: Slow User Lookup

**Problem:**
```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- Seq Scan on users  (cost=0.00..1808.00 rows=1 width=100)
-- Planning time: 0.123 ms
-- Execution time: 45.234 ms  ❌ Slow!
```

**Solution:**
```sql
CREATE INDEX idx_users_email ON users(email);

EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- Index Scan using idx_users_email  (cost=0.42..8.44 rows=1 width=100)
-- Planning time: 0.089 ms
-- Execution time: 0.045 ms  ✅ Fast!
```

### Example 2: Composite Index Optimization

**Problem:**
```sql
SELECT * FROM orders
WHERE status = 'pending'
    AND user_id = 123
ORDER BY created_at DESC
LIMIT 10;

-- Slow: Multiple indexes used, sort required
```

**Solution:**
```sql
CREATE INDEX idx_orders_optimal ON orders(status, user_id, created_at DESC);

-- Fast: Single index scan, no sort needed
```

### Example 3: Covering Index

**Problem:**
```sql
SELECT name, email FROM users WHERE active = true;

-- Index scan + table lookup for each row
```

**Solution:**
```sql
CREATE INDEX idx_users_active_covering ON users(active)
INCLUDE (name, email);

-- Index-only scan, no table access!
```

## Index Maintenance

### Rebuild Indexes (PostgreSQL)
```sql
-- Rebuild single index
REINDEX INDEX idx_users_email;

-- Rebuild all indexes on table
REINDEX TABLE users;

-- Rebuild concurrently (no locks, PG 12+)
REINDEX INDEX CONCURRENTLY idx_users_email;
```

### Rebuild Indexes (MySQL)
```sql
-- Rebuild all indexes
OPTIMIZE TABLE users;

-- Rebuild specific index
ALTER TABLE users DROP INDEX idx_users_email,
    ADD INDEX idx_users_email(email);
```

### Update Statistics
```sql
-- PostgreSQL
ANALYZE users;
VACUUM ANALYZE users;

-- MySQL
ANALYZE TABLE users;
```

## Best Practices

### 1. Index Naming Convention
```sql
✅ Good:
idx_users_email
idx_posts_user_id_created_at
idx_orders_status_partial

❌ Bad:
index1
email_idx
ix_temp
```

### 2. Monitor Index Bloat
```sql
-- PostgreSQL: Check index bloat
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size,
    idx_scan,
    ROUND(100.0 * pg_relation_size(indexrelid) / pg_relation_size(tablename::regclass), 2) as ratio
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 3. Create Indexes Concurrently
```sql
-- PostgreSQL: No locks during creation
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- MySQL: Online DDL (InnoDB)
CREATE INDEX idx_users_email ON users(email) ALGORITHM=INPLACE, LOCK=NONE;
```

### 4. Test Before Production
```bash
# Load production-like data
# Create index on development
# Run EXPLAIN ANALYZE on common queries
# Measure performance improvement
# Deploy to production
```

## Common Pitfalls

### ❌ Pitfall 1: Over-Indexing
```sql
-- 10 indexes on one table = slow writes!
-- Only create indexes you actually use
```

### ❌ Pitfall 2: Wrong Column Order
```sql
-- Bad: Range column first
CREATE INDEX idx_bad ON orders(created_at, status);

-- Good: Equality column first
CREATE INDEX idx_good ON orders(status, created_at);
```

### ❌ Pitfall 3: Function in WHERE Clause
```sql
-- Bad: Index not used
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- Good: Functional index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
```

### ❌ Pitfall 4: OR Queries
```sql
-- Index might not be used
SELECT * FROM users WHERE email = 'a@a.com' OR phone = '123';

-- Better: Use UNION
SELECT * FROM users WHERE email = 'a@a.com'
UNION
SELECT * FROM users WHERE phone = '123';
```

## Performance Targets

- Simple index lookup: <5ms
- Range scan: <50ms
- Join with indexes: <100ms
- Index creation (1M rows): <1 minute
- Index size: <50% of table size

## References

- [Use The Index, Luke](https://use-the-index-luke.com/)
- [PostgreSQL Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
- [MySQL Index Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html)
- [PostgreSQL Index Statistics](https://www.postgresql.org/docs/current/monitoring-stats.html)
