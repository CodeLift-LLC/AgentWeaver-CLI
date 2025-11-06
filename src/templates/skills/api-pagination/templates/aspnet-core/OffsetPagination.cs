using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace {{namespace}}.Pagination
{
    /// <summary>
    /// Offset-based pagination for traditional page number navigation.
    /// </summary>
    /// <remarks>
    /// Best for: Small to medium datasets, user-facing pagination with page numbers
    /// Advantages: Simple to implement, familiar UX, direct page access
    /// </remarks>
    public class OffsetPagination<T> where T : class
    {
        /// <summary>
        /// The items for the current page
        /// </summary>
        public IReadOnlyList<T> Items { get; }

        /// <summary>
        /// Current page number (1-indexed)
        /// </summary>
        public int CurrentPage { get; }

        /// <summary>
        /// Number of items per page
        /// </summary>
        public int PageSize { get; }

        /// <summary>
        /// Total number of items across all pages
        /// </summary>
        public int TotalItems { get; }

        /// <summary>
        /// Total number of pages
        /// </summary>
        public int TotalPages { get; }

        /// <summary>
        /// Whether there is a next page
        /// </summary>
        public bool HasNext { get; }

        /// <summary>
        /// Whether there is a previous page
        /// </summary>
        public bool HasPrevious { get; }

        public OffsetPagination(
            IReadOnlyList<T> items,
            int currentPage,
            int pageSize,
            int totalItems)
        {
            Items = items;
            CurrentPage = currentPage;
            PageSize = pageSize;
            TotalItems = totalItems;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            HasNext = currentPage < TotalPages;
            HasPrevious = currentPage > 1;
        }
    }

    /// <summary>
    /// Helper methods for offset-based pagination
    /// </summary>
    public static class OffsetPaginationHelper
    {
        /// <summary>
        /// Paginate an IQueryable using offset-based pagination
        /// </summary>
        /// <typeparam name="T">Entity type</typeparam>
        /// <param name="query">The base query</param>
        /// <param name="page">Page number (1-indexed)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <returns>Paginated result</returns>
        /// <example>
        /// <code>
        /// // In your controller:
        /// [HttpGet]
        /// public async Task&lt;ActionResult&lt;OffsetPagination&lt;Product&gt;&gt;&gt; GetProducts(
        ///     [FromQuery] int page = 1,
        ///     [FromQuery] int pageSize = {{defaultPageSize}})
        /// {
        ///     var query = _context.Products
        ///         .Where(p => p.IsActive)
        ///         .OrderBy(p => p.Name);
        ///
        ///     var result = await OffsetPaginationHelper.PaginateAsync(query, page, pageSize);
        ///
        ///     return Ok(result);
        /// }
        /// </code>
        /// </example>
        public static async Task<OffsetPagination<T>> PaginateAsync<T>(
            IQueryable<T> query,
            int page,
            int pageSize) where T : class
        {
            // Validate and constrain parameters
            page = Math.Max(1, page);
            pageSize = Math.Min(Math.Max(1, pageSize), {{maxPageSize}});

            // Get total count
            var totalItems = await query.CountAsync();

            // Calculate offset
            var offset = (page - 1) * pageSize;

            // Get items for current page
            var items = await query
                .Skip(offset)
                .Take(pageSize)
                .ToListAsync();

            return new OffsetPagination<T>(
                items.AsReadOnly(),
                page,
                pageSize,
                totalItems
            );
        }

        /// <summary>
        /// Paginate an IQueryable with optimized count query
        /// </summary>
        /// <remarks>
        /// Use this when you have a complex query and want to optimize the count operation
        /// </remarks>
        public static async Task<OffsetPagination<T>> PaginateAsync<T>(
            IQueryable<T> query,
            IQueryable<T> countQuery,
            int page,
            int pageSize) where T : class
        {
            // Validate and constrain parameters
            page = Math.Max(1, page);
            pageSize = Math.Min(Math.Max(1, pageSize), {{maxPageSize}});

            // Get total count using optimized query
            var totalItems = await countQuery.CountAsync();

            // Calculate offset
            var offset = (page - 1) * pageSize;

            // Get items for current page
            var items = await query
                .Skip(offset)
                .Take(pageSize)
                .ToListAsync();

            return new OffsetPagination<T>(
                items.AsReadOnly(),
                page,
                pageSize,
                totalItems
            );
        }
    }
}
