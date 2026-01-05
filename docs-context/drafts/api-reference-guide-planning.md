# API Reference Guide Planning Draft

**Last Updated:** January 5, 2025 (draft complete, ready for review)

## Scope: What Should This Cover?

Based on the codebase, there are three distinct API surfaces a developer might need:

| API Surface | Description | Current State |
|-------------|-------------|---------------|
| 1. BrainDrive Core Backend | FastAPI REST endpoints (port 8005) — auth, plugins, settings, pages, etc. | Placeholder only ("see localhost:8005/docs") |
| 2. Service Bridges | Frontend TypeScript interfaces plugins use in React | Documented but scattered across files |
| 3. Plugin API Contracts | How plugins register endpoints, expose modules, define metadata | Covered in lifecycle_manager docs |

## Structure Decision

✅ **Decided: Option A (Multiple files)**

Rationale from David Jones: Grouping by what developers are trying to accomplish helps avoid overwhelming them. The full Swagger documentation gives you everything at once, which is "a daunting list." Breaking it down by purpose is more approachable.

```
docs-core/reference/
├── API.md                    # Overview + links to subsections
├── backend-api.md            # Core REST endpoints
├── service-bridges-api.md    # All 6 bridges with full method signatures
└── plugin-api-contracts.md   # Plugin registration, metadata format
```

## Information Sources

### 1. Backend API Endpoints

✅ **Confirmed: All information is in Swagger**

The FastAPI backend auto-generates OpenAPI docs at `localhost:8005/docs` when running.

**How to get the data:**
- Run BrainDrive locally in VS Code (not Codespace) to access `localhost:8005/docs`
- The OpenAPI JSON can be exported directly from Swagger (David Jones to look up exact method, or Claude can help)
- Claude can make curl requests to fetch the OpenAPI spec directly when running locally

**What to document:**
- Authentication endpoints (login, token refresh, etc.)
- Plugin management endpoints (install, uninstall, list)
- Settings endpoints (get/set user and system settings)
- Page/Layout endpoints (if plugins interact with these)
- Any other commonly-used endpoints

### 2. Service Bridge Method Signatures

✅ **Confirmed: All information is in Swagger**

David Jones clarified that the Swagger docs contain all the interface definitions, including:
- Full method signatures (like `get<T>(endpoint: string, options?: RequestOptions)`)
- Nested types like `RequestOptions` are documented at the bottom of Swagger docs
- No need to pull from example plugin repos — Swagger has everything

**Example of what Swagger provides:**
```typescript
// API Bridge interface with generics
interface APIBridge {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T>;
  // The <T> generic contains endpoint (string), options (RequestOptions)
  // RequestOptions is another JSON with its own signature shown in Swagger
}
```

### 3. Authentication Model

✅ **Confirmed:**
- **Method:** JWT tokens
- **Plugin access:** Plugins access user context via the JWT token in the request packet
- **Scopes:** Auth scopes exist in the system but aren't actively used yet
- **Current model:** Everything is owned by the user — security funnels all access back to the user level
- **Future:** Administrators and permissions will be added later (tenants, etc.), but for now focus documentation on user-level auth only

### 4. Location Decision

✅ **Decided: BrainDrive-Core repo**

API reference docs will live in BrainDrive-Core and sync to this docs site.

## Proposed Outline (Once I Have the Info)

### API Reference Guide Structure

```markdown
# API Reference

## Overview
- Architecture overview (Backend + Service Bridges)
- Base URLs and ports
- Authentication

## Backend REST API

### Authentication
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- GET /api/v1/auth/me

### Plugins
- GET /api/v1/plugins
- POST /api/v1/plugins/install
- DELETE /api/v1/plugins/{id}
- GET /api/v1/plugins/{id}/status

### Settings
- GET /api/v1/settings/{key}
- PUT /api/v1/settings/{key}

### Pages
- GET /api/v1/pages
- POST /api/v1/pages
- PUT /api/v1/pages/{id}

### [Other endpoint groups...]

## Service Bridges (Frontend API)

### API Bridge
- Methods: get, post, put, delete, postStreaming
- Full signatures with types
- Example usage

### Event Bridge
- Methods: emit, on, off
- Event naming conventions
- Example usage

### Theme Bridge
- Methods: getCurrentTheme, addThemeChangeListener, removeThemeChangeListener
- Example usage

### Settings Bridge
- Methods: getSetting, setSetting
- Scopes: user vs system
- Example usage

### PageContext Bridge
- Methods: getContext, onPageContextChange
- Context object structure
- Example usage

### PluginState Bridge
- Methods: save, load, clear
- Storage limits
- Example usage

## Plugin API Contracts
- Lifecycle manager interface
- Plugin metadata format (plugin_data)
- Module metadata format (module_data)
- Registering custom endpoints

## Error Handling
- Error response format
- Common error codes
- Retry strategies
```

## Work Completed

### Drafts Created (January 5, 2025)

Location: `docs-context/drafts/api-reference/`

| File | Lines | Contents |
|------|-------|----------|
| `API.md` | 101 | Overview, architecture diagram, JWT auth, response formats, status codes |
| `backend-api.md` | 1306 | ~100 REST endpoints across 15 groups with request/response examples |
| `service-bridges-api.md` | 359 | All 6 bridges with TypeScript interfaces and usage examples |
| `plugin-api-contracts.md` | 501 | Lifecycle manager interface, manifest schema, module metadata |

**Total:** ~2,300 lines of documentation

### Data Sources Used

- **OpenAPI spec:** Exported from `localhost:8005/openapi.json` (saved to `docs-context/openapi.json`)
- **Existing docs:** Referenced `docs-core/concepts/plugins.md` and `docs-core/getting-started/plugin-developer-quickstart.md`

### Endpoints Excluded (Internal/Test)

- `/api/v1/demo/*` — Demo endpoints
- `/api/v1/auth/nuclear-clear-cookies` — Debug endpoint
- `/api/v1/auth/force-logout-clear` — Debug endpoint
- `/api/v1/auth/test-cookie-setting` — Test endpoint
- `/api/v1/ai/providers/test/*` — Test endpoints
- `/api/v1/plugins/test` — Test endpoint

## Next Steps

1. ✅ **Structure decided:** Multiple files (Option A)
2. ✅ **Data source obtained:** OpenAPI JSON exported from Swagger
3. ✅ **Location decided:** BrainDrive-Core repo (synced to docs site)
4. ✅ **Auth model clarified:** JWT tokens, user-level scope only for now
5. ✅ **Drafts created:** All 4 files complete
6. ⏳ **Review with David Jones:** Verify accuracy, especially:
   - Are excluded endpoints correct? Any that should be included?
   - Service Bridge interfaces — verify against actual TypeScript source
   - Lifecycle manager methods — verify against actual plugin implementations
7. ⏳ **Move to BrainDrive-Core:** Once approved, move files to `docs-core/reference/`

## Open Questions for Review

1. **Excluded endpoints:** Should any of the test/demo endpoints be documented for developers?

2. **Service Bridges accuracy:** The TypeScript interfaces in `service-bridges-api.md` are inferred from:
   - The REST API structure
   - Existing plugin documentation
   - Should be verified against `BrainDrive-Core/frontend/src/services/` (or equivalent)

3. **Lifecycle manager methods:** The Python interface in `plugin-api-contracts.md` is based on:
   - Existing plugin docs
   - Example plugins in `.cache/sources/`
   - Should be verified against the actual `lifecycle_manager_template.py`

4. **Missing sections:** Are there any API areas not covered that developers commonly need?
   - WebSocket endpoints?
   - Rate limiting info?
   - Pagination patterns?
