# AI-Driven Installer for BrainDrive

**Status:** Draft - Initial Planning
**Created:** January 8, 2025

## Concept

A downloadable chat application that guides users through BrainDrive installation conversationally. Instead of a traditional wizard, users interact with an AI that:
- Walks through installation steps from the install guide
- Diagnoses issues in real-time
- Answers questions about BrainDrive
- Adapts to the user's specific system

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

## Open Questions

### Architecture & Technical

**1. Desktop App Framework**
| Option | Pros | Cons |
|--------|------|------|
| Electron | Most mature, large ecosystem | ~150MB download |
| Tauri | Small (~10-20MB), Rust-based | Uses system webview, less mature |
| Native per-platform | Best UX per OS | 3x development effort |

**Decision:** TBD

**2. AI Backend Location**
| Option | Pros | Cons |
|--------|------|------|
| Cloud-hosted (your API) | Simpler, always current | Requires internet |
| Local LLM (bundled) | Works offline | 1-4GB download, slow on low-end hardware |
| Hybrid | Best of both | More complexity |

**Decision:** TBD

**3. System Access Level**
| Option | Description | Trust Requirement |
|--------|-------------|-------------------|
| Full automation | AI runs commands directly | High |
| Guided execution | AI shows commands, user runs them | Low |
| Hybrid | Auto-run safe commands, confirm risky ones | Medium |

**Decision:** TBD

### Scope

**4. Installation Target**
- [ ] Development setup (current install guide - clone repo, dev servers)
- [ ] Production/end-user (packaged release, simpler)
- [ ] Both

**5. Post-Install Support**
Should the AI remain available after installation for:
- [ ] First-run onboarding
- [ ] Ongoing troubleshooting
- [ ] Plugin installation help
- [ ] Exit after successful install only

### Distribution

**6. Code Signing**
- [ ] Windows code signing (~$200-400/year) - removes "unknown publisher" warning
- [ ] macOS notarization (Apple Developer account required) - required for Gatekeeper

---

## Feasibility Assessment

### Strengths
- Solves real UX problem - install is multi-step and error-prone
- AI can diagnose issues in real-time (parse errors, suggest fixes)
- Aligns with BrainDrive's AI-first identity
- Can detect what's already installed and adapt

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Security perception (AI running commands) | Hybrid approach: auto-run safe, confirm risky |
| Offline scenarios | Local LLM fallback or pre-downloaded install assets |
| Edge cases / destructive commands | Strict guardrails, command allowlist |
| Large download size | Tauri + cloud AI keeps it small; local LLM optional |

---

## Next Steps

1. [ ] Decide on framework (Electron vs Tauri vs native)
2. [ ] Decide on AI backend (cloud vs local vs hybrid)
3. [ ] Define command execution model (auto vs guided vs hybrid)
4. [ ] Prototype basic chat UI with system command execution
5. [ ] Map install guide steps to AI conversation flow
6. [ ] Define error detection and recovery patterns

---

## Technical Spike Ideas

- Test Tauri app with basic chat UI (~1 day)
- Test command execution sandboxing approaches
- Evaluate small local LLMs (Phi-3, Llama 3.2) for offline fallback
- Prototype error parsing from common install failures
