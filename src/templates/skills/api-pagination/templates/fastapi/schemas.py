"""
Pydantic Schemas for Pagination

Shared schemas for both cursor-based and offset-based pagination
"""

from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationLinks(BaseModel):
    """HATEOAS links for pagination"""
    first: Optional[str] = None
    previous: Optional[str] = None
    next: Optional[str] = None
    last: Optional[str] = None


class CursorPagination(BaseModel):
    """Cursor pagination metadata"""
    next_cursor: Optional[str] = Field(None, description="Cursor for next page")
    previous_cursor: Optional[str] = Field(None, description="Cursor for previous page")
    has_next: bool = Field(False, description="Whether there is a next page")
    has_previous: bool = Field(False, description="Whether there is a previous page")
    page_size: int = Field(..., description="Number of items per page")


class OffsetPagination(BaseModel):
    """Offset pagination metadata"""
    current_page: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, description="Items per page")
    total_items: int = Field(..., ge=0, description="Total number of items")
    total_pages: int = Field(..., ge=0, description="Total number of pages")
    has_next: bool = Field(..., description="Whether there is a next page")
    has_previous: bool = Field(..., description="Whether there is a previous page")


class CursorPaginatedResponse(BaseModel, Generic[T]):
    """Generic cursor-based paginated response"""
    data: List[T] = Field(..., description="List of items")
    pagination: CursorPagination = Field(..., description="Pagination metadata")
    links: Optional[PaginationLinks] = Field(None, description="HATEOAS links")

    class Config:
        from_attributes = True


class OffsetPaginatedResponse(BaseModel, Generic[T]):
    """Generic offset-based paginated response"""
    data: List[T] = Field(..., description="List of items")
    pagination: OffsetPagination = Field(..., description="Pagination metadata")
    links: Optional[PaginationLinks] = Field(None, description="HATEOAS links")

    class Config:
        from_attributes = True
