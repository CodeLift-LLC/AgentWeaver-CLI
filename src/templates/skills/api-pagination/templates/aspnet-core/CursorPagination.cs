using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace {{namespace}}.Pagination
{
    /// <summary>
    /// Cursor-based pagination for efficient navigation through large datasets.
    /// Uses opaque cursors to track position without offset calculations.
    /// </summary>
    /// <remarks>
    /// Best for: Large datasets, infinite scroll, real-time data, mobile apps
    /// Advantages: Consistent performance, handles data changes gracefully
    /// </remarks>
    public class CursorPagination<T> where T : class
    {
        /// <summary>
        /// The items for the current page
        /// </summary>
        public IReadOnlyList<T> Items { get; }

        /// <summary>
        /// Cursor for the next page (null if no more items)
        /// </summary>
        public string? NextCursor { get; }

        /// <summary>
        /// Cursor for the previous page (null if on first page)
        /// </summary>
        public string? PreviousCursor { get; }

        /// <summary>
        /// Whether there are more items after this page
        /// </summary>
        public bool HasNext { get; }

        /// <summary>
        /// Whether there are items before this page
        /// </summary>
        public bool HasPrevious { get; }

        /// <summary>
        /// Number of items per page
        /// </summary>
        public int PageSize { get; }

        public CursorPagination(
            IReadOnlyList<T> items,
            string? nextCursor,
            string? previousCursor,
            bool hasNext,
            bool hasPrevious,
            int pageSize)
        {
            Items = items;
            NextCursor = nextCursor;
            PreviousCursor = previousCursor;
            HasNext = hasNext;
            HasPrevious = hasPrevious;
            PageSize = pageSize;
        }
    }

    /// <summary>
    /// Helper methods for cursor-based pagination
    /// </summary>
    public static class CursorPaginationHelper
    {
        /// <summary>
        /// Encode a value as a base64 cursor
        /// </summary>
        public static string EncodeCursor(object value)
        {
            if (value == null) return string.Empty;

            var bytes = Encoding.UTF8.GetBytes(value.ToString() ?? string.Empty);
            return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// Decode a base64 cursor to a string value
        /// </summary>
        public static string DecodeCursor(string cursor)
        {
            if (string.IsNullOrEmpty(cursor)) return string.Empty;

            try
            {
                var bytes = Convert.FromBase64String(cursor);
                return Encoding.UTF8.GetString(bytes);
            }
            catch
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Paginate an IQueryable using cursor-based pagination
        /// </summary>
        /// <typeparam name="T">Entity type</typeparam>
        /// <typeparam name="TKey">Key type for cursor</typeparam>
        /// <param name="query">The base query</param>
        /// <param name="keySelector">Function to select the cursor key</param>
        /// <param name="cursor">Current cursor (null for first page)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="ascending">Sort direction (true for ascending, false for descending)</param>
        /// <returns>Paginated result</returns>
        /// <example>
        /// <code>
        /// // In your controller:
        /// [HttpGet]
        /// public async Task&lt;ActionResult&lt;CursorPagination&lt;User&gt;&gt;&gt; GetUsers(
        ///     [FromQuery] string? cursor = null,
        ///     [FromQuery] int pageSize = {{defaultPageSize}})
        /// {
        ///     var result = await CursorPaginationHelper.PaginateAsync(
        ///         _context.Users.AsQueryable(),
        ///         u => u.Id,
        ///         cursor,
        ///         pageSize
        ///     );
        ///
        ///     return Ok(result);
        /// }
        /// </code>
        /// </example>
        public static async Task<CursorPagination<T>> PaginateAsync<T, TKey>(
            IQueryable<T> query,
            Func<T, TKey> keySelector,
            string? cursor,
            int pageSize,
            bool ascending = true) where T : class where TKey : IComparable<TKey>
        {
            pageSize = Math.Min(pageSize, {{maxPageSize}});

            // Apply cursor filter if provided
            if (!string.IsNullOrEmpty(cursor))
            {
                var decodedCursor = DecodeCursor(cursor);

                // This is a simplified version - in production, you'd want to handle type conversion
                if (typeof(TKey) == typeof(int) && int.TryParse(decodedCursor, out var intCursor))
                {
                    query = ascending
                        ? query.Where(x => ((IComparable)keySelector(x)).CompareTo(intCursor) > 0)
                        : query.Where(x => ((IComparable)keySelector(x)).CompareTo(intCursor) < 0);
                }
                else if (typeof(TKey) == typeof(Guid) && Guid.TryParse(decodedCursor, out var guidCursor))
                {
                    query = ascending
                        ? query.Where(x => ((IComparable)keySelector(x)).CompareTo(guidCursor) > 0)
                        : query.Where(x => ((IComparable)keySelector(x)).CompareTo(guidCursor) < 0);
                }
            }

            // Fetch one extra item to check if there's a next page
            var items = await query
                .Take(pageSize + 1)
                .ToListAsync();

            var hasNext = items.Count > pageSize;
            if (hasNext)
            {
                items = items.Take(pageSize).ToList();
            }

            var nextCursor = hasNext && items.Any()
                ? EncodeCursor(keySelector(items.Last()))
                : null;

            var previousCursor = !string.IsNullOrEmpty(cursor) && items.Any()
                ? EncodeCursor(keySelector(items.First()))
                : null;

            return new CursorPagination<T>(
                items.AsReadOnly(),
                nextCursor,
                previousCursor,
                hasNext,
                !string.IsNullOrEmpty(cursor),
                pageSize
            );
        }
    }
}
