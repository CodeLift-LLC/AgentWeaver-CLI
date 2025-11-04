---
name: API Pagination
description: Reusable patterns for implementing cursor-based and offset-based pagination in REST APIs with performance optimization and best practices.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - api
  - pagination
  - performance
  - rest
---

# API Pagination Skill

This skill provides battle-tested patterns for implementing pagination in REST APIs, including both cursor-based and offset-based approaches.

## When to Use

- Building REST APIs that return collections
- Optimizing API performance for large datasets
- Implementing infinite scroll or "load more" features
- Need consistent pagination across multiple endpoints

## Patterns Included

### 1. Cursor-Based Pagination (Recommended)
Best for: Large datasets, real-time data, better performance

**Advantages:**
- Consistent results even when data changes
- Better performance for large offsets
- Prevents skipping or duplicating items

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTIzfQ==",
    "prevCursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true
  }
}
```

### 2. Offset-Based Pagination
Best for: Smaller datasets, page number display required

**Advantages:**
- Easy to implement
- User-friendly (page numbers)
- Simple to jump to specific pages

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Implementation Guidelines

### Query Parameters
- **Cursor-based**: `?cursor={base64_encoded}&limit=20`
- **Offset-based**: `?page=1&limit=20` or `?offset=0&limit=20`

### Performance Optimization
1. **Index cursor fields**: Ensure cursor field (usually `id` or `created_at`) is indexed
2. **Limit max page size**: Enforce maximum limit (e.g., 100 items)
3. **Use database cursors**: Leverage native database cursor support
4. **Cache counts**: Cache total counts for offset pagination

### HTTP Headers (Optional)
```
Link: <https://api.example.com/items?cursor=xyz>; rel="next"
X-Total-Count: 150
X-Page-Size: 20
```

## Framework-Specific Implementations

See the `templates/` directory for implementation examples in:
- Express.js (TypeScript)
- FastAPI (Python)
- Next.js API Routes (TypeScript)

## Best Practices

1. **Consistent Sorting**: Always apply consistent sort order
2. **Error Handling**: Validate cursor/page parameters
3. **Documentation**: Document pagination in API docs (OpenAPI)
4. **Default Limits**: Provide sensible defaults (e.g., 20 items)
5. **Performance Testing**: Test with large datasets

## Common Pitfalls

❌ **Don't**: Use OFFSET for large datasets (slow)
✅ **Do**: Use cursor-based pagination for better performance

❌ **Don't**: Return all data without pagination
✅ **Do**: Always paginate collections

❌ **Don't**: Skip validation of pagination parameters
✅ **Do**: Validate and sanitize all inputs

## Testing Checklist

- [ ] Test with empty results
- [ ] Test with single page of results
- [ ] Test with multiple pages
- [ ] Test cursor/page parameter validation
- [ ] Test with concurrent data modifications
- [ ] Load test with large datasets
- [ ] Test edge cases (first/last page)

## Example Usage

```typescript
// Backend (Express with TypeScript)
router.get('/items', async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const result = await paginateItems({ cursor, limit });
  res.json(result);
});

// Frontend (React)
const { data, hasMore, loadMore } = usePagination('/api/items');
```

## References

- [REST API Pagination Best Practices](https://specs.openstack.org/openstack/api-wg/guidelines/pagination_filter_sort.html)
- [Cursor vs Offset Pagination](https://uxdesign.cc/why-facebook-says-cursor-pagination-is-the-greatest-d6b98d86b6c0)
- [GraphQL Connection Spec](https://relay.dev/graphql/connections.htm) (inspiration for cursor pagination)
