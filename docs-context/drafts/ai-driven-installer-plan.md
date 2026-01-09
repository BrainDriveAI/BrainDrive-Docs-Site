# AI-Driven Installer for BrainDrive

**Status:** Feasibility Research Complete
**Created:** January 8, 2025
**Updated:** January 9, 2025 (incorporated Dave W / Dave J discussion feedback)

## Concept

A downloadable chat application that guides users through BrainDrive installation conversationally. Instead of a traditional wizard, users interact with an AI that:
- Walks through installation steps from the install guide
- Diagnoses issues in real-time
- Answers questions about BrainDrive
- Adapts to the user's specific system
- Recommends and installs Ollama + models based on detected hardware

## Current Installation Complexity

The existing install process involves:
- Conda environment setup (Python 3.11, Node.js, Git)
- Two parallel servers (backend on 8005, frontend on 5173)
- Environment file configuration (.env for both backend and frontend)
- Platform-specific commands (Windows vs Mac/Linux)
- Multiple potential failure points (ports in use, package failures, missing dependencies)

**Reference docs:**
- Install guide: `docs-core/getting-started/install.md`
- Troubleshooting: `docs-core/troubleshooting/common-issues.md`

---

## Key Requirements (from Dave W / Dave J Discussion - January 9, 2025)

### Must-Have Features

1. **Start/Stop/Restart Controls**
   - Bootstrapper window must stay open to provide BrainDrive controls
   - Users need a way to stop and restart BrainDrive
   - Future enhancement: migrate to system tray (Windows) / launch agent (Mac)
   - Start simple with visible window, graduate to background services later

2. **Single-User Mode (Tier 1)**
   - Skip registration/login entirely for solo installations
   - Auto-create default user (e.g., "default user", "default@gmail.com")
   - User goes straight to BrainDrive chat interface with zero friction
   - User ID still exists internally for plugins and logs

3. **Automatic Port Fallback**
   - Default ports: 5173 (frontend), 8005 (backend)
   - If port is busy, automatically try backup ports (no user prompt)
   - Maintain 3 fallback options per service
   - Only if all 3 fail → direct user to CLI for advanced configuration
   - Normal users don't know what ports are—don't ask them

4. **Ollama Detection & Model Setup**
   - Check port 11434 to detect Ollama status
   - If port responds → Ollama running, query available models
   - If port down → Either not installed OR installed but not running
   - Prompt: "If you have Ollama, please start it. If you need to install it, here's the link"
   - Recommend models based on hardware (e.g., "You have 12GB VRAM, 8B model will fly")
   - First experience must be fast—recommend sweet spot model

5. **Error Logging & Support**
   - If installation hangs or fails, generate detailed log file
   - Offer to send log to support forum automatically
   - Include system info, steps completed, error details

### UX Enhancements

6. **Keep User Engaged During Waits**
   - Display educational tidbits while operations run
   - Examples: "Did you know BrainDrive lets you make your own plugins?"
   - "While we wait... BrainDrive uses local AI models for privacy"
   - Prevents user from staring at a loading spinner

7. **Conversational Step Confirmations**
   - Pattern: Explain → Confirm → Execute → Report
   - "First, I need to check your system for the required software. Ready?"
   - "You don't have Conda installed. Would you like me to install it?"
   - "Installing Conda now... Here's what it does: [brief explanation]"
   - "Done! Now we're ready to bring BrainDrive onto your computer."

### Explicitly NOT Needed (for chat installer)

- **Port configuration UI** — Auto-fallback handles this; CLI for advanced users
- **Install location selection** — Default location is fine; CLI for custom paths
- **Model size selection UI** — AI recommends based on hardware; user just confirms

---

## Feasibility Verdict: Highly Feasible

Research completed January 8, 2025. The "data-fed small model" approach is not only viable but represents best practice.

| Component | Recommendation | Size |
|-----------|---------------|------|
| Desktop framework | **Tauri** (Rust) | 50-100 MB |
| LLM runtime | **llama.cpp** (via Rust bindings) | included |
| Model | **Qwen 2.5 1.5B-Instruct** (Q4_K_M) | 1.07 GB |
| **Total installer** | | **~1.2 GB** |

**Production reference:** Jan AI uses this exact stack (200MB installer + model download).

---

## Technical Decisions

### 1. Desktop App Framework

**Decision: Tauri**

| Option | Pros | Cons |
|--------|------|------|
| Electron | Most mature, large ecosystem | ~150MB download |
| **Tauri** ✓ | Small (50-100MB), Rust-based, GPU support | Uses system webview |
| Native per-platform | Best UX per OS | 3x development effort |

**Why Tauri:**
- Jan AI migrated from Electron to Tauri, reduced from ~1GB to 200MB
- Native GPU support: Metal (Mac), CUDA (NVIDIA), Vulkan (AMD/Intel)
- `llama_cpp` Rust crate provides high-level, safe bindings

### 2. AI Backend Location

**Decision: Local Small Model (Data-Fed Approach)**

| Option | Pros | Cons |
|--------|------|------|
| Cloud-hosted API | Simpler, always current | API hijacking risk, requires internet |
| **Local LLM** ✓ | No API risk, works offline | 1-2GB download |
| Hybrid | Best of both | More complexity |

**Why Local:**
- Dave's security concern about API hijacking is eliminated
- "Data-fed small model" pattern is proven (Ploomber AI Debugger, financial AI, healthcare AI)
- Model doesn't need to be "smart"—just orchestrates based on fed data files

### 3. Model Selection

**Primary: Qwen 2.5 1.5B-Instruct**
- Size: 1.07 GB (Q4_K_M quantization)
- RAM: 4GB minimum
- Why: Best-in-class JSON/structured output compliance among small models
- Speed: 3-5 tokens/sec CPU, 15-25 tokens/sec GPU

**Alternative: Llama 3.2 1B-Instruct**
- Size: ~1-2 GB (Q4)
- RAM: 2GB minimum
- Why: Fastest inference (200-300 tokens/sec)
- Trade-off: Needs constrained decoding for reliable structured output

**Key insight:** With constrained decoding (Guidance/Outlines library), even 1B models achieve 88.9% schema accuracy—comparable to Claude 3.5 Haiku.

### 4. System Access Level

**Decision: Specialized Tools (Not Raw Shell)**

| Option | Description | Trust Requirement |
|--------|-------------|-------------------|
| Full automation | AI runs commands directly | High |
| Guided execution | AI shows commands, user runs them | Low |
| **Specialized tools** ✓ | Predefined safe functions only | Medium |

**Tool Design:**
```
# Instead of dangerous raw shell:
execute_shell(command: string)  // NO

# Provide constrained, validated tools:
install_conda_env() -> Result
check_python_version() -> Result
install_ollama() -> Result
pull_ollama_model(name: AllowedModel) -> Result
start_backend_server() -> Result
check_port_available(port: u16) -> bool
clone_repo(url: ValidatedUrl) -> Result
```

---

## Architecture: Data-Fed Small Model

This implements Dave's concept from the January 8 discussion:

```
┌─────────────────────────────────────────────────────────────┐
│                    BrainDrive Installer                      │
├─────────────────────────────────────────────────────────────┤
│  System Detection Module                                     │
│  ├── OS detection (Windows/Mac/Linux)                       │
│  ├── GPU detection (NVIDIA/AMD/Intel/Apple Silicon)         │
│  ├── VRAM measurement                                        │
│  ├── Existing tools check (Python, Node, Git, Ollama)       │
│  └── Available disk space                                    │
├─────────────────────────────────────────────────────────────┤
│  Data Files (fed to model based on detection)               │
│  ├── install-steps-windows.json                             │
│  ├── install-steps-mac.json                                 │
│  ├── install-steps-linux.json                               │
│  ├── ollama-model-recommendations.json (by VRAM)            │
│  ├── common-errors.json                                      │
│  └── troubleshooting-steps.json                             │
├─────────────────────────────────────────────────────────────┤
│  Small LLM (Qwen 2.5 1.5B)                                  │
│  ├── Receives: system context + relevant data file          │
│  ├── Constrained output: JSON {action, reasoning, next}     │
│  └── Does NOT need to "know" everything                     │
├─────────────────────────────────────────────────────────────┤
│  Specialized Tools (NOT raw shell access)                   │
│  ├── install_conda_env()                                    │
│  ├── check_python_version()                                 │
│  ├── install_ollama()                                       │
│  ├── pull_ollama_model(name)                               │
│  ├── start_backend_server()                                 │
│  ├── check_port_available(port)                            │
│  └── clone_repo(url)                                        │
└─────────────────────────────────────────────────────────────┘
```

**Why this works:**
- Model doesn't need to be "smart"—just orchestrates based on fed data
- System detection triggers which data files to load
- Specialized tools prevent arbitrary command execution
- Same approach used by Ploomber's AI Debugger, financial AI models

---

## Alternative Architecture: Web Chat + Bootstrapper

An alternative approach: users visit BrainDrive.ai, click "Install," and chat directly on the website. A tiny bootstrapper bridges the web chat to local execution.

### Why This Works

Browsers can't execute commands on a user's computer (security sandbox). But a small local agent can bridge this gap—similar to how VS Code Remote, Cursor, and GitHub Codespaces work.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  BrainDrive.ai/install                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Web Chat UI (React/Next.js)                        │   │
│   │  ├── Beautiful web design                           │   │
│   │  ├── Real-time streaming responses                  │   │
│   │  └── Progress indicators                            │   │
│   └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          │ WebSocket                         │
│                          ▼                                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Cloud AI Backend                                   │   │
│   │  ├── Claude API / OpenAI API / Self-hosted         │   │
│   │  ├── Smarter than local 1.5B model                 │   │
│   │  └── Easy to update prompts/behavior               │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ WebSocket (authenticated)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│            Local Bootstrapper (5-10 MB download)            │
├─────────────────────────────────────────────────────────────┤
│  Tiny Tauri/Rust App                                        │
│  ├── WebSocket client (connects to web session)            │
│  ├── System detection (OS, GPU, RAM)                       │
│  ├── Specialized tools (same as standalone)                │
│  │   ├── install_conda_env()                               │
│  │   ├── install_ollama()                                  │
│  │   ├── pull_ollama_model()                              │
│  │   └── etc.                                              │
│  └── Reports results back to web chat                      │
└─────────────────────────────────────────────────────────────┘
```

### User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  BrainDrive.ai/install                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Chat: "Hi! Ready to install BrainDrive?"                   │
│                                                              │
│  User: "Yes"                                                 │
│                                                              │
│  Chat: "I'll need a small helper app to install on          │
│         your machine. Click below to download:"              │
│                                                              │
│         [Download for Mac] [Windows] [Linux]                │
│                                                              │
│  Chat: "Once it's running, I'll detect it and we            │
│         can continue right here!"                            │
│                                                              │
│  [Waiting for bootstrapper...]                              │
│                                                              │
│  [Bootstrapper detected ✓]                                  │
│                                                              │
│  Chat: "Perfect! I see you're on macOS with an M2 chip     │
│         and 16GB RAM. Let's get started..."                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Comparison: Standalone vs Web + Bootstrapper

| Aspect | Standalone (1.2GB) | Web + Bootstrapper |
|--------|-------------------|-------------------|
| Initial download | 1.2 GB | 5-10 MB |
| Works offline | ✓ Yes | ✗ No |
| AI quality | Good (local 1.5B) | Better (cloud model) |
| API cost per install | $0 | ~$0.05-0.10 |
| Chat UI updates | Requires new release | Instant (web deploy) |
| Security model | No API exposure | Requires secure WebSocket |
| User trust barrier | Higher (big download) | Lower (tiny download) |

### Security Considerations for Web + Bootstrapper

| Threat | Mitigation |
|--------|------------|
| Unauthorized command execution | Bootstrapper only accepts commands from authenticated web session |
| Session hijacking | Short-lived tokens, session binding to bootstrapper instance |
| Man-in-the-middle | WSS (WebSocket Secure) + certificate pinning |
| Malicious bootstrapper download | Code signing, checksum verification, HTTPS only |

### When to Use Which

**Use Standalone (1.2GB) when:**
- Offline installation is required
- Users are privacy-conscious about cloud AI
- API costs need to be zero
- Target audience is technical (comfortable with larger downloads)

**Use Web + Bootstrapper when:**
- Minimizing friction is priority (tiny download)
- You want the smartest AI possible (cloud models)
- Rapid iteration on chat UX is needed
- BrainDrive.ai is the primary distribution channel

### Hybrid Approach

Could offer both:
1. **BrainDrive.ai/install** → Web chat + tiny bootstrapper (default)
2. **BrainDrive.ai/install/offline** → Download standalone 1.2GB installer

---

## Safety Architecture

### Threat Model & Mitigations

| Threat | Mitigation |
|--------|------------|
| Hallucinated packages | Allowlist of known-safe packages |
| Arbitrary command execution | Specialized tools only, no raw shell |
| Prompt injection via error messages | Input sanitization, constrained output |
| Supply chain attack on model | Bundle model in installer, verify checksums |

### Three-Layer Guardrails

1. **Input:** Validate all user input, sanitize error messages before feeding to model
2. **Processing:** Model can only call predefined tools with constrained parameters
3. **Output:** Human confirmation for system-level changes (installing Ollama, downloading models)

---

## Conversation Flow Example

```
Installer: Hi! I'm here to help you install BrainDrive. Ready to get started?

User: Yes

Installer: Great! The first thing I need to do is check your system to see
if it has the required software. BrainDrive uses Python and Node.js to run
its backend and frontend. I'm going to check your system now.

[Detects: macOS, Apple M2, 16GB RAM, Python ✓, Node.js ✓, Git ✓, no Conda, no Ollama]

Installer: I see you're on a Mac with an M2 chip and 16GB RAM — great
hardware for running AI locally!

Here's what I found:
✓ Python installed
✓ Node.js installed
✓ Git installed
✗ Conda not found
✗ Ollama not found

BrainDrive uses Conda to manage its Python environment. Would you like
me to install Conda for you?

User: Yes

Installer: Installing Conda now. Conda is a package manager that keeps
BrainDrive's dependencies separate from the rest of your system.

💡 Did you know? BrainDrive lets you build your own plugins to extend
its capabilities!

[Installing Conda... progress indicator]

Installer: ✓ Conda installed! Now we're ready to bring BrainDrive onto
your computer. I'll clone it from GitHub. Ready?

User: Yes

Installer: Cloning BrainDrive repository...

💡 While we wait: BrainDrive runs entirely on your machine — your data
never leaves your computer unless you want it to.

[Cloning... progress indicator]

Installer: ✓ BrainDrive downloaded! Setting up the environment and
installing dependencies...

[Setup progress...]

Installer: ✓ BrainDrive is installed and running!

Now, to get the most out of BrainDrive, you'll want a local AI model.
I'll check if you have Ollama installed...

[Checks port 11434]

Installer: I don't see Ollama running. Ollama is what lets you run AI
models locally. Would you like me to install it?

User: Sure

Installer: Installing Ollama...

[Installing...]

Installer: ✓ Ollama installed! Now let's get you a model. Looking at your
hardware — M2 chip with 16GB RAM — I recommend the Qwen 2.5 8B model.
It's the sweet spot for your system: fast responses and great quality.

Would you like me to download Qwen 2.5 8B?

User: What other options are there?

Installer: Good question! Here are your options:

• Qwen 2.5 8B (Recommended) — Best balance of speed and intelligence
• Llama 3.2 3B — Faster, lighter, good for quick tasks
• Qwen 2.5 14B — Smarter but slower, needs more RAM

With 16GB RAM, the 8B model will fly. Want to go with that?

User: Yes, let's do 8B

Installer: Downloading Qwen 2.5 8B... [████████░░] 80%

💡 Fun fact: This model has 8 billion parameters and runs entirely
on your Mac's GPU!

[Download complete]

Installer: ✓ All done! BrainDrive is installed and ready to use.

🎉 Opening BrainDrive now...

Note: Keep this window open to stop or restart BrainDrive. You can
minimize it to your dock.

[Start BrainDrive] [Stop] [Restart]
```

---

## Installer Size Breakdown

| Component | Size | Notes |
|-----------|------|-------|
| Tauri app binary | 50-100 MB | Cross-platform |
| Qwen 2.5 1.5B (Q4_K_M) | 1.07 GB | Bundled |
| Data files | <1 MB | JSON config |
| **Total** | **~1.2 GB** | Within 500MB-2GB budget |

### Alternative: Download-on-first-run
- Installer: 100-150 MB (app only)
- Model downloads on first chat: 1-2 GB
- Trade-off: Requires internet, but smaller initial download

---

## Reference Implementations

1. **[Jan AI](https://github.com/janhq/jan)** - Production Tauri + llama.cpp app (best reference)
2. **[tauri-local-lm](https://github.com/dillondesilva/tauri-local-lm)** - Simple integration example
3. **[llama-app](https://github.com/karelnagel/llama-app)** - Rust + Tauri starter

---

## Open Questions for Team

1. **Standalone vs Web + Bootstrapper?**
   - Standalone: 1.2GB download, works offline, no API costs
   - Web + Bootstrapper: 5-10MB download, smarter cloud AI, ~$0.05-0.10/install
   - Hybrid: Offer both options

2. **Bundled vs download model?** (if standalone)
   - Bundled: 1.2GB installer, works immediately
   - Download: 150MB installer, needs internet on first run

3. **Which platforms first?**
   - macOS (Apple Silicon) is easiest (Metal just works)
   - Windows (CUDA) is most users
   - Linux is smallest audience

4. **Ollama integration approach?**
   - Option A: Detect existing Ollama, use it
   - Option B: Bundle Ollama-compatible runtime in installer
   - Option C: Both (prefer existing, fall back to bundled)

5. **Post-install support?**
   - Does the AI assistant stay available after install?
   - Could integrate into BrainDrive itself for ongoing help

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Model too slow on older CPUs | Medium | Test on 5-year-old hardware, provide "minimal mode" |
| GPU detection fails | Low | Fall back to CPU, still works |
| Installation edge cases | Medium | Extensive testing, clear error messages, manual fallback |
| User doesn't trust AI installer | Medium | Show exactly what each step does, allow manual mode |

---

## Implementation Roadmap

### Phase 1: Prototype
- Create Tauri app skeleton
- Integrate llama.cpp with Qwen 2.5 1.5B
- Basic chat UI

### Phase 2: System Detection
- OS/GPU/RAM detection
- Existing tools check
- Data file loading based on detection

### Phase 3: Tool Implementation
- Specialized install tools
- Ollama integration
- Error handling

### Phase 4: Testing
- Mac (M1/M2/M3)
- Windows (NVIDIA, AMD, Intel)
- Linux (various distros)
- Edge cases and error recovery

### Phase 5: Polish
- UI/UX refinement
- Progress indicators
- Human confirmation dialogs

---

## Conclusion

**Key insight:** Nobody has built a fully autonomous chat-based installer before, but all the pieces exist and are battle-tested. This would be genuinely novel while using proven components.

### Recommended Approach: Start with Web + Bootstrapper

**The Web + Bootstrapper approach is significantly easier to build.**

#### Complexity Comparison

| Component | Standalone | Web + Bootstrapper |
|-----------|-----------|-------------------|
| LLM integration | llama.cpp Rust bindings (hard) | API call to Claude (trivial) |
| GPU acceleration | Metal/CUDA/Vulkan detection (hard) | Not needed |
| Model management | Download, load, quantization (medium) | Not needed |
| Chat UI | Tauri webview (medium) | React/Next.js (easy) |
| System detection | Same | Same |
| Install tools | Same | Same |

#### Why Standalone is Harder

The llama.cpp integration is the tricky part:
- Rust FFI bindings to C++
- GPU backend selection at compile time
- Memory management for model loading
- Streaming token generation
- Testing across GPU vendors (NVIDIA, AMD, Intel, Apple)

#### Why Web + Bootstrapper is Easier

- **Web frontend**: Standard React/Next.js (familiar)
- **AI backend**: Single API call to Claude/OpenAI
- **Bootstrapper**: Tiny Tauri app with no ML complexity
- **WebSocket**: Well-documented, mature libraries

#### Estimated Timeline

| Approach | Time to MVP |
|----------|-------------|
| Web + Bootstrapper | 2-3 weeks |
| Standalone with local LLM | 4-6 weeks |

#### Recommendation

1. **Build Web + Bootstrapper first** (BrainDrive.ai/install)
2. Ship faster, iterate on chat UX via web deploys
3. Use Claude API for best AI quality
4. The bootstrapper code (system detection, install tools) is **reusable**
5. Add standalone/offline version later if user demand requires it

---

## Appendix A: Dave J Discussion Notes (January 8, 2025)

Key points from the discussion:
- Local model eliminates API hijacking concerns
- "Data-fed small model" approach: detect system → feed relevant data → let small model orchestrate
- Model doesn't need to be smart, just needs to make decisions based on fed data points
- Rust/Tauri recommended for cross-platform performance
- Could detect graphics card and recommend appropriate Ollama models based on VRAM
- Installer could also set up Ollama and pull recommended models

---

## Appendix B: Dave W / Dave J Discussion Notes (January 9, 2025)

Dave W built a working prototype using Claude Code that installs BrainDrive via chat. Key insights:

### Architecture Decision: Cloud API is Better
- Normal users don't have API keys (BrainDrive covers the cost)
- Local model requires PyTorch (~1GB+) download
- State-of-the-art models (Opus 4.5) are better for guardrailing
- Small download → open → click button → opens browser chat

### User Experience Flow
- Conversational: "Ready to install? First I'll check your system..."
- Explain each step before doing it
- Ask for confirmation: "Would you like me to install Conda?"
- Keep user engaged during waits with educational tidbits

### Post-Install Requirements
- Must be able to start/stop/restart BrainDrive
- Window stays open for now (future: system tray / launch agent)
- Skip registration for single-user installs (Tier 1 mode)

### Port Handling Philosophy
- Users don't know what ports are — don't ask them
- Auto-fallback to backup ports silently
- 3 options per service; if all fail, direct to CLI
- Same approach as current Mac/Windows installer

### Ollama Detection Nuance
- Port 11434 up → Ollama running, can query models
- Port 11434 down → Not installed OR installed but not running
- Prompt appropriately: "If you have Ollama, start it. If not, here's the link"

### Error Handling
- Generate log on failure
- Offer to send to support forum

### Development Approach
- CEO builds "hacked version" prototype
- Developer polishes for production
- Prototype serves as product demo and requirements doc
