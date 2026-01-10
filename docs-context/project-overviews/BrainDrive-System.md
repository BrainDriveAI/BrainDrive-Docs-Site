# BrainDrive – Self-Hosted AI Platform (Full Context)

## Introduction and Overview

**BrainDrive** is an open-source alternative to ChatGPT that you fully own and control. It's self-hosted and MIT-licensed — *Your AI, your rules.* BrainDrive is highly modular and customizable: extend functionality through plugins and even monetize your custom AI solutions. Think **WordPress for AI**: install the BrainDrive core, then add or develop plugins to quickly ship new AI-powered features.

Out of the box, BrainDrive provides:

- A web-based **Chat** interface for interacting with AI models (streaming support)
- Built-in **AI Provider** integrations (Claude, OpenAI, Groq, OpenRouter, Ollama)
- A **Persona System** for creating custom AI characters with unique personalities
- A built-in **Plugin Manager** to install/manage extensions
- A **Page Builder** for creating custom UIs without code
- **Document Processing** for extracting text from PDFs, Word docs, and more
- Example plugins, tutorials, and developer resources

You run it locally or on any cloud server — there's no Big Tech lock-in. Use it as your personal AI or as a foundation for products/services.

**Example use cases** include:

- Custom AI chatbots with specialized knowledge or personalities
- AI-powered productivity tools that integrate with your data/workflows
- Document analysis and intelligent reports
- Custom UIs wrapping local or API-based models
- Multi-plugin workflows where several components work together

## Architecture and Core Components

BrainDrive is composed of a **Core System** and a **Plugin Ecosystem**.

### Core System (BrainDrive-Core repository)

- **Frontend:** React 18 + TypeScript web application
- **Backend:** Python FastAPI server with SQLite database (default)
- Provides the primary UI (chat, page builder, personas, etc.) and backend services (user management, plugin APIs, conversation storage, AI providers, document processing, etc.)

### Plugin Ecosystem

- Each plugin is a separate module (its own repository) that can be added dynamically
- Uses **Webpack Module Federation** to load frontend plugins at runtime
- A standardized **Lifecycle Manager** (Python) to integrate backend/installation logic
- Plugins communicate with the core through well-defined **Service Bridges**
- Decoupled design allows customizing/extending BrainDrive without modifying core; update core/plugins independently

## Backend Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| **FastAPI** | 0.115.6 | High-performance async web framework |
| **SQLModel** | 0.0.22 | ORM combining SQLAlchemy + Pydantic |
| **SQLAlchemy** | 2.0.37 | Database toolkit |
| **Pydantic** | 2.10.5 | Data validation and settings |
| **Uvicorn** | 0.34.0 | ASGI server |
| **Alembic** | 1.14.0 | Database migrations |
| **structlog** | 25.1.0 | Structured JSON logging |
| **passlib** | 1.7.4 | Password hashing |
| **python-jose** | 3.3.0 | JWT creation/verification |
| **PyJWT** | 2.10.1 | JWT tokens |
| **cryptography** | 44.0.0 | Data encryption |
| **Celery** | 5.4.0 | Background job queue |
| **Redis** | 5.2.1 | Caching and job broker |

### AI Provider Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| **anthropic** | latest | Claude API integration |
| **openai** | 1.65.5 | OpenAI API integration |
| **groq** | 0.31.0 | Groq API integration |
| **langchain** | 0.3.21 | LLM orchestration |

### Document Processing Libraries

| Package | Purpose |
|---------|---------|
| **PyPDF2**, **pdfplumber** | PDF extraction |
| **python-docx** | Word documents (.docx) |
| **python-pptx** | PowerPoint (.pptx) |
| **pandas** | Spreadsheets (Excel, CSV) |
| **BeautifulSoup4**, **lxml** | HTML/XML parsing |
| **html2text** | HTML to text conversion |
| **ebooklib** | EPUB ebooks |
| **odfpy** | OpenDocument formats |
| **markdown** | Markdown processing |

### Monitoring & Testing

| Package | Purpose |
|---------|---------|
| **prometheus-fastapi-instrumentator** | Metrics collection |
| **sentry-sdk** | Error tracking |
| **pytest** | Testing framework |
| **pytest-asyncio** | Async test support |

### Backend Features & Services

- **Authentication & Security:** JWT (access & refresh tokens), role-based access control, CORS, encrypted credential storage
- **User Management:** Registration, login, profile management; "user updaters" run on each login
- **Settings System:** Dynamic, multi-tier (system vs user) settings
- **Plugin System:** Modular discovery; install/uninstall on the fly; universal lifecycle APIs
- **AI Providers:** 5 built-in providers (Claude, OpenAI, Groq, OpenRouter, Ollama) with streaming support
- **Personas:** AI character system with custom system prompts and model settings
- **Conversation Management:** Persistent history, threads, metadata, tagging
- **Document Processing:** Extract text from 12+ file formats with chunking support
- **Background Jobs:** Celery-based job queue for long-running operations
- **Navigation & UI Schema:** Backend provides navigation structure and component manifests
- **Monitoring:** Prometheus metrics, Sentry error tracking, health endpoints
- **Misc:** Environment-based config, structured logging, diagnostics endpoints

### Database Models (19 total)

| Model | Purpose |
|-------|---------|
| **User** | User accounts with profile info |
| **Conversation** | Chat sessions with AI |
| **Message** | Individual messages in conversations |
| **Page** | Page Builder pages (JSON content) |
| **NavigationRoute** | Hierarchical menu structure |
| **Plugin** | Plugin metadata and configuration |
| **Persona** | AI character definitions |
| **Component** | UI component registry |
| **Job** | Background job tracking |
| **Tag** | Categorization for conversations |
| **PluginState** | Plugin persistent state (per-page) |
| **Settings** | User and application settings |
| **Role** | User roles and permissions |
| **TenantUser** | Multi-tenancy support |
| **OAuthAccount** | OAuth provider accounts |
| **Session** | Active user sessions |

## Frontend Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 18.3.1 | Component-driven UI |
| **TypeScript** | 5.0.2 | Static typing |
| **Vite** | 4.4.5 | Fast dev server & bundler |
| **Material-UI (MUI)** | 5.14.4 | UI component library |
| **React Router** | 7.2.0 | Client-side navigation |
| **react-grid-layout** | 1.3.4 | Draggable/resizable grid |
| **Axios** | 1.7.9 | HTTP client |
| **Zod** | 3.24.2 | Runtime schema validation |
| **@originjs/vite-plugin-federation** | 1.3.9 | Module Federation for plugins |
| **Jest** | 30.0.5 | Testing framework |
| **@testing-library/react** | 16.3.0 | React component testing |

### Frontend Features & UI

- **Chat Interface:** Real-time streaming chat with multiple AI providers
- **Personas:** Create and manage AI characters with custom personalities
- **Plugin Manager:** Browse, install, remove, and update plugins; enter a GitHub URL to install
- **Visual Page Builder (PluginStudio):** Drag-and-drop components; responsive layouts; per-component properties
- **Page & Route Management:** Create/organize pages; routes generated automatically and persisted
- **Component Configuration:** Per-instance configuration UIs based on plugin manifest
- **Theme Support:** Light/dark themes; plugins react to theme changes via the Theme service
- **Authentication:** Secure flows; feature visibility by role/permissions
- **Real-Time Preview:** Hot-reload in dev; immediate visual feedback
- **Import/Export:** Export/import page layouts as JSON
- **Error Handling:** Error boundaries, graceful failures
- **Extensible Service Architecture:** 25+ services with Service Bridges keeping plugins decoupled from core

### Frontend Architecture

```
frontend/src/
├── components/       # 30+ reusable UI components
├── contexts/         # 12 React context providers
│   ├── AuthContext
│   ├── ThemeContext
│   ├── ServiceContext
│   ├── PluginContext
│   └── ...
├── services/         # 25+ service modules
│   ├── ApiService
│   ├── SettingsService
│   ├── EventService
│   ├── NavigationService
│   └── ...
├── features/         # Feature modules
│   ├── personas/
│   ├── plugin-installer/
│   ├── plugin-manager/
│   ├── plugin-studio/
│   └── unified-dynamic-page-renderer/
├── pages/            # Main application pages
├── plugin/           # Plugin infrastructure
│   ├── ServiceBridge.ts    # Access-controlled service proxy
│   └── eventBus.ts
├── types/            # TypeScript type definitions
├── hooks/            # Custom React hooks
└── utils/            # Utility functions
```

The frontend and backend communicate primarily over HTTP (REST) with Server-Sent Events (SSE) for streaming. You can run both locally or deploy separately.

## AI Provider System

BrainDrive includes 5 built-in AI provider integrations:

| Provider | Features |
|----------|----------|
| **Claude (Anthropic)** | Full API support, streaming, vision capabilities |
| **OpenAI** | GPT-3.5, GPT-4, streaming |
| **Groq** | Fast inference, streaming |
| **OpenRouter** | Multi-model routing, fallback support |
| **Ollama** | Local model serving, no API key needed |

### Provider Architecture

All providers implement a common interface:

```python
class AIProvider(ABC):
    async def initialize(config) -> bool
    async def get_models() -> List[Dict]
    async def generate_text(prompt, model, params) -> Dict
    async def generate_stream(prompt, model, params) -> AsyncGenerator
    async def chat_completion(messages, model, params) -> Dict
    async def chat_completion_stream(messages, model, params) -> AsyncGenerator
    async def validate_connection(config) -> Dict
```

### Provider Registry

- Central registry pattern for provider instances
- Per-user provider configuration with encrypted credentials
- Dynamic provider instantiation and caching
- Model preferences and rate limiting

## Document Processing

BrainDrive can extract text from 12+ document formats:

| Format | Extension | Library |
|--------|-----------|---------|
| PDF | .pdf | pdfplumber, PyPDF2 |
| Word | .docx | python-docx |
| PowerPoint | .pptx | python-pptx |
| Excel | .xlsx, .xls | pandas |
| CSV | .csv | pandas |
| HTML | .html, .htm | BeautifulSoup4 |
| Markdown | .md | markdown |
| JSON | .json | stdlib |
| EPUB | .epub | ebooklib |
| OpenDocument | .odt, .ods | odfpy |
| RTF | .rtf | striprtf |
| Plain Text | .txt | stdlib |

### Processing Pipeline

```
Upload → Detect Type → Extract Content → Validate Size → Chunk (optional) → Return
```

Features:
- Automatic file type detection (magic bytes + MIME)
- Configurable chunking with overlap for RAG applications
- Metadata extraction
- Text normalization

## Installation Guide

BrainDrive is actively tested on Windows, macOS, and Linux.

### Prerequisites

- **Conda** (Anaconda/Miniconda) recommended for Python env management
- **Git** to clone repositories
- **Node.js** 18+ (npm)

> **Dev note:** Use two terminals: one for the backend, one for the frontend.

### Step 1: Set Up a Python Environment

Create an isolated environment (example with Conda):

```bash
conda create -n BrainDriveDev -c conda-forge python=3.11 nodejs git -y
conda activate BrainDriveDev
```

### Step 2: Clone the Repository

```bash
git clone https://github.com/BrainDriveAI/BrainDrive-Core.git
cd BrainDrive-Core
```

### Step 3: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Create your backend config:

```bash
# macOS/Linux
cp .env-dev .env

# Windows
copy .env-dev .env
```

Edit `.env` as needed (host, port, debug flags, etc.).

### Step 4: Run the Backend Server

```bash
uvicorn main:app --host localhost --port 8005
```

FastAPI will be at `http://localhost:8005` (Swagger at `/api/v1/docs`).

### Step 5: Install Frontend Dependencies

```bash
cd ../frontend  # from repo root
npm install
```

Create your frontend config:

```bash
# macOS/Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Remove any auto-login credentials in `.env` before production use.

### Step 6: Run the Frontend (Development Mode)

```bash
npm run dev
```

The app will open at `http://localhost:5173` and connect to the backend on `localhost:8005`.

**Tip:** After reboots, re-activate `BrainDriveDev` in two terminals and repeat Step 4 & Step 6. Your data (SQLite DB, plugins, etc.) persists in the backend folder.

## Production Deployment (Basic)

1. In `backend/.env`, set `APP_ENV=prod`, `DEBUG=false`, `RELOAD=false` and adjust hosts.
2. Set `ENCRYPTION_MASTER_KEY` for credential encryption (required in production).
3. Run backend under a process manager (e.g., `systemd`/`supervisor`):

```ini
# Example systemd unit
[Unit]
Description=BrainDrive Backend
After=network.target

[Service]
User=BrainDriveAI
WorkingDirectory=/opt/BrainDrive/backend
Environment="PATH=/opt/BrainDrive/backend/venv/bin"
ExecStart=/opt/BrainDrive/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8005 --workers 4
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable braindrive && sudo systemctl start braindrive
```

4. Build the frontend:

```bash
cd frontend
npm run build
# Serve ./dist with your preferred static server or reverse proxy.
```

## Using BrainDrive (Basics)

- Start at the **Chat** interface. Configure your preferred AI provider in Settings.
- Create **Personas** to customize AI behavior with unique personalities and system prompts.
- Use **Plugin Manager → Install Plugins** and paste a plugin's GitHub URL to add new functionality.
  - **Enable/Disable** plugins without uninstalling
  - **Update** plugins when new releases are available (user-scoped)
  - **Uninstall** removes files and data for the current user
- Use the **Page Builder** to create custom dashboards by dragging components onto a canvas. Resize/configure visually, create multiple pages, and export/import JSON layouts.
- Upload documents for text extraction and analysis.

Behind the scenes, the frontend uses **Service Bridges** to interact with the backend and orchestrate plugins. Plugins call services instead of hard-coding internal APIs, preserving forward compatibility.

## Plugin Development Guide

BrainDrive aims for a **1-minute development cycle** for plugins.

### Structure and Lifecycle

A typical plugin repository layout:

```
MyPlugin/
├─ plugin.json           # Plugin metadata
├─ package.json
├─ src/
│  ├─ index.ts          # Entry point
│  ├─ component.tsx     # Main React component
│  └─ services/         # Plugin-specific services
├─ dist/                 # Built output (includes remoteEntry.js)
├─ lifecycle_manager.py  # Backend lifecycle manager (optional)
└─ README.md
```

- **Lifecycle Manager:** Define a `*LifecycleManager` class implementing standard methods:
  - `install_plugin(user_id, db)` — Installation hook
  - `delete_plugin(user_id, db)` — Uninstallation hook
  - `get_plugin_status(user_id, db)` — Status check
  - `startup()` / `shutdown()` — Application lifecycle

- **Universal Lifecycle API (Core Endpoints):**
  - `POST   /api/v1/plugins/install`
  - `DELETE /api/v1/plugins/{plugin_id}`
  - `GET    /api/v1/plugins`
  - `POST   /api/v1/plugins/{plugin_id}/enable`
  - `POST   /api/v1/plugins/{plugin_id}/disable`

Core auto-discovers plugins in `backend/plugins/` and exposes them via consistent REST endpoints. Plugins are **user-scoped**.

### Frontend Integration

Frontend plugins expose a module entry (`remoteEntry.js`) and declare components/metadata that the core fetches. With Module Federation, newly installed plugins appear immediately in the Page Builder.

### Service Bridges

Plugins access core functionality through 6 Service Bridges:

| Bridge | Purpose | Example Use |
|--------|---------|-------------|
| **API Bridge** | Backend HTTP calls | `services.api.get('/conversations')` |
| **Event Bridge** | Pub/sub messaging | `services.event.emit('dataChanged', payload)` |
| **Theme Bridge** | Theme state access | `services.theme.getCurrentTheme()` |
| **Settings Bridge** | User preferences | `services.settings.getSetting('apiKey')` |
| **Page Context Bridge** | Page metadata | `services.pageContext.getPageId()` |
| **Plugin State Bridge** | Persistent state | `services.pluginState.save(data)` |

### ServiceBridge Access Control

The `ServiceBridge` class provides a proxy-based access control layer:

- **Access policies** per plugin type (allowed methods, rate limits)
- **Per-instance configuration** override capability
- **Method whitelisting** for security
- **Capability verification** before access

### Quick Start (Build Your First Plugin)

1. **Use the Plugin Template**
   Clone from: `https://github.com/BrainDriveAI/BrainDrive-PluginTemplate`

2. **Set Up Dev Workflow**

```bash
git clone https://github.com/BrainDriveAI/BrainDrive-PluginTemplate.git MyPlugin
cd MyPlugin
npm install
```

Configure `webpack.config.js` to output directly into:
`backend/plugins/shared/<YourPluginName>/<version>/dist` in your BrainDrive checkout.

3. **Run in Dev Mode**
   Edit code, build (`npm run build`), refresh BrainDrive (disable cache in dev tools) to see changes — usually within a minute.

4. **Reference Service Bridge Examples**
   - [API Bridge Example](https://github.com/BrainDriveAI/BrainDrive-API-Service-Bridge-Example-Plugin)
   - [Events Bridge Example](https://github.com/BrainDriveAI/BrainDrive-Events-Service-Bridge-Example-Plugin)
   - [Theme Bridge Example](https://github.com/BrainDriveAI/BrainDrive-Theme-Service-Bridge-Example-Plugin)
   - [Settings Bridge Example](https://github.com/BrainDriveAI/BrainDrive-Settings-Service-Bridge-Example-Plugin)
   - [Page Context Bridge Example](https://github.com/BrainDriveAI/BrainDrive-Page-Context-Service-Bridge-Example-Plugin)
   - [Plugin State Bridge Example](https://github.com/BrainDriveAI/BrainDrive-Plugin-State-Service-Bridge-Example-Plugin)

## API Reference

Full API documentation is available at:
- **Swagger UI:** `http://localhost:8005/api/v1/docs` (when running locally)
- **Documentation:** [docs.braindrive.ai/core/reference](https://docs.braindrive.ai/core/reference)

### Endpoint Categories (17 modules)

| Module | Purpose |
|--------|---------|
| **auth** | Login, register, refresh tokens, logout |
| **settings** | User and application settings |
| **ai_providers** | AI provider configuration |
| **ai_provider_settings** | Provider credentials (encrypted) |
| **conversations** | Chat session management |
| **personas** | AI character CRUD |
| **navigation_routes** | Menu structure management |
| **components** | UI component registry |
| **plugin_state** | Plugin state persistence |
| **documents** | File upload and processing |
| **jobs** | Background job tracking |
| **tags** | Categorization system |
| **plugins** | Plugin lifecycle management |
| **searxng** | Search integration |
| **diagnostics** | System diagnostics |

## Current Status and Roadmap

- **Current focus:** Developer experience, plugin ecosystem, AI provider integrations
- Recent work includes **Persona System**, **Document Processing**, and **multi-provider AI support**

**Toward v1.0:**
- One-click installer for non-technical users
- Enhanced onboarding experience
- Cross-platform polish (Windows, macOS, Linux)
- Community marketplace for plugins

Mission: *Make it easy to build, control, and benefit from your own AI system.*

## Community and Support

- **Community Forum:** community.braindrive.ai — questions, help, ideas, weekly updates
- **GitHub Issues:** Open issues/feature requests; tag plugins in titles (e.g., `[plugin]`)
- **Documentation:** [docs.braindrive.ai](https://docs.braindrive.ai)
- **Security Contact:** Use private vulnerability reporting or email per **SECURITY.md**

"**Your AI. Your Rules.**" — contributions and feedback welcome.

## Contributing and Project Status

Early developer beta — core changes are active and some parts may be unstable. Best contributions right now:

- Try the system and share feedback/bug reports
- Build plugins to extend functionality
- Small fixes and improvements are welcome
- Expect internal APIs to evolve before v1.0

**Guiding Principles:**
1. **Ownership** — Users own their data and setup
2. **Freedom** — No lock-in, no proprietary traps
3. **Empowerment** — Docs/design that enable others
4. **Sustainability** — Choices that help the ecosystem thrive

Long-term, stewardship will decentralize toward a community-run ecosystem of users, builders, and entrepreneurs.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Package install fails | Run `pip install --upgrade pip` and retry. |
| Port 8005 or 5173 in use | Edit `.env` to change ports, then restart servers. |
| Module not found error | Install missing package with `pip install <module>`. |
| Database errors | Verify `.env` DB settings/paths. Ensure app has write access. |
| Environment activation issues | Ensure Conda/venv exists and is activated. |
| Frontend not updating | Disable browser cache in dev tools; verify both servers are running. |
| Plugin installation fails | Verify GitHub URL and that the repo has a release; check backend logs. |
| AI provider errors | Check API key configuration in Settings. Verify provider is reachable. |

## License

Released under the **MIT License** — free to use, modify, and distribute, with no warranty. You own your BrainDrive.

**Your AI. Your Rules.**

## References

- Core README — `BrainDrive-Core/README.md`
- Backend README — `backend/README.md`
- Frontend README — `frontend/README.md`
- ROADMAP — `ROADMAP.md`
- Plugin Developer Quickstart — [docs.braindrive.ai/core/plugin-development/quickstart](https://docs.braindrive.ai/core/plugin-development/quickstart)
- API Reference — [docs.braindrive.ai/core/reference](https://docs.braindrive.ai/core/reference)
- Universal Lifecycle Guide — `backend/app/plugins/UNIVERSAL_LIFECYCLE_GUIDE.md`
- SECURITY — `SECURITY.md`
- CONTRIBUTING — `CONTRIBUTING.md`
