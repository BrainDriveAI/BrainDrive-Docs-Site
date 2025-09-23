# BrainDrive – Self-Hosted AI Platform (Full Context)

## Introduction and Overview

**BrainDrive** is an open‑source alternative to ChatGPT that you fully own and control. It’s self‑hosted and MIT‑licensed — *Your AI, your rules.* BrainDrive is highly modular and customizable: extend functionality through plugins and even monetize your custom AI solutions. Think **WordPress for AI**: install the BrainDrive core, then add or develop plugins to quickly ship new AI‑powered features.

Out of the box, BrainDrive provides:

- A web‑based **Chat** interface for interacting with AI models
- A built‑in **Plugin Manager** to install/manage extensions
- A **Page Builder** for creating custom UIs without code
- Example plugins, tutorials, and developer resources

You run it locally or on any cloud server — there’s no Big Tech lock‑in. Use it as your personal AI or as a foundation for products/services.

**Example use cases** include:

- Custom AI chatbots with specialized knowledge or personalities  
- AI‑powered productivity tools that integrate with your data/workflows  
- Data analysis dashboards or intelligent reports  
- Custom UIs wrapping local or API‑based models  
- Multi‑plugin workflows where several components work together

## Architecture and Core Components

BrainDrive is composed of a **Core System** and a **Plugin Ecosystem**.

### Core System (BrainDrive‑Core repository)
- **Frontend:** React + TypeScript web application
- **Backend:** Python FastAPI server with a SQLite database (default)
- Provides the primary UI (chat, page builder, etc.) and backend services (user management, plugin APIs, conversation storage, etc.)

### Plugin Ecosystem
- Each plugin is a separate module (its own repository) that can be added dynamically.
- Uses **Webpack Module Federation** to load frontend plugins at runtime.
- A standardized **Lifecycle Manager** (Python) to integrate backend/installation logic.
- Plugins communicate with the core through well‑defined **Service Bridges**.
- Decoupled design allows customizing/extending BrainDrive without modifying core; update core/plugins independently.

## Backend Tech Stack

- **FastAPI** — high‑performance web framework for the API  
- **SQLModel** (SQLAlchemy & Pydantic) — ORM for database models  
- **Uvicorn** — ASGI server for FastAPI  
- **Pydantic** — data validation and settings management  
- **Alembic** — database migrations  
- **SQLite** — default lightweight database (can switch later)  
- **structlog** — structured, JSON‑formatted logging  
- **passlib** — secure password hashing  
- **python‑jose** — JWT creation/verification

### Backend Features & Services

- **Authentication & Security:** JWT (access & refresh), role‑based access control, CORS  
- **User Management:** registration, login, profile; “user updaters” run on each login  
- **Settings System:** dynamic, multi‑tier (system vs user)  
- **Plugin System:** modular discovery; install/uninstall on the fly; universal lifecycle APIs  
- **AI Providers:** switch between local or API models (e.g., Ollama via plugin)  
- **Navigation & UI Schema:** backend provides navigation structure and component manifests  
- **Conversation Management:** history, threads, metadata for chat context  
- **Tagging & Organization:** tag‑based organization for conversations and entities  
- **Misc:** env‑based config, health endpoints, structured logging

## Frontend Tech Stack

- **React 18** for a component‑driven UI  
- **TypeScript** for static typing  
- **Vite** for fast dev & optimized builds  
- **Material‑UI (MUI)** for consistent responsive components  
- **React Router** for client‑side navigation  
- **react‑grid‑layout** for the draggable/resizable Page Builder grid  
- **Axios** for HTTP requests  
- **Zod** for runtime schema validation

### Frontend Features & UI

- **Plugin Manager:** browse, install, remove, and update plugins; enter a GitHub URL to install  
- **Visual Page Builder (PluginStudio):** drag‑and‑drop components; responsive layouts; per‑component properties  
- **Page & Route Management:** create/organize pages; routes generated automatically and persisted  
- **Component Configuration:** per‑instance configuration UIs based on plugin manifest  
- **Theme Support:** light/dark; plugins react to theme changes via the Theme service  
- **Authentication:** secure flows; feature visibility by role/permissions  
- **Real‑Time Preview:** hot‑reload in dev; immediate visual feedback  
- **Import/Export:** export/import page layouts as JSON  
- **Error Handling:** error boundaries, graceful failures  
- **Extensible Service Architecture:** service bridges keep plugins decoupled from core

The frontend and backend communicate primarily over HTTP (REST). You can run both locally or deploy separately.

## Installation Guide

BrainDrive is actively tested on Windows, macOS, and Linux. Below are the development setup steps.

### Prerequisites

- **Conda** (Anaconda/Miniconda) recommended for Python env management  
- **Git** to clone repositories  
- **Node.js** 16+ (npm or yarn)

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

Remove any auto‑login credentials in `.env` before production use.

### Step 6: Run the Frontend (Development Mode)

```bash
npm run dev
```

The app will open at `http://localhost:5173` and connect to the backend on `localhost:8005`.

**Tip:** After reboots, re‑activate `BrainDriveDev` in two terminals and repeat Step 4 & Step 6. Your data (SQLite DB, plugins, etc.) persists in the backend folder.

## Production Deployment (Basic)

1. In `backend/.env`, set `APP_ENV=prod`, `DEBUG=false`, `RELOAD=false` and adjust hosts.  
2. Run backend under a process manager (e.g., `systemd`/`supervisor`) instead of `--reload`:

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

3. Build the frontend:

```bash
cd frontend
npm run build
# Serve ./dist with your preferred static server or reverse proxy.
# For small deployments, `npm run preview` works.
```

## Using BrainDrive (Basics)

- Start at the **Chat** interface (default model configured; if the Ollama plugin is installed, local models can power chat).  
- Use **Plugin Manager → Install Plugins** and paste a plugin’s GitHub URL to add new functionality.  
  - **Enable/Disable** plugins without uninstalling  
  - **Update** plugins when new releases are available (user‑scoped)  
  - **Uninstall** removes files and data for the current user  
- Use the **Page Builder** to create custom dashboards by dragging components onto a canvas. Resize/configure visually, create multiple pages, and export/import JSON layouts.

Behind the scenes, the frontend uses **Service Bridges** to interact with the backend and orchestrate plugins. Plugins call services instead of hard‑coding internal APIs, preserving forward compatibility.

## Plugin Development Guide

BrainDrive aims for a **1‑minute development cycle** for plugins.

### Structure and Lifecycle

A typical plugin repository layout:

```
MyPlugin/
├─ package.json
├─ src/
├─ dist/              # includes remoteEntry.js (module federation)
├─ lifecycle_manager.py   # optional: backend lifecycle manager
└─ README.md
```

- **Lifecycle Manager:** define a `*LifecycleManager` class (e.g., `MyPluginLifecycleManager`) implementing standard methods (`install_plugin(user_id, db)`, `delete_plugin(user_id, db)`, `get_plugin_status(user_id, db)`).  
- **Universal Lifecycle API (Core Endpoints):**
  - `POST   /api/plugins/{plugin_slug}/install`
  - `DELETE /api/plugins/{plugin_slug}/uninstall`
  - `GET    /api/plugins/{plugin_slug}/status`
  - `GET    /api/plugins/{plugin_slug}/info`
  - `POST   /api/plugins/{plugin_slug}/repair`
  - `GET    /api/plugins/available`

Core auto‑discovers plugins in `backend/plugins/` and exposes them via consistent REST endpoints. Plugins are **user‑scoped**.

### Frontend Integration

Frontend plugins expose a module entry (`remoteEntry.js`) and declare components/metadata that the core fetches. With module federation, newly installed plugins appear immediately in the Page Builder.

### Quick Start (Build Your First Plugin)

1. **Use the Plugin Template**  
   Install via Plugin Manager using the URL:
   `https://github.com/BrainDriveAI/BrainDrive-PluginTemplate`  
   Drag the “Plugin Template” component onto a page to verify.

2. **Set Up Dev Workflow**  

```bash
git clone https://github.com/BrainDriveAI/BrainDrive-PluginTemplate.git MyPlugin
cd MyPlugin
npm install
```

Configure `webpack.config.js` to output directly into:
`backend/plugins/shared/<YourPluginName>/<version>/dist` in your BrainDrive checkout. This avoids reinstalling on every change.

3. **Run in Dev Mode**  
   Edit code, build (`npm run build`), refresh BrainDrive (disable cache in dev tools) to see changes — usually within a minute.

4. **Leverage Service Bridges** (available via `this.props.services` in React or backend imports):
   - **API Bridge:** `await services.api.get('/some_endpoint')`
   - **Event Bridge:** `services.event.emit('eventName', data)`
   - **Theme Bridge:** `services.theme.getCurrentTheme()`
   - **Settings Bridge:** `services.settings.getSetting('myKey')`
   - **Page Context Bridge:** `services.pageContext.getContext()`
   - **Plugin State Bridge:** `services.pluginState.save(data)`

5. **Build Something Simple First**  
   Start with a small “Hello World” plugin that calls the chat API or changes appearance based on theme. Iterate incrementally.

## Current Status and Roadmap

- **Open beta (v0.6.x)**: plugin manager, page builder, basic chat are operational and being polished.  
- Recent work includes a **Dynamic Page Renderer** and onboarding improvements.  
- Responsive design for some components continues to be refined.

**Toward v1.0**:
- One‑click installer for non‑technical users  
- In‑app dashboard & notifications (planned ~v0.6.5)  
- Case studies and example setups (v0.7–0.9) for non‑technical users (e.g., “Katie Carter”)  
- Concierge/guided experience for onboarding  
- Cross‑platform polish (Windows, macOS, Linux)

Mission: *Make it easy to build, control, and benefit from your own AI system.*

## Community and Support

- **Community Forum:** community.braindrive.ai — questions, help, ideas, weekly updates  
- **GitHub Issues:** open issues/feature requests; tag plugins in titles (e.g., `[plugin]`)  
- **Documentation Index:** links to core docs, guides, and repo references  
- **Security Contact:** use private vulnerability reporting or email per **SECURITY.md**

“**Your AI. Your Rules.**” — contributions and feedback welcome.

## Contributing and Project Status

Early developer beta — core changes are active and some parts may be unstable. Best contributions right now:

- Try the system and share feedback/bug reports  
- Small fixes and improvements are welcome  
- Expect internal APIs to evolve before v1.0

**Guiding Principles**:
1. **Ownership** — users own their data and setup  
2. **Freedom** — no lock‑in, no proprietary traps  
3. **Empowerment** — docs/design that enable others  
4. **Sustainability** — choices that help the ecosystem thrive

Long‑term, stewardship will decentralize toward a community‑run ecosystem of users, builders, and entrepreneurs.

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Package install fails | Run `pip install --upgrade pip` and retry. |
| Port 8005 or 5173 in use | Edit `.env` to change ports, then restart servers. |
| Module not found error | Install missing package with `pip install <module>` (and add to `requirements.txt`). |
| Database errors | Verify `.env` DB settings/paths. Ensure app has write access (SQLite default). |
| Environment activation issues | Ensure Conda/venv exists and is activated (`conda activate BrainDriveDev`). |
| Frontend not updating | Disable browser cache in dev tools; verify both servers are running cleanly. |
| Plugin installation fails | Verify GitHub URL and that the repo has a release/build; check backend logs for details. |

## License

Released under the **MIT License** — free to use, modify, and distribute, with no warranty. You own your BrainDrive.

**Your AI. Your Rules.**

## References

- Core README — `BrainDrive-Core/README.md`  
- Backend README — `backend/README.md`  
- Frontend README — `frontend/README.md`  
- ROADMAP — `ROADMAP.md`  
- INSTALL — `INSTALL.md`  
- Plugin Developer Quickstart — `PLUGIN_DEVELOPER_QUICKSTART.md`  
- Plugin Installer README — `frontend/src/features/plugin-installer/README.md`  
- Universal Lifecycle Guide — `backend/app/plugins/UNIVERSAL_LIFECYCLE_GUIDE.md`  
- SECURITY — `SECURITY.md`  
- CONTRIBUTING — `CONTRIBUTING.md`

