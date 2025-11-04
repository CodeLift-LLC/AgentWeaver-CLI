"""
Cursor-based Pagination for FastAPI

Efficient pagination for large datasets using cursor-based approach.
Best for: Infinite scrolling, real-time feeds, large datasets
"""

from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import Column, select
from base64 import b64encode, b64decode

T = TypeVar("T")


class CursorPaginationParams(BaseModel):
    """Query parameters for cursor pagination"""
    cursor: Optional[str] = None
    limit: int = {{defaultPageSize}}

    class Config:
        extra = "forbid"


class CursorPaginationResponse(BaseModel, Generic[T]):
    """Response model for cursor-based pagination"""
    data: List[T]
    next_cursor: Optional[str] = None
    previous_cursor: Optional[str] = None
    has_next: bool = False
    has_previous: bool = False

    class Config:
        from_attributes = True


def encode_cursor(value: any) -> str:
    """Encode cursor value to base64 string"""
    return b64encode(str(value).encode()).decode()


def decode_cursor(cursor: str) -> str:
    """Decode base64 cursor string"""
    try:
        return b64decode(cursor.encode()).decode()
    except Exception:
        return ""


async def cursor_paginate(
    db: Session,
    query: select,
    cursor_column: Column,
    params: CursorPaginationParams,
    direction: str = "forward"
) -> tuple[List, Optional[str], Optional[str]]:
    """
    Perform cursor-based pagination on a SQLAlchemy query

    Args:
        db: Database session
        query: SQLAlchemy select query
        cursor_column: Column to use for cursor (usually id or created_at)
        params: Pagination parameters
        direction: "forward" or "backward"

    Returns:
        Tuple of (items, next_cursor, previous_cursor)

    Example:
        ```python
        from sqlalchemy import select
        from app.models import User

        @app.get("/users")
        async def list_users(
            cursor: Optional[str] = None,
            limit: int = 20,
            db: Session = Depends(get_db)
        ):
            params = CursorPaginationParams(cursor=cursor, limit=limit)
            query = select(User).order_by(User.id.asc())

            items, next_cursor, prev_cursor = await cursor_paginate(
                db, query, User.id, params
            )

            return CursorPaginationResponse(
                data=items,
                next_cursor=next_cursor,
                previous_cursor=prev_cursor,
                has_next=next_cursor is not None,
                has_previous=prev_cursor is not None
            )
        ```
    """
    limit = min(params.limit, {{maxPageSize}})

    # Decode cursor if provided
    cursor_value = None
    if params.cursor:
        cursor_value = decode_cursor(params.cursor)

    # Apply cursor filter
    if cursor_value:
        if direction == "forward":
            query = query.where(cursor_column > cursor_value)
        else:
            query = query.where(cursor_column < cursor_value)

    # Fetch limit + 1 to check if there are more items
    query = query.limit(limit + 1)

    # Execute query
    result = db.execute(query)
    items = list(result.scalars().all())

    # Check if there are more items
    has_more = len(items) > limit
    if has_more:
        items = items[:limit]

    # Generate cursors
    next_cursor = None
    previous_cursor = None

    if items:
        if has_more:
            last_item_cursor = getattr(items[-1], cursor_column.name)
            next_cursor = encode_cursor(last_item_cursor)

        if cursor_value:
            first_item_cursor = getattr(items[0], cursor_column.name)
            previous_cursor = encode_cursor(first_item_cursor)

    return items, next_cursor, previous_cursor
