# Claude Code as Project Manager for BrainDrive

## Goal
Use Claude Code to manage GitHub issues based on call transcripts:
- Create new issues in the correct repo
- Close completed issues with summary comments
- Set appropriate project fields (Status, Roadmap Phase, Priority, Assignee)

---

## Workflow

### 1. Input Format
Provide a **pre-processed summary** from call transcripts containing:
- **New issues** to create (with description of what needs to be done)
- **Completed issues** to close (referencing existing issue numbers or descriptions)
- **Roadmap phase** context (which phase items belong to)

### 2. Issue Creation
For each new issue, Claude Code will:
1. Determine the correct repo based on context (see `docs-context/repo-guide.md`)
2. Create the issue with `gh issue create`
3. Add to the BrainDriveAI Project board
4. Set fields:
   - **Status**: `Todo`
   - **Roadmap Phase**: As specified (Phase 1-5)
   - **Priority**: `Backlog` unless specified otherwise
   - **Assignee**:
     - `DJJones66` for coding tasks
     - `davewaring` for non-coding tasks (docs, design, business)

### 3. Issue Closure
For completed issues, Claude Code will:
1. Add a comment summarizing what was done (from transcript context)
2. Close the issue
3. Update Status to `Done` on the project board

---

## Repo Routing Quick Reference

| Repo | Use For |
|------|---------|
| `BrainDrive-Core` | Main platform: backend API, frontend framework, plugin system, auth, settings infrastructure |
| `BrainDrive-Install-System` | Installer, auto-updates, Windows/Mac setup |
| `BrainDrive-Docs-Site` | Documentation website, docs syncing, style guides |
| `BrainDrive-Website` | Marketing site (braindrive.ai) |
| `BrainDrive-Chat-Plugin` | Chat interface UI, conversation management |
| `BrainDrive-Ollama-Plugin` | Ollama server/model management |
| `BrainDrive-Settings-Plugin` | Settings UI plugin |
| `BrainDrive-Chat-With-Docs-Plugin` | RAG chat, document Q&A |
| `BrainDrive-Openrouter-Plugin` | OpenRouter model integration |
| `Document-Chat-Service` | RAG backend orchestration |
| `Document-Processing-Service` | Document parsing/embedding pipeline |
| `BrainDrive-PluginTemplate` | Plugin starter template, plugin dev docs |

See `docs-context/repo-guide.md` for detailed routing guidance.

---

## Project Board Fields Reference

**Status** (set on creation/closure):
- `Todo` - New issues
- `In Progress` - Actively being worked
- `Done` - Completed

**Roadmap Phase** (set based on transcript context):
- `Phase 1 - Foundation` - Current focus
- `Phase 2 - Own`
- `Phase 3 - Build`
- `Phase 4 - Benefit`
- `Phase 5 - Community`

**Priority** (set if specified):
- `In Progress` - Active work
- `Next Up` - Coming soon
- `Backlog` - Default for new issues

---

## Example Session

**You provide:**
```
From today's call:

NEW ISSUES:
- Add dark mode toggle to chat interface (Phase 1, coding)
- Write troubleshooting guide for common install errors (Phase 1, docs)
- Investigate slow model loading in Ollama plugin (Phase 1, coding)

COMPLETED:
- Issue #42 in Core - JWT refresh token implementation
- Issue #15 in Chat-Plugin - Fixed message ordering bug
```

**Claude Code will:**
1. Create 3 issues in appropriate repos (Chat-Plugin, Docs-Site, Ollama-Plugin)
2. Assign coding to DJJones66, docs to davewaring
3. Set all to Phase 1, Status=Todo, Priority=Backlog
4. Close #42 and #15 with summary comments
5. Update their Status to Done

---

## Related Files

- `docs-context/repo-guide.md` - Detailed repository routing guide with examples
