# {{projectName}}

FastAPI Backend API with Vertical Slice Architecture

## Tech Stack

- **Backend**: FastAPI 0.110+, Python 3.11+
- **Package Manager**: uv (modern Python package manager)
- **Database**: Supabase (PostgreSQL 15 + pgvector)
- **ORM**: SQLAlchemy 2.0 with Alembic migrations
- **Testing**: pytest + httpx
- **API Docs**: OpenAPI/Swagger (built-in)
- **Architecture**: Vertical Slice Architecture

## Quick Start

### 1. Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Install Dependencies

```bash
uv sync
```

### 3. Start Services

```bash
docker compose up -d
```

### 4. Run Migrations

```bash
uv run alembic upgrade head
```

### 5. Start Development Server

```bash
uv run uvicorn app.main:app --reload
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

## License

MIT
