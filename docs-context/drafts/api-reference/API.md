# API Reference

This reference documents the BrainDrive APIs available to plugin developers and integrations.

## Overview

BrainDrive exposes three API surfaces:

| API Surface | Description | When to Use |
|-------------|-------------|-------------|
| [Backend REST API](./backend-api.md) | FastAPI endpoints at `localhost:8005` | Direct HTTP calls, backend integrations |
| [Service Bridges](./service-bridges-api.md) | Frontend TypeScript interfaces | Plugin frontend code (React components) |
| [Plugin API Contracts](./plugin-api-contracts.md) | Plugin registration and lifecycle | Plugin manifest, module definitions |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      BrainDrive Frontend                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Plugin A  │  │   Plugin B  │  │    Core UI          │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│                  ┌───────▼───────┐                           │
│                  │Service Bridges│                           │
│                  │ (TypeScript)  │                           │
│                  └───────┬───────┘                           │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTP/WebSocket
┌──────────────────────────▼───────────────────────────────────┐
│                   BrainDrive Backend                          │
│                   FastAPI (port 8005)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Auth   │ │ Plugins  │ │  Pages   │ │   AI Providers   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Authentication

BrainDrive uses **JWT tokens** for authentication.

- Tokens are obtained via `POST /api/v1/auth/login`
- Include the token in the `Authorization` header: `Bearer <token>`
- Refresh tokens via `POST /api/v1/auth/refresh`
- Plugins access user context automatically through the Service Bridges

**Current scope:** All resources are user-owned. There is no multi-tenant or admin scope at this time.

## Base URL

| Environment | URL |
|-------------|-----|
| Local Development | `http://localhost:8005` |
| API Docs (Swagger) | `http://localhost:8005/docs` |

## Response Format

All endpoints return JSON. Successful responses typically include the requested data directly. Error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

Validation errors include field-level details:

```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (valid token, insufficient permissions) |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Quick Links

- **Getting started with plugins?** See [Plugin API Contracts](./plugin-api-contracts.md)
- **Making API calls from a plugin?** See [Service Bridges](./service-bridges-api.md)
- **Building a backend integration?** See [Backend REST API](./backend-api.md)
