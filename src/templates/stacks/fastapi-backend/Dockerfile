# Multi-stage Dockerfile for FastAPI production build

# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Stage 2: Runner
FROM python:3.11-slim AS runner

WORKDIR /app

# Create non-root user
RUN useradd -m -u 1001 fastapi

# Copy virtual environment from builder
COPY --from=builder --chown=fastapi:fastapi /app/.venv /app/.venv

# Copy application code
COPY --chown=fastapi:fastapi . .

# Switch to non-root user
USER fastapi

# Add virtual environment to PATH
ENV PATH="/app/.venv/bin:$PATH"

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
