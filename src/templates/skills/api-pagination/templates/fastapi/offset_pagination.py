"""
Offset-based Pagination for FastAPI

Simple page-based pagination using offset and limit.
Best for: Small to medium datasets, user-facing pagination with page numbers
"""

from typing import Generic, TypeVar, List
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from math import ceil

T = TypeVar("T")


class OffsetPaginationParams(BaseModel):
    """Query parameters for offset pagination"""
    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    limit: int = Field(
        default={{defaultPageSize}},
        ge=1,
        le={{maxPageSize}},
        description="Items per page"
    )

    @property
    def offset(self) -> int:
        """Calculate offset from page number"""
        return (self.page - 1) * self.limit

    class Config:
        extra = "forbid"


class OffsetPaginationMeta(BaseModel):
    """Pagination metadata"""
    current_page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_previous: bool


class OffsetPaginationResponse(BaseModel, Generic[T]):
    """Response model for offset-based pagination"""
    data: List[T]
    pagination: OffsetPaginationMeta

    class Config:
        from_attributes = True


async def offset_paginate(
    db: Session,
    query: select,
    params: OffsetPaginationParams,
    count_query: Optional[select] = None
) -> tuple[List, int]:
    """
    Perform offset-based pagination on a SQLAlchemy query

    Args:
        db: Database session
        query: SQLAlchemy select query
        params: Pagination parameters
        count_query: Optional separate count query (for optimization)

    Returns:
        Tuple of (items, total_count)

    Example:
        ```python
        from sqlalchemy import select
        from app.models import User

        @app.get("/users", response_model=OffsetPaginationResponse[UserSchema])
        async def list_users(
            page: int = 1,
            limit: int = 20,
            db: Session = Depends(get_db)
        ):
            params = OffsetPaginationParams(page=page, limit=limit)
            query = select(User).order_by(User.created_at.desc())

            items, total = await offset_paginate(db, query, params)

            return OffsetPaginationResponse(
                data=items,
                pagination=OffsetPaginationMeta(
                    current_page=params.page,
                    page_size=params.limit,
                    total_items=total,
                    total_pages=ceil(total / params.limit),
                    has_next=params.page < ceil(total / params.limit),
                    has_previous=params.page > 1
                )
            )
        ```
    """
    # Get total count
    if count_query is None:
        # Use the same query but select count
        count_query = select(func.count()).select_from(query.subquery())

    total_count = db.execute(count_query).scalar() or 0

    # Apply offset and limit
    paginated_query = query.offset(params.offset).limit(params.limit)

    # Execute query
    result = db.execute(paginated_query)
    items = list(result.scalars().all())

    return items, total_count


def create_pagination_response(
    items: List[T],
    total_items: int,
    page: int,
    limit: int
) -> OffsetPaginationResponse[T]:
    """
    Helper function to create pagination response

    Args:
        items: List of items for current page
        total_items: Total number of items
        page: Current page number
        limit: Items per page

    Returns:
        OffsetPaginationResponse with populated metadata
    """
    total_pages = ceil(total_items / limit) if limit > 0 else 0

    return OffsetPaginationResponse(
        data=items,
        pagination=OffsetPaginationMeta(
            current_page=page,
            page_size=limit,
            total_items=total_items,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1
        )
    )
