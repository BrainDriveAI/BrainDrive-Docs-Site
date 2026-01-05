# API Reference Guide Planning Draft

## Scope: What Should This Cover?

Based on the codebase, there are three distinct API surfaces a developer might need:

| API Surface | Description | Current State |
|-------------|-------------|---------------|
| 1. BrainDrive Core Backend | FastAPI REST endpoints (port 8005) — auth, plugins, settings, pages, etc. | Placeholder only ("see localhost:8005/docs") |
| 2. Service Bridges | Frontend TypeScript interfaces plugins use in React | Documented but scattered across files |
| 3. Plugin API Contracts | How plugins register endpoints, expose modules, define metadata | Covered in lifecycle_manager docs |

## Proposed Structure

### Option A: Multiple files
```
docs-core/reference/
├── API.md                    # Overview + links to subsections
├── backend-api.md            # Core REST endpoints
├── service-bridges-api.md    # All 6 bridges with full method signatures
└── plugin-api-contracts.md   # Plugin registration, metadata format
```

### Option B: Single comprehensive file
```
docs-core/reference/
└── API.md                    # Everything in one place (~500-800 lines)
```

## Information I Need From You

### 1. Backend API Endpoints

The FastAPI backend auto-generates OpenAPI docs at localhost:8005/docs when running.

**Questions:**
- Can you run BrainDrive locally and share the OpenAPI JSON or a screenshot/export of the Swagger docs?
- Alternatively, can you point me to the FastAPI route files in the BrainDrive-Core repo? (e.g., `backend/api/routes/`)

**What I need to document:**
- Authentication endpoints (login, token refresh, etc.)
- Plugin management endpoints (install, uninstall, list)
- Settings endpoints (get/set user and system settings)
- Page/Layout endpoints (if plugins interact with these)
- Any other commonly-used endpoints

### 2. Service Bridge Method Signatures

The Service Bridges doc shows high-level examples but not full method signatures.

**Questions:**
- Are there TypeScript interface definitions in BrainDrive-Core I can reference? (e.g., `frontend/src/services/` or similar)
- Should I pull these from the example plugin repos?

**What I need to document for each bridge:**
```typescript
// Example format for API Bridge
interface APIBridge {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T>;
  postStreaming(endpoint: string, data: any, onChunk: (chunk: string) => void): Promise<void>;
  // etc.
}
```

### 3. Authentication Model

**Questions:**
- How does authentication work? (JWT tokens, sessions, API keys?)
- How do plugins access the current user context?
- Are there different auth scopes (user vs. system)?

### 4. Location Decision

**Question:**
Should this live in BrainDrive-Core repo (synced to docs site) or be authored directly in this docs repo?

| Location | Pros | Cons |
|----------|------|------|
| BrainDrive-Core | Stays close to source code, can auto-generate | Another repo to update |
| This docs repo | Easier to iterate, no sync needed | May drift from actual API |

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

## Next Steps

1. **You provide:** Backend API source (OpenAPI export, route files, or screenshots)
2. **You provide:** Service Bridge TypeScript interfaces (or confirm I should pull from example repos)
3. **You decide:** Single file vs. multiple files? Live in this repo or BrainDrive-Core?
4. **I draft:** The API Reference based on actual endpoints and signatures
5. **You review:** We iterate until it's accurate

Does this plan make sense? What information can you provide first?
