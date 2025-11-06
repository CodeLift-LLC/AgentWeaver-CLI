package pagination

import (
	"encoding/base64"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

// CursorPagination represents cursor-based pagination result
// Best for: Large datasets, infinite scroll, real-time data, mobile apps
type CursorPagination[T any] struct {
	Items          []T     `json:"items"`
	NextCursor     *string `json:"next_cursor,omitempty"`
	PreviousCursor *string `json:"previous_cursor,omitempty"`
	HasNext        bool    `json:"has_next"`
	HasPrevious    bool    `json:"has_previous"`
	PageSize       int     `json:"page_size"`
}

// EncodeCursor encodes a value as a base64 cursor
func EncodeCursor(value interface{}) string {
	str := fmt.Sprintf("%v", value)
	return base64.StdEncoding.EncodeToString([]byte(str))
}

// DecodeCursor decodes a base64 cursor to a string
func DecodeCursor(cursor string) (string, error) {
	if cursor == "" {
		return "", nil
	}

	decoded, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return "", fmt.Errorf("invalid cursor: %w", err)
	}

	return string(decoded), nil
}

// CursorPaginateInt paginates using an integer cursor (like ID)
//
// Example usage:
//
//	func GetUsers(c *gin.Context) {
//	    var users []User
//	    cursor := c.Query("cursor")
//	    pageSize := 20
//
//	    result, err := pagination.CursorPaginateInt(
//	        db,
//	        &users,
//	        cursor,
//	        pageSize,
//	        "id", // cursor field
//	        true, // ascending
//	    )
//
//	    if err != nil {
//	        c.JSON(500, gin.H{"error": err.Error()})
//	        return
//	    }
//
//	    c.JSON(200, result)
//	}
func CursorPaginateInt[T any](
	db *gorm.DB,
	dest *[]T,
	cursor string,
	pageSize int,
	cursorField string,
	ascending bool,
) (*CursorPagination[T], error) {
	// Constrain page size
	if pageSize > {{maxPageSize}} {
		pageSize = {{maxPageSize}}
	}
	if pageSize < 1 {
		pageSize = {{defaultPageSize}}
	}

	query := db

	// Apply cursor filter if provided
	if cursor != "" {
		decodedCursor, err := DecodeCursor(cursor)
		if err != nil {
			return nil, err
		}

		cursorValue, err := strconv.ParseInt(decodedCursor, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid cursor value: %w", err)
		}

		if ascending {
			query = query.Where(fmt.Sprintf("%s > ?", cursorField), cursorValue)
		} else {
			query = query.Where(fmt.Sprintf("%s < ?", cursorField), cursorValue)
		}
	}

	// Order by cursor field
	if ascending {
		query = query.Order(fmt.Sprintf("%s ASC", cursorField))
	} else {
		query = query.Order(fmt.Sprintf("%s DESC", cursorField))
	}

	// Fetch one extra item to check for next page
	var items []T
	if err := query.Limit(pageSize + 1).Find(&items).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch items: %w", err)
	}

	hasNext := len(items) > pageSize
	if hasNext {
		items = items[:pageSize]
	}

	*dest = items

	// Generate cursors
	var nextCursor *string
	var previousCursor *string

	if hasNext && len(items) > 0 {
		// Get the cursor value from the last item
		// This is simplified - in production you'd use reflection or a type-safe approach
		lastCursor := EncodeCursor(items[len(items)-1])
		nextCursor = &lastCursor
	}

	if cursor != "" && len(items) > 0 {
		// Get the cursor value from the first item
		firstCursor := EncodeCursor(items[0])
		previousCursor = &firstCursor
	}

	return &CursorPagination[T]{
		Items:          items,
		NextCursor:     nextCursor,
		PreviousCursor: previousCursor,
		HasNext:        hasNext,
		HasPrevious:    cursor != "",
		PageSize:       pageSize,
	}, nil
}

// CursorPaginateString paginates using a string cursor (like UUID or timestamp)
func CursorPaginateString[T any](
	db *gorm.DB,
	dest *[]T,
	cursor string,
	pageSize int,
	cursorField string,
	ascending bool,
) (*CursorPagination[T], error) {
	// Constrain page size
	if pageSize > {{maxPageSize}} {
		pageSize = {{maxPageSize}}
	}
	if pageSize < 1 {
		pageSize = {{defaultPageSize}}
	}

	query := db

	// Apply cursor filter if provided
	if cursor != "" {
		decodedCursor, err := DecodeCursor(cursor)
		if err != nil {
			return nil, err
		}

		if ascending {
			query = query.Where(fmt.Sprintf("%s > ?", cursorField), decodedCursor)
		} else {
			query = query.Where(fmt.Sprintf("%s < ?", cursorField), decodedCursor)
		}
	}

	// Order by cursor field
	if ascending {
		query = query.Order(fmt.Sprintf("%s ASC", cursorField))
	} else {
		query = query.Order(fmt.Sprintf("%s DESC", cursorField))
	}

	// Fetch one extra item to check for next page
	var items []T
	if err := query.Limit(pageSize + 1).Find(&items).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch items: %w", err)
	}

	hasNext := len(items) > pageSize
	if hasNext {
		items = items[:pageSize]
	}

	*dest = items

	// Generate cursors
	var nextCursor *string
	var previousCursor *string

	if hasNext && len(items) > 0 {
		lastCursor := EncodeCursor(items[len(items)-1])
		nextCursor = &lastCursor
	}

	if cursor != "" && len(items) > 0 {
		firstCursor := EncodeCursor(items[0])
		previousCursor = &firstCursor
	}

	return &CursorPagination[T]{
		Items:          items,
		NextCursor:     nextCursor,
		PreviousCursor: previousCursor,
		HasNext:        hasNext,
		HasPrevious:    cursor != "",
		PageSize:       pageSize,
	}, nil
}
