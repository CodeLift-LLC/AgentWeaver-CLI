package pagination

// PaginatedResponse is a generic wrapper for paginated API responses
type PaginatedResponse[T any] struct {
	Data       []T             `json:"data"`
	Pagination PaginationMeta  `json:"pagination"`
	Links      *PaginationLinks `json:"links,omitempty"`
}

// PaginationMeta contains pagination metadata (works for both cursor and offset)
type PaginationMeta struct {
	// Offset pagination fields
	CurrentPage *int   `json:"current_page,omitempty"`
	TotalPages  *int   `json:"total_pages,omitempty"`
	TotalItems  *int64 `json:"total_items,omitempty"`

	// Common fields
	PageSize    int  `json:"page_size"`
	HasNext     bool `json:"has_next"`
	HasPrevious bool `json:"has_previous"`

	// Cursor pagination fields
	NextCursor     *string `json:"next_cursor,omitempty"`
	PreviousCursor *string `json:"previous_cursor,omitempty"`
}

// PaginationLinks contains HATEOAS links for pagination navigation
type PaginationLinks struct {
	First    *string `json:"first,omitempty"`
	Previous *string `json:"previous,omitempty"`
	Next     *string `json:"next,omitempty"`
	Last     *string `json:"last,omitempty"`
}

// ToResponse converts OffsetPagination to PaginatedResponse
func (p *OffsetPagination[T]) ToResponse(baseURL string) PaginatedResponse[T] {
	response := PaginatedResponse[T]{
		Data: p.Items,
		Pagination: PaginationMeta{
			CurrentPage: &p.CurrentPage,
			TotalPages:  &p.TotalPages,
			TotalItems:  &p.TotalItems,
			PageSize:    p.PageSize,
			HasNext:     p.HasNext,
			HasPrevious: p.HasPrevious,
		},
	}

	// Add HATEOAS links if base URL provided
	if baseURL != "" {
		first := fmt.Sprintf("%s?page=1&page_size=%d", baseURL, p.PageSize)
		last := fmt.Sprintf("%s?page=%d&page_size=%d", baseURL, p.TotalPages, p.PageSize)

		links := &PaginationLinks{
			First: &first,
			Last:  &last,
		}

		if p.HasPrevious {
			prev := fmt.Sprintf("%s?page=%d&page_size=%d", baseURL, p.CurrentPage-1, p.PageSize)
			links.Previous = &prev
		}

		if p.HasNext {
			next := fmt.Sprintf("%s?page=%d&page_size=%d", baseURL, p.CurrentPage+1, p.PageSize)
			links.Next = &next
		}

		response.Links = links
	}

	return response
}

// ToResponse converts CursorPagination to PaginatedResponse
func (p *CursorPagination[T]) ToResponse(baseURL string) PaginatedResponse[T] {
	response := PaginatedResponse[T]{
		Data: p.Items,
		Pagination: PaginationMeta{
			PageSize:       p.PageSize,
			HasNext:        p.HasNext,
			HasPrevious:    p.HasPrevious,
			NextCursor:     p.NextCursor,
			PreviousCursor: p.PreviousCursor,
		},
	}

	// Add HATEOAS links if base URL provided
	if baseURL != "" {
		links := &PaginationLinks{}

		if p.HasPrevious && p.PreviousCursor != nil {
			prev := fmt.Sprintf("%s?cursor=%s&page_size=%d", baseURL, *p.PreviousCursor, p.PageSize)
			links.Previous = &prev
		}

		if p.HasNext && p.NextCursor != nil {
			next := fmt.Sprintf("%s?cursor=%s&page_size=%d", baseURL, *p.NextCursor, p.PageSize)
			links.Next = &next
		}

		response.Links = links
	}

	return response
}
