using System;
using System.Linq;
using System.Threading.Tasks;
using {{namespace}}.Models;

namespace {{namespace}}.Extensions
{
    /// <summary>
    /// Extension methods for easy pagination of IQueryable
    /// </summary>
    public static class PaginationExtensions
    {
        /// <summary>
        /// Convert OffsetPagination to API response model
        /// </summary>
        public static PaginatedResponse<T> ToResponse<T>(
            this Pagination.OffsetPagination<T> pagination,
            string? baseUrl = null) where T : class
        {
            var response = new PaginatedResponse<T>
            {
                Data = pagination.Items,
                Pagination = new PaginationMeta
                {
                    CurrentPage = pagination.CurrentPage,
                    TotalPages = pagination.TotalPages,
                    TotalItems = pagination.TotalItems,
                    PageSize = pagination.PageSize,
                    HasNext = pagination.HasNext,
                    HasPrevious = pagination.HasPrevious
                }
            };

            // Add HATEOAS links if base URL provided
            if (!string.IsNullOrEmpty(baseUrl))
            {
                response.Links = new PaginationLinks
                {
                    First = $"{baseUrl}?page=1&pageSize={pagination.PageSize}",
                    Previous = pagination.HasPrevious
                        ? $"{baseUrl}?page={pagination.CurrentPage - 1}&pageSize={pagination.PageSize}"
                        : null,
                    Next = pagination.HasNext
                        ? $"{baseUrl}?page={pagination.CurrentPage + 1}&pageSize={pagination.PageSize}"
                        : null,
                    Last = $"{baseUrl}?page={pagination.TotalPages}&pageSize={pagination.PageSize}"
                };
            }

            return response;
        }

        /// <summary>
        /// Convert CursorPagination to API response model
        /// </summary>
        public static PaginatedResponse<T> ToResponse<T>(
            this Pagination.CursorPagination<T> pagination,
            string? baseUrl = null) where T : class
        {
            var response = new PaginatedResponse<T>
            {
                Data = pagination.Items,
                Pagination = new PaginationMeta
                {
                    PageSize = pagination.PageSize,
                    HasNext = pagination.HasNext,
                    HasPrevious = pagination.HasPrevious,
                    NextCursor = pagination.NextCursor,
                    PreviousCursor = pagination.PreviousCursor
                }
            };

            // Add HATEOAS links if base URL provided
            if (!string.IsNullOrEmpty(baseUrl))
            {
                response.Links = new PaginationLinks
                {
                    Previous = pagination.HasPrevious && !string.IsNullOrEmpty(pagination.PreviousCursor)
                        ? $"{baseUrl}?cursor={pagination.PreviousCursor}&pageSize={pagination.PageSize}"
                        : null,
                    Next = pagination.HasNext && !string.IsNullOrEmpty(pagination.NextCursor)
                        ? $"{baseUrl}?cursor={pagination.NextCursor}&pageSize={pagination.PageSize}"
                        : null
                };
            }

            return response;
        }

        /// <summary>
        /// Paginate a query using offset pagination and return as API response
        /// </summary>
        /// <example>
        /// <code>
        /// [HttpGet]
        /// public async Task&lt;ActionResult&lt;PaginatedResponse&lt;Product&gt;&gt;&gt; GetProducts(
        ///     [FromQuery] int page = 1,
        ///     [FromQuery] int pageSize = 20)
        /// {
        ///     var response = await _context.Products
        ///         .Where(p => p.IsActive)
        ///         .OrderBy(p => p.Name)
        ///         .ToPaginatedResponseAsync(page, pageSize, $"{Request.Scheme}://{Request.Host}{Request.Path}");
        ///
        ///     return Ok(response);
        /// }
        /// </code>
        /// </example>
        public static async Task<PaginatedResponse<T>> ToPaginatedResponseAsync<T>(
            this IQueryable<T> query,
            int page,
            int pageSize,
            string? baseUrl = null) where T : class
        {
            var pagination = await Pagination.OffsetPaginationHelper.PaginateAsync(query, page, pageSize);
            return pagination.ToResponse(baseUrl);
        }

        /// <summary>
        /// Paginate a query using cursor pagination and return as API response
        /// </summary>
        public static async Task<PaginatedResponse<T>> ToCursorPaginatedResponseAsync<T, TKey>(
            this IQueryable<T> query,
            Func<T, TKey> keySelector,
            string? cursor,
            int pageSize,
            string? baseUrl = null,
            bool ascending = true) where T : class where TKey : IComparable<TKey>
        {
            var pagination = await Pagination.CursorPaginationHelper.PaginateAsync(
                query,
                keySelector,
                cursor,
                pageSize,
                ascending
            );
            return pagination.ToResponse(baseUrl);
        }
    }
}
