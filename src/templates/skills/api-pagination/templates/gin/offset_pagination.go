package pagination

import (
	"fmt"
	"math"

	"gorm.io/gorm"
)

// OffsetPagination represents offset-based pagination result
// Best for: Small to medium datasets, user-facing pagination with page numbers
type OffsetPagination[T any] struct {
	Items       []T  `json:"items"`
	CurrentPage int  `json:"current_page"`
	PageSize    int  `json:"page_size"`
	TotalItems  int64 `json:"total_items"`
	TotalPages  int  `json:"total_pages"`
	HasNext     bool `json:"has_next"`
	HasPrevious bool `json:"has_previous"`
}

// OffsetPaginate performs offset-based pagination on a GORM query
//
// Example usage:
//
//	func GetProducts(c *gin.Context) {
//	    var products []Product
//	    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
//	    pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
//
//	    query := db.Where("is_active = ?", true).Order("name ASC")
//
//	    result, err := pagination.OffsetPaginate(query, &products, page, pageSize)
//	    if err != nil {
//	        c.JSON(500, gin.H{"error": err.Error()})
//	        return
//	    }
//
//	    c.JSON(200, result)
//	}
func OffsetPaginate[T any](
	db *gorm.DB,
	dest *[]T,
	page int,
	pageSize int,
) (*OffsetPagination[T], error) {
	// Validate and constrain parameters
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = {{defaultPageSize}}
	}
	if pageSize > {{maxPageSize}} {
		pageSize = {{maxPageSize}}
	}

	// Get total count
	var totalItems int64
	if err := db.Model(dest).Count(&totalItems).Error; err != nil {
		return nil, fmt.Errorf("failed to count items: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * pageSize

	// Get items for current page
	var items []T
	if err := db.Offset(offset).Limit(pageSize).Find(&items).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch items: %w", err)
	}

	*dest = items

	// Calculate total pages
	totalPages := int(math.Ceil(float64(totalItems) / float64(pageSize)))

	return &OffsetPagination[T]{
		Items:       items,
		CurrentPage: page,
		PageSize:    pageSize,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		HasNext:     page < totalPages,
		HasPrevious: page > 1,
	}, nil
}

// OffsetPaginateWithCount performs offset pagination with a separate count query
// Use this for optimization when you have complex queries
//
// Example:
//
//	func GetFilteredProducts(c *gin.Context) {
//	    var products []Product
//	    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
//	    pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
//
//	    // Main query with joins
//	    query := db.Joins("JOIN categories ON categories.id = products.category_id").
//	        Where("products.is_active = ?", true).
//	        Order("products.name ASC")
//
//	    // Optimized count query without joins
//	    countQuery := db.Model(&Product{}).Where("is_active = ?", true)
//
//	    result, err := pagination.OffsetPaginateWithCount(
//	        query,
//	        countQuery,
//	        &products,
//	        page,
//	        pageSize,
//	    )
//
//	    if err != nil {
//	        c.JSON(500, gin.H{"error": err.Error()})
//	        return
//	    }
//
//	    c.JSON(200, result)
//	}
func OffsetPaginateWithCount[T any](
	db *gorm.DB,
	countDB *gorm.DB,
	dest *[]T,
	page int,
	pageSize int,
) (*OffsetPagination[T], error) {
	// Validate and constrain parameters
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = {{defaultPageSize}}
	}
	if pageSize > {{maxPageSize}} {
		pageSize = {{maxPageSize}}
	}

	// Get total count using optimized query
	var totalItems int64
	if err := countDB.Count(&totalItems).Error; err != nil {
		return nil, fmt.Errorf("failed to count items: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * pageSize

	// Get items for current page
	var items []T
	if err := db.Offset(offset).Limit(pageSize).Find(&items).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch items: %w", err)
	}

	*dest = items

	// Calculate total pages
	totalPages := int(math.Ceil(float64(totalItems) / float64(pageSize)))

	return &OffsetPagination[T]{
		Items:       items,
		CurrentPage: page,
		PageSize:    pageSize,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		HasNext:     page < totalPages,
		HasPrevious: page > 1,
	}, nil
}
