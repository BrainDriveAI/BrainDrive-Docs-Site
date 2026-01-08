# BrainDrive AI Installer - Build Plan

**Approach:** Web Chat + Local Bootstrapper
**Target:** BrainDrive.ai/install → chat guides user through installation
**Estimated MVP:** 2-3 weeks

---

## Overview

Users visit BrainDrive.ai/install, chat with an AI that guides them through installation. A tiny bootstrapper app (5-10MB) runs locally to execute commands on their machine.

```
┌─────────────────────────────────────────┐
│         BrainDrive.ai/install           │
│  ┌───────────────────────────────────┐  │
│  │          Chat UI (React)          │  │
│  └───────────────────────────────────┘  │
│                   │                      │
│                   ▼                      │
│  ┌───────────────────────────────────┐  │
│  │    Backend API (Claude + WS)      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    │ WebSocket
                    ▼
┌─────────────────────────────────────────┐
│     Local Bootstrapper (Tauri)          │
│  - System detection                     │
│  - Execute install commands             │
│  - Report results back                  │
└─────────────────────────────────────────┘
```

---

## Components to Build

### 1. Bootstrapper (Tauri/Rust) - `packages/bootstrapper/`

Tiny desktop app that:
- Connects to web chat via WebSocket
- Detects system info (OS, CPU, GPU, RAM, installed tools)
- Executes predefined install commands
- Reports progress/results back to web

**Key files:**
```
packages/bootstrapper/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs          # Entry point
│   │   ├── system_info.rs   # OS, GPU, RAM detection
│   │   ├── tools.rs         # Install command implementations
│   │   └── websocket.rs     # Connect to backend
│   └── Cargo.toml
├── src/
│   └── App.tsx              # Minimal UI (status display)
└── package.json
```

**System detection to implement:**
- OS type and version
- CPU architecture (x86_64, arm64)
- GPU (for Ollama model recommendations)
- RAM amount
- Installed tools: Python, Node.js, Git, Conda, Ollama

**Install tools to implement:**
```rust
fn check_python() -> Result<Version>
fn check_node() -> Result<Version>
fn check_git() -> Result<bool>
fn check_ollama() -> Result<bool>
fn install_ollama() -> Result<()>
fn pull_ollama_model(model: &str) -> Result<()>
fn clone_repo(url: &str, path: &str) -> Result<()>
fn run_command(cmd: &str) -> Result<Output>
```

### 2. Backend API - `packages/backend/`

Handles Claude API calls and WebSocket connections.

**Key files:**
```
packages/backend/
├── src/
│   ├── index.ts             # Express/Fastify server
│   ├── claude.ts            # Claude API integration
│   ├── websocket.ts         # WS server for bootstrapper
│   ├── session.ts           # Session management
│   └── prompts/
│       └── installer.ts     # System prompt for installer AI
└── package.json
```

**Endpoints:**
- `POST /api/chat` - Send message, get Claude response
- `WS /ws/session/:id` - WebSocket for bootstrapper connection

**Claude integration:**
- Use Claude API with tool use
- Tools map to bootstrapper commands
- Stream responses to frontend

### 3. Web Frontend - `packages/web/`

Chat interface at BrainDrive.ai/install.

**Key files:**
```
packages/web/
├── src/
│   ├── app/
│   │   └── install/
│   │       └── page.tsx     # Main install page
│   ├── components/
│   │   ├── Chat.tsx         # Chat interface
│   │   ├── Message.tsx      # Message bubble
│   │   ├── DownloadPrompt.tsx  # Bootstrapper download
│   │   └── Progress.tsx     # Install progress
│   └── lib/
│       └── api.ts           # Backend API client
└── package.json
```

**Features:**
- Chat message display with streaming
- Bootstrapper download buttons (Mac/Windows/Linux)
- Connection status indicator
- Install progress visualization

---

## Implementation Order

### Phase 1: Bootstrapper Foundation (Days 1-3)

1. **Create Tauri project**
   ```bash
   npm create tauri-app@latest braindrive-installer
   ```

2. **Implement system detection**
   - OS, CPU, RAM detection
   - Check for Python, Node, Git, Ollama

3. **Create minimal UI**
   - Show system info
   - Status indicator

4. **Test locally**
   - Verify detection works on Mac
   - Build and test the binary

### Phase 2: Backend API (Days 4-6)

1. **Set up Express/Fastify server**

2. **Implement Claude integration**
   - Chat endpoint
   - Streaming responses
   - Tool definitions for installer commands

3. **Add WebSocket server**
   - Session management
   - Message routing to/from bootstrapper

4. **Create installer system prompt**
   - Personality and behavior
   - Available tools
   - Error handling guidance

### Phase 3: Connect Bootstrapper to Backend (Days 7-9)

1. **Add WebSocket client to bootstrapper**
   - Connect to backend
   - Receive commands
   - Send results

2. **Implement command execution**
   - Map backend tool calls to local functions
   - Execute and report progress

3. **Add authentication**
   - Session tokens
   - Secure WebSocket connection

### Phase 4: Web Frontend (Days 10-12)

1. **Create Next.js app**

2. **Build chat interface**
   - Message display
   - Input field
   - Streaming response handling

3. **Add bootstrapper download flow**
   - Detect OS
   - Download buttons
   - Connection status

4. **Polish UI**
   - Progress indicators
   - Error states
   - Success celebration

### Phase 5: Integration & Testing (Days 13-15)

1. **End-to-end testing**
   - Full install flow on Mac
   - Error scenarios
   - Edge cases

2. **Build bootstrapper for all platforms**
   - macOS (arm64, x86_64)
   - Windows
   - Linux

3. **Deploy**
   - Backend to hosting (Vercel/Railway/Fly)
   - Frontend to Vercel
   - Bootstrapper binaries to GitHub releases

---

## Technical Decisions

### Bootstrapper
- **Framework:** Tauri 2.0
- **Language:** Rust backend, React frontend (minimal UI)
- **Size target:** < 10 MB

### Backend
- **Runtime:** Node.js
- **Framework:** Express or Fastify
- **AI:** Claude API (claude-sonnet-4-20250514)
- **WebSocket:** ws library

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State:** React hooks (simple, no Redux needed)

---

## Claude System Prompt (Draft)

```
You are the BrainDrive installation assistant. You help users install BrainDrive on their computer through a friendly chat conversation.

You have access to a local bootstrapper running on the user's machine that can:
- Detect system information (OS, CPU, GPU, RAM)
- Check for installed tools (Python, Node.js, Git, Ollama)
- Install Ollama
- Pull Ollama models
- Clone repositories
- Run shell commands

Installation steps:
1. Greet the user and detect their system
2. Check for prerequisites (Python 3.11+, Node.js 18+, Git)
3. Clone the BrainDrive repository
4. Set up the Python environment
5. Install dependencies
6. Configure environment files
7. Optionally install Ollama and recommended models
8. Start BrainDrive and verify it works

Be conversational and helpful. Explain what you're doing at each step. If something fails, diagnose the issue and suggest fixes.
```

---

## Repository Structure

```
BrainDrive-Installer/
├── packages/
│   ├── bootstrapper/     # Tauri app
│   ├── backend/          # API server
│   └── web/              # Next.js frontend
├── .github/
│   └── workflows/
│       └── build.yml     # CI/CD for all platforms
├── package.json          # Workspace root
└── README.md
```

---

## Environment Variables

### Backend
```
ANTHROPIC_API_KEY=sk-ant-...
SESSION_SECRET=random-secret
CORS_ORIGIN=https://braindrive.ai
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://api.braindrive.ai
NEXT_PUBLIC_WS_URL=wss://api.braindrive.ai
```

---

## Success Criteria

MVP is complete when:
- [ ] User can visit BrainDrive.ai/install
- [ ] Chat greets them and prompts to download bootstrapper
- [ ] Bootstrapper connects to web chat
- [ ] AI detects system and guides through install
- [ ] BrainDrive successfully installs and runs
- [ ] Works on macOS (primary), Windows, Linux

---

## Open Items

- [ ] Decide on hosting (Vercel + Railway? All Vercel?)
- [ ] Set up BrainDrive.ai domain routing for /install
- [ ] Code signing for bootstrapper (macOS notarization, Windows signing)
- [ ] Error tracking/logging (Sentry?)
