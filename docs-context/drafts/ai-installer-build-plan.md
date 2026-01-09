# BrainDrive AI Installer - Build Plan

**Approach:** Web Chat + Local Bootstrapper
**Target:** BrainDrive.ai/install → chat guides user through installation
**Updated:** January 9, 2025 (incorporated Dave W / Dave J discussion feedback)

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
│   │   ├── ports.rs         # Port availability and fallback logic
│   │   ├── lifecycle.rs     # Start/stop/restart BrainDrive
│   │   ├── logging.rs       # Error log generation
│   │   └── websocket.rs     # Connect to backend
│   └── Cargo.toml
├── src/
│   ├── App.tsx              # Main UI with status and controls
│   └── components/
│       ├── StatusDisplay.tsx    # Connection & install status
│       └── ControlPanel.tsx     # Start/Stop/Restart buttons
└── package.json
```

**Bootstrapper UI must include:**
- Connection status indicator
- BrainDrive running status
- **Start / Stop / Restart buttons** (always visible after install)
- Port info display (which ports BrainDrive is using)
- "Open BrainDrive" button (opens browser to frontend)
- Note: Window must stay open to control BrainDrive (future: system tray)

**System detection to implement:**
- OS type and version
- CPU architecture (x86_64, arm64)
- GPU (for Ollama model recommendations)
- RAM amount
- Installed tools: Python, Node.js, Git, Conda, Ollama

**Install tools to implement:**
```rust
// System checks
fn check_python() -> Result<Version>
fn check_node() -> Result<Version>
fn check_git() -> Result<bool>
fn check_conda() -> Result<bool>
fn check_ollama_running() -> Result<bool>  // Check port 11434
fn check_ollama_installed() -> Result<bool> // Check binary exists

// Port management
fn check_port_available(port: u16) -> bool
fn find_available_port(preferred: u16, fallbacks: &[u16]) -> Result<u16>

// Installation
fn install_conda() -> Result<()>
fn install_ollama() -> Result<()>
fn pull_ollama_model(model: &str) -> Result<()>
fn clone_repo(url: &str, path: &str) -> Result<()>
fn setup_braindrive_env() -> Result<()>
fn create_default_user() -> Result<()>  // Single-user Tier 1 mode

// BrainDrive lifecycle
fn start_braindrive(frontend_port: u16, backend_port: u16) -> Result<()>
fn stop_braindrive() -> Result<()>
fn restart_braindrive() -> Result<()>
fn get_braindrive_status() -> Result<Status>

// Error handling
fn generate_error_log() -> Result<PathBuf>
fn submit_log_to_forum(log_path: &Path) -> Result<()>
```

**Port fallback configuration:**
```rust
const FRONTEND_PORTS: [u16; 3] = [5173, 5174, 5175];
const BACKEND_PORTS: [u16; 3] = [8005, 8006, 8007];
const OLLAMA_PORT: u16 = 11434;
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
- Educational tidbits display during long operations
- Celebration animation on successful install
- Error state with "Send log to support" option

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
You are the BrainDrive installation assistant. You help users install BrainDrive on their computer through a friendly, conversational chat.

## Your Style
- Be conversational and warm, like a helpful friend on a video call
- ALWAYS explain what you're about to do BEFORE doing it
- Ask for confirmation before each major step
- Keep users engaged during waits with educational tidbits about BrainDrive
- Never use technical jargon without explaining it

## Conversation Pattern
For each step, follow this pattern:
1. Explain what you need to do and why
2. Ask "Ready?" or "Would you like me to...?"
3. Execute the action
4. Report the result
5. Transition to the next step

## Available Tools (via local bootstrapper)
- System detection: OS, CPU, GPU, RAM, installed tools
- Port management: check availability, auto-fallback to alternates
- Installation: Conda, Ollama, clone repos, setup environment
- BrainDrive lifecycle: start, stop, restart, status
- Error handling: generate logs, submit to support

## Installation Flow
1. Greet and explain what you'll do
2. Check system (explain you're checking while you do it)
3. For each missing prerequisite:
   - Explain what it is and why BrainDrive needs it
   - Ask permission to install
   - Install with progress updates
   - Confirm success
4. Clone BrainDrive, set up environment
5. Create default user (single-user mode - no registration needed)
6. Auto-select ports (use fallbacks if needed - don't ask user about ports)
7. Start BrainDrive
8. Offer to set up Ollama and recommend model based on hardware
9. Celebrate success and explain the control window

## Educational Tidbits (use during waits)
- "Did you know? BrainDrive lets you build your own plugins!"
- "While we wait... BrainDrive runs entirely on your machine for privacy."
- "Fun fact: You can connect BrainDrive to multiple AI providers."
- "BrainDrive uses a plugin architecture - you can customize everything."

## Error Handling
- If something fails, explain what went wrong in simple terms
- Offer to generate a log file and send it to support
- Suggest alternative approaches if available

## Important Notes
- NEVER ask users about port numbers - handle this automatically
- NEVER ask about install location - use default
- DO explain that the control window needs to stay open
- DO celebrate when installation completes!
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
- [ ] AI detects system and guides through install conversationally
- [ ] Ports auto-fallback if defaults are busy (no user prompt)
- [ ] Single-user mode: skips registration, creates default user
- [ ] BrainDrive successfully installs and runs
- [ ] Bootstrapper shows Start/Stop/Restart controls
- [ ] Ollama setup offered with hardware-based model recommendation
- [ ] Error logging works and can submit to support
- [ ] Works on macOS (primary), Windows, Linux

---

## Out of Scope (CLI Territory)

These features are intentionally NOT included in the chat installer:
- **Port configuration** — Auto-fallback handles it; power users use CLI
- **Custom install location** — Default is fine; power users use CLI
- **Multi-user setup** — Chat installer is single-user (Tier 1) only
- **Advanced Ollama configuration** — Chat recommends one model; CLI for custom setups

---

## Open Items

- [ ] Decide on hosting (Vercel + Railway? All Vercel?)
- [ ] Set up BrainDrive.ai domain routing for /install
- [ ] Code signing for bootstrapper (macOS notarization, Windows signing)
- [ ] Error tracking/logging (Sentry?)
- [ ] Define educational tidbits content (marketing team input?)
- [ ] Support forum integration for error log submission
