# AI-Driven Installer for BrainDrive

**Status:** Feasibility Research Complete
**Created:** January 8, 2025
**Updated:** January 8, 2025 (added research findings from Dave J discussion)

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
Installer: Hi! I'm the BrainDrive installer. Let me check your system...

[Detects: macOS, Apple M2, 16GB RAM, no Ollama installed]

Installer: I see you're on a Mac with an M2 chip - great hardware for
running AI locally! Here's what we'll set up:

1. BrainDrive (Python backend + React frontend)
2. Ollama (to run local AI models)
3. A recommended model for your hardware

Ready to start? (Yes / Tell me more)

User: Yes

Installer: First, I'll set up the Python environment...
[Runs install_conda_env() tool]

Installer: ✓ Python environment ready! Now let's install Ollama...
[Runs install_ollama() tool - shows confirmation dialog first]

Installer: ✓ Ollama installed! With 16GB RAM, I recommend Llama 3.2 3B
or Qwen 2.5 7B. Want me to install the recommended model?

User: What's the difference?

Installer: [Feeds ollama-model-recommendations.json to model]
- Llama 3.2 3B: Faster responses, good for chat
- Qwen 2.5 7B: Better reasoning, great for complex tasks

Both run well on your M2. I'd suggest Qwen 2.5 7B for the full
BrainDrive experience.

User: Go with Qwen

Installer: [Runs pull_ollama_model("qwen2.5:7b") tool]
Downloading Qwen 2.5 7B... [████████░░] 80%
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

1. **Bundled vs download model?**
   - Bundled: 1.2GB installer, works immediately
   - Download: 150MB installer, needs internet on first run

2. **Which platforms first?**
   - macOS (Apple Silicon) is easiest (Metal just works)
   - Windows (CUDA) is most users
   - Linux is smallest audience

3. **Ollama integration approach?**
   - Option A: Detect existing Ollama, use it
   - Option B: Bundle Ollama-compatible runtime in installer
   - Option C: Both (prefer existing, fall back to bundled)

4. **Post-install support?**
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

**Recommendation:** Build a prototype with Tauri + Qwen 2.5 1.5B targeting macOS first (easiest GPU path), then expand to Windows/Linux.

---

## Appendix: Dave J Discussion Notes (January 8, 2025)

Key points from the discussion:
- Local model eliminates API hijacking concerns
- "Data-fed small model" approach: detect system → feed relevant data → let small model orchestrate
- Model doesn't need to be smart, just needs to make decisions based on fed data points
- Rust/Tauri recommended for cross-platform performance
- Could detect graphics card and recommend appropriate Ollama models based on VRAM
- Installer could also set up Ollama and pull recommended models
