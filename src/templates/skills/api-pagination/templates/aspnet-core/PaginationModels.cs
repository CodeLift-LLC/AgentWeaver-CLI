using System.Collections.Generic;

namespace {{namespace}}.Models
{
    /// <summary>
    /// Generic paginated response wrapper for API responses
    /// </summary>
    public class PaginatedResponse<T>
    {
        /// <summary>
        /// The data items for the current page
        /// </summary>
        public IReadOnlyList<T> Data { get; set; } = new List<T>();

        /// <summary>
        /// Pagination metadata
        /// </summary>
        public PaginationMeta Pagination { get; set; } = new PaginationMeta();

        /// <summary>
        /// Optional HATEOAS links
        /// </summary>
        public PaginationLinks? Links { get; set; }
    }

    /// <summary>
    /// Pagination metadata (works for both cursor and offset pagination)
    /// </summary>
    public class PaginationMeta
    {
        /// <summary>
        /// Current page number (offset pagination only)
        /// </summary>
        public int? CurrentPage { get; set; }

        /// <summary>
        /// Total number of pages (offset pagination only)
        /// </summary>
        public int? TotalPages { get; set; }

        /// <summary>
        /// Total number of items (offset pagination only)
        /// </summary>
        public int? TotalItems { get; set; }

        /// <summary>
        /// Number of items per page
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Whether there is a next page
        /// </summary>
        public bool HasNext { get; set; }

        /// <summary>
        /// Whether there is a previous page
        /// </summary>
        public bool HasPrevious { get; set; }

        /// <summary>
        /// Next page cursor (cursor pagination only)
        /// </summary>
        public string? NextCursor { get; set; }

        /// <summary>
        /// Previous page cursor (cursor pagination only)
        /// </summary>
        public string? PreviousCursor { get; set; }
    }

    /// <summary>
    /// HATEOAS links for pagination navigation
    /// </summary>
    public class PaginationLinks
    {
        public string? First { get; set; }
        public string? Previous { get; set; }
        public string? Next { get; set; }
        public string? Last { get; set; }
    }
}
