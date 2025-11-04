package pagination

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

// PaginationParams holds pagination query parameters
type PaginationParams struct {
	Page     int
	PageSize int
	Cursor   string
}

// DefaultPaginationParams returns default pagination parameters
func DefaultPaginationParams() PaginationParams {
	return PaginationParams{
		Page:     1,
		PageSize: {{defaultPageSize}},
		Cursor:   "",
	}
}

// ParsePaginationParams extracts pagination parameters from Gin context
// This middleware parses query parameters and adds them to the context
//
// Example usage:
//
//	func main() {
//	    r := gin.Default()
//
//	    // Apply as route middleware
//	    r.GET("/users", pagination.ParsePaginationParams, GetUsers)
//
//	    // Or apply globally
//	    r.Use(pagination.ParsePaginationParams)
//	}
//
//	func GetUsers(c *gin.Context) {
//	    params := pagination.GetPaginationParams(c)
//	    // Use params.Page, params.PageSize, params.Cursor
//	}
func ParsePaginationParams(c *gin.Context) {
	params := DefaultPaginationParams()

	// Parse page number (offset pagination)
	if pageStr := c.Query("page"); pageStr != "" {
		if page, err := strconv.Atoi(pageStr); err == nil && page > 0 {
			params.Page = page
		}
	}

	// Parse page size
	if pageSizeStr := c.Query("page_size"); pageSizeStr != "" {
		if pageSize, err := strconv.Atoi(pageSizeStr); err == nil && pageSize > 0 {
			params.PageSize = pageSize
		}
	}

	// Also check "limit" as an alias for page_size
	if limitStr := c.Query("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
			params.PageSize = limit
		}
	}

	// Parse cursor (cursor pagination)
	if cursor := c.Query("cursor"); cursor != "" {
		params.Cursor = cursor
	}

	// Constrain page size to maximum
	if params.PageSize > {{maxPageSize}} {
		params.PageSize = {{maxPageSize}}
	}

	// Store in context for handler use
	c.Set("pagination_params", params)

	c.Next()
}

// GetPaginationParams retrieves pagination params from Gin context
// Returns default params if not set
func GetPaginationParams(c *gin.Context) PaginationParams {
	if params, exists := c.Get("pagination_params"); exists {
		if p, ok := params.(PaginationParams); ok {
			return p
		}
	}
	return DefaultPaginationParams()
}

// Helper functions for direct parameter extraction without middleware

// GetPage extracts page number from query params (defaults to 1)
func GetPage(c *gin.Context) int {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	return page
}

// GetPageSize extracts page size from query params with validation
func GetPageSize(c *gin.Context) int {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", strconv.Itoa({{defaultPageSize}})))

	// Also check "limit" as an alias
	if limitStr := c.Query("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil {
			pageSize = limit
		}
	}

	if pageSize < 1 {
		pageSize = {{defaultPageSize}}
	}
	if pageSize > {{maxPageSize}} {
		pageSize = {{maxPageSize}}
	}
	return pageSize
}

// GetCursor extracts cursor from query params
func GetCursor(c *gin.Context) string {
	return c.Query("cursor")
}
