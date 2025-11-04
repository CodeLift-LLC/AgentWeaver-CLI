---
name: Monitoring & Observability
description: Production-ready monitoring, logging, metrics, and alerting patterns using Prometheus, Grafana, Sentry, and observability best practices for distributed systems.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
tags:
  - monitoring
  - observability
  - logging
  - metrics
  - prometheus
  - grafana
  - sentry
  - alerts
  - devops
---

# Monitoring & Observability Skill

This skill provides comprehensive patterns for implementing production-grade monitoring, logging, metrics collection, and alerting to ensure system reliability and rapid incident response.

## When to Use

- Setting up application and infrastructure monitoring
- Implementing structured logging with correlation IDs
- Creating custom metrics and dashboards
- Setting up alerting for critical issues
- Tracking application performance and errors
- Implementing distributed tracing
- Building observability into microservices

## Core Concepts

### The Three Pillars of Observability

**1. Metrics (Prometheus, Grafana)**
- Quantitative measurements over time
- CPU, memory, request rates, latency
- Aggregated data, efficient storage

**2. Logs (ELK Stack, Loki, CloudWatch)**
- Discrete events with context
- Application errors, audit trails
- Searchable, timestamped records

**3. Traces (Jaeger, Zipkin, OpenTelemetry)**
- Request flow through distributed systems
- Service dependencies and bottlenecks
- End-to-end request visibility

### Key Metrics to Monitor

**RED Method (Request-centric)**
- Rate: Requests per second
- Errors: Failed requests per second
- Duration: Request latency distribution

**USE Method (Resource-centric)**
- Utilization: Percentage of resource in use
- Saturation: Amount of queued work
- Errors: Error count

### Alert Design Principles

- Alert on symptoms, not causes
- Make alerts actionable
- Include context and runbook links
- Avoid alert fatigue
- Use severity levels appropriately

## Implementation Examples

### Prometheus Metrics in Node.js

```typescript
// src/monitoring/metrics.ts
import express from 'express';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({ prefix: 'myapp_' });

// Custom metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 3, 5, 10]
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['type']
});

export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

export const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_name']
});

export const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_name']
});

export const backgroundJobsProcessed = new Counter({
  name: 'background_jobs_processed_total',
  help: 'Total number of background jobs processed',
  labelNames: ['job_name', 'status']
});

// Metrics endpoint
export function setupMetricsEndpoint(app: express.Application) {
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}

// src/middleware/monitoring.ts
import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestTotal, activeConnections } from './metrics';

export function monitoringMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Track active connections
  activeConnections.inc({ type: 'http' });

  // Monitor response
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    // Record metrics
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode.toString()
      },
      duration
    );

    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode.toString()
    });

    activeConnections.dec({ type: 'http' });
  });

  next();
}

// Usage
import express from 'express';
import { monitoringMiddleware, setupMetricsEndpoint } from './middleware/monitoring';

const app = express();
app.use(monitoringMiddleware);
setupMetricsEndpoint(app);
```

### Structured Logging with Winston

```typescript
// src/monitoring/logger.ts
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Custom format for adding correlation ID
const addCorrelationId = winston.format((info, opts) => {
  info.correlationId = opts.correlationId || uuidv4();
  return info;
});

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'myapp',
    environment: process.env.NODE_ENV
  },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Write errors to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

// Add request context logging
export function createRequestLogger(req: Request) {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();

  return logger.child({
    correlationId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
}

// Usage in route handlers
app.get('/api/users/:id', async (req, res) => {
  const log = createRequestLogger(req);

  log.info('Fetching user', { userId: req.params.id });

  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      log.warn('User not found', { userId: req.params.id });
      return res.status(404).json({ error: 'User not found' });
    }

    log.info('User fetched successfully', { userId: user.id });
    res.json(user);
  } catch (error) {
    log.error('Failed to fetch user', {
      userId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Sentry Error Tracking

```typescript
// src/monitoring/sentry.ts
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { Request, Response, NextFunction } from 'express';

export function initializeSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION || 'unknown',

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [new ProfilingIntegration()],

    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive information
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers['authorization'];
        }
      }
      return event;
    }
  });
}

// Sentry middleware
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler();
}

export function sentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture 4xx and 5xx errors
      if (error.status >= 400) {
        return true;
      }
      return false;
    }
  });
}

// Manual error capture with context
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
    tags: {
      component: context?.component || 'unknown'
    }
  });
}

// Usage in Express app
import express from 'express';
import { initializeSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from './monitoring/sentry';

const app = express();

initializeSentry();

// Sentry middleware must be first
app.use(sentryRequestHandler());
app.use(sentryTracingHandler());

// Your routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    captureError(error as Error, { route: '/api/users', method: 'GET' });
    throw error;
  }
});

// Error handler must be last
app.use(sentryErrorHandler());
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'production'
    environment: 'prod'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Load rules
rule_files:
  - '/etc/prometheus/rules/*.yml'

# Scrape configurations
scrape_configs:
  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node exporter (system metrics)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # Application metrics
  - job_name: 'myapp'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - production
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: myapp
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
      - source_labels: [__address__]
        target_label: __address__
        regex: (.+):(.+)
        replacement: ${1}:3000

  # PostgreSQL metrics
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  # Redis metrics
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### Alert Rules

```yaml
# prometheus/rules/alerts.yml
groups:
  - name: application_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: |
          (
            sum(rate(http_requests_total{status_code=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))
          ) > 0.05
        for: 5m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} (over 5%)"
          runbook_url: "https://wiki.example.com/runbooks/high-error-rate"

      # High response time
      - alert: HighResponseTime
        expr: |
          histogram_quantile(0.95,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)
          ) > 2
        for: 10m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "High response time on {{ $labels.route }}"
          description: "95th percentile response time is {{ $value }}s"

      # Service down
      - alert: ServiceDown
        expr: up{job="myapp"} == 0
        for: 2m
        labels:
          severity: critical
          team: sre
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          description: "{{ $labels.instance }} has been down for more than 2 minutes"
          runbook_url: "https://wiki.example.com/runbooks/service-down"

      # High memory usage
      - alert: HighMemoryUsage
        expr: |
          (
            process_resident_memory_bytes{job="myapp"}
            /
            node_memory_MemTotal_bytes
          ) > 0.85
        for: 5m
        labels:
          severity: warning
          team: sre
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      # Database connection pool exhaustion
      - alert: DatabasePoolExhaustion
        expr: |
          (
            sum(active_connections{type="db"})
            /
            sum(max_connections{type="db"})
          ) > 0.9
        for: 5m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Using {{ $value | humanizePercentage }} of available connections"

  - name: business_metrics
    interval: 60s
    rules:
      # Low conversion rate
      - alert: LowConversionRate
        expr: |
          (
            sum(rate(conversions_total[1h]))
            /
            sum(rate(visitors_total[1h]))
          ) < 0.02
        for: 30m
        labels:
          severity: warning
          team: product
        annotations:
          summary: "Conversion rate dropped below 2%"
          description: "Current conversion rate is {{ $value | humanizePercentage }}"
```

### Grafana Dashboard (JSON)

```json
{
  "dashboard": {
    "title": "Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (route)",
            "legendFormat": "{{route}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status_code=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))",
            "legendFormat": "Error Rate"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))",
            "legendFormat": "{{route}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Database Query Duration",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(db_query_duration_seconds_bucket[5m])) by (le, operation))",
            "legendFormat": "{{operation}}"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

### Docker Compose Monitoring Stack

```yaml
# docker-compose.monitoring.yml
version: '3.9'

services:
  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/rules:/etc/prometheus/rules
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
    networks:
      - monitoring

  # Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    depends_on:
      - prometheus
    networks:
      - monitoring

  # Alert Manager
  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/config.yml:/etc/alertmanager/config.yml
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/config.yml'
      - '--storage.path=/alertmanager'
    networks:
      - monitoring

  # Node Exporter (system metrics)
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring

  # Loki (log aggregation)
  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    volumes:
      - ./loki/config.yml:/etc/loki/config.yml
      - loki_data:/loki
    command: -config.file=/etc/loki/config.yml
    networks:
      - monitoring

  # Promtail (log shipper)
  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - ./promtail/config.yml:/etc/promtail/config.yml
      - /var/log:/var/log:ro
      - ./logs:/app/logs:ro
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:
  loki_data:

networks:
  monitoring:
    driver: bridge
```

### Alert Manager Configuration

```yaml
# alertmanager/config.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
      continue: true
    - match:
        severity: warning
      receiver: 'warning-alerts'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'critical-alerts'
    slack_configs:
      - channel: '#critical-alerts'
        title: 'CRITICAL: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
        send_resolved: true
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'
        description: '{{ .GroupLabels.alertname }}'

  - name: 'warning-alerts'
    slack_configs:
      - channel: '#warnings'
        title: 'Warning: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

## Best Practices

### 1. Implement Health Checks

```typescript
// src/health.ts
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      externalApi: await checkExternalApi()
    }
  };

  const isHealthy = Object.values(health.checks).every(check => check.status === 'healthy');

  res.status(isHealthy ? 200 : 503).json(health);
});

async function checkDatabase() {
  try {
    await db.query('SELECT 1');
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

### 2. Use Correlation IDs

```typescript
// Track requests across services
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
});
```

### 3. Set Up SLIs/SLOs

```yaml
# Define Service Level Indicators and Objectives
SLI:
  - Availability: 99.9%
  - Latency (p95): < 500ms
  - Error Rate: < 0.1%

SLO:
  - 99.9% of requests succeed
  - 95% of requests complete in < 500ms
  - Error budget: 43.2 minutes/month downtime
```

### 4. Monitor Business Metrics

```typescript
// Track business-critical metrics
export const userSignups = new Counter({
  name: 'user_signups_total',
  help: 'Total number of user signups'
});

export const revenue = new Counter({
  name: 'revenue_total',
  help: 'Total revenue in cents',
  labelNames: ['currency']
});
```

## Common Pitfalls

### ❌ Pitfall 1: Alert Fatigue
Too many alerts, most not actionable

### ✅ Solution:
Alert only on actionable symptoms, use proper severity levels

### ❌ Pitfall 2: Insufficient Context
Alerts without enough information to debug

### ✅ Solution:
Include runbook links, relevant metrics, and context in alerts

### ❌ Pitfall 3: No Correlation IDs
Can't trace requests across services

### ✅ Solution:
Implement correlation IDs throughout the system

### ❌ Pitfall 4: Logging Sensitive Data
Exposing PII or secrets in logs

### ✅ Solution:
Redact sensitive information before logging

## References

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Sentry Documentation](https://docs.sentry.io/)
- [The Three Pillars of Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/ch04.html)
- [Google SRE Book - Monitoring](https://sre.google/sre-book/monitoring-distributed-systems/)
- [RED Method](https://www.weave.works/blog/the-red-method-key-metrics-for-microservices-architecture/)
