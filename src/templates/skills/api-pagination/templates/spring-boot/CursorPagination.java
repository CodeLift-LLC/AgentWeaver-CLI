package {{packageName}}.pagination;

import java.util.Base64;
import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * Cursor-based Pagination for Spring Boot
 *
 * Efficient pagination for large datasets using cursor approach.
 * Best for: Infinite scrolling, real-time feeds, large datasets
 *
 * @param <T> The type of entities being paginated
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CursorPagination<T> {

    private List<T> data;
    private String nextCursor;
    private String previousCursor;
    private boolean hasNext;
    private boolean hasPrevious;
    private int pageSize;

    /**
     * Encode a cursor value to Base64 string
     *
     * @param value The value to encode (typically an ID or timestamp)
     * @return Base64-encoded cursor string
     */
    public static String encodeCursor(Object value) {
        if (value == null) {
            return null;
        }
        return Base64.getEncoder().encodeToString(value.toString().getBytes());
    }

    /**
     * Decode a Base64 cursor string
     *
     * @param cursor The cursor to decode
     * @return Decoded cursor value
     */
    public static String decodeCursor(String cursor) {
        if (cursor == null || cursor.isEmpty()) {
            return null;
        }
        try {
            return new String(Base64.getDecoder().decode(cursor));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Create a cursor pagination response
     *
     * @param data         The list of items
     * @param cursorValue  Function to extract cursor value from item
     * @param pageSize     Number of items per page
     * @param hasMore      Whether there are more items
     * @return CursorPagination instance
     *
     * Example usage:
     * <pre>
     * {@code
     * @GetMapping("/api/users")
     * public ResponseEntity<CursorPagination<User>> getUsers(
     *     @RequestParam(required = false) String cursor,
     *     @RequestParam(defaultValue = "{{defaultPageSize}}") int limit
     * ) {
     *     // Decode cursor
     *     Long cursorId = cursor != null ?
     *         Long.parseLong(CursorPagination.decodeCursor(cursor)) : null;
     *
     *     // Fetch items (limit + 1 to check if more exist)
     *     List<User> users = cursorId != null ?
     *         userRepository.findByIdGreaterThan(cursorId, PageRequest.of(0, limit + 1)) :
     *         userRepository.findAll(PageRequest.of(0, limit + 1));
     *
     *     // Check if there are more items
     *     boolean hasMore = users.size() > limit;
     *     if (hasMore) {
     *         users = users.subList(0, limit);
     *     }
     *
     *     // Create response
     *     CursorPagination<User> response = CursorPagination.of(
     *         users,
     *         User::getId,
     *         limit,
     *         hasMore
     *     );
     *
     *     return ResponseEntity.ok(response);
     * }
     * }
     * </pre>
     */
    public static <T, ID> CursorPagination<T> of(
        List<T> data,
        java.util.function.Function<T, ID> cursorExtractor,
        int pageSize,
        boolean hasMore
    ) {
        CursorPagination<T> response = new CursorPagination<>();
        response.setData(data);
        response.setPageSize(pageSize);
        response.setHasNext(hasMore);

        // Set next cursor if there are more items
        if (hasMore && !data.isEmpty()) {
            T lastItem = data.get(data.size() - 1);
            ID cursorValue = cursorExtractor.apply(lastItem);
            response.setNextCursor(encodeCursor(cursorValue));
        }

        return response;
    }

    /**
     * Create an empty cursor pagination response
     *
     * @param pageSize The page size
     * @return Empty CursorPagination instance
     */
    public static <T> CursorPagination<T> empty(int pageSize) {
        return new CursorPagination<>(
            List.of(),
            null,
            null,
            false,
            false,
            pageSize
        );
    }
}
