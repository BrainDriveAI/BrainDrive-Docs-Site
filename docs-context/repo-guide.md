# BrainDrive Repository Guide

Quick reference for routing GitHub issues to the correct repository.

## Core Platform

### BrainDrive-Core
**Owner**: DJJones66
**Scope**: Main platform codebase

Create issues here for:
- Backend API (FastAPI endpoints, auth, database)
- Frontend framework (React, routing, layout)
- Plugin system architecture (loading, lifecycle, service bridges)
- Settings infrastructure (storage, retrieval)
- Core UI components (sidebar, header, navigation)
- JWT authentication, user management
- Cross-cutting concerns affecting multiple plugins

**Examples**:
- "Add rate limiting to API endpoints"
- "Implement plugin dependency resolution"
- "Fix service bridge event propagation"

### BrainDrive-Install-System
**Owner**: DJJones66
**Scope**: Installation and updates

Create issues here for:
- Windows/Mac installers
- Auto-update functionality
- First-run setup wizard
- Dependency installation (Python, Node, Ollama)
- Environment configuration

**Examples**:
- "Add Linux support to installer"
- "Fix auto-update failing on Windows 11"

---

## Plugins

### BrainDrive-Chat-Plugin
**Owner**: DJJones66
**Scope**: Chat interface

Create issues here for:
- Chat UI components (message list, input box, etc.)
- Conversation management
- Model selection dropdown
- Message rendering (markdown, code blocks)
- Chat-specific settings

**Examples**:
- "Add dark mode toggle to chat"
- "Implement message editing"
- "Fix code block copy button"

### BrainDrive-Ollama-Plugin
**Owner**: DJJones66
**Scope**: Ollama integration

Create issues here for:
- Ollama server management UI
- Model download/delete
- Model switching
- Ollama connection status
- Ollama-specific settings

**Examples**:
- "Add model download progress indicator"
- "Fix reconnection when Ollama restarts"

### BrainDrive-Settings-Plugin
**Owner**: DJJones66
**Scope**: Settings UI

Create issues here for:
- Settings page UI
- Settings categories/tabs
- Plugin settings rendering
- Settings import/export

**Examples**:
- "Add settings search functionality"
- "Implement settings profiles"

### BrainDrive-Openrouter-Plugin
**Owner**: DJJones66
**Scope**: OpenRouter integration

Create issues here for:
- OpenRouter API key management
- OpenRouter model selection
- OpenRouter-specific settings

---

## Documentation & Marketing

### BrainDrive-Docs-Site
**Owner**: davewaring
**Scope**: Documentation

Create issues here for:
- Documentation content
- Docs site features (search, navigation)
- Style guide updates
- API reference docs
- Tutorials and guides

**Examples**:
- "Write troubleshooting guide for install errors"
- "Add dark mode to docs site"
- "Update plugin development tutorial"

### BrainDrive-Website
**Owner**: davewaring
**Scope**: Marketing site

Create issues here for:
- braindrive.ai website content
- Landing page updates
- Marketing copy
- Public-facing announcements

### BrainDrive-PluginTemplate
**Owner**: DJJones66 (code) / davewaring (docs)
**Scope**: Plugin starter template

Create issues here for:
- Template boilerplate code
- Plugin development documentation
- Starter examples

---

## Decision Tree for Ambiguous Cases

1. **Is it about how users interact with a feature?** → Relevant plugin repo
2. **Is it about underlying infrastructure?** → BrainDrive-Core
3. **Is it about installation/setup?** → BrainDrive-Install-System
4. **Is it documentation?** → BrainDrive-Docs-Site
5. **Is it marketing/public-facing?** → BrainDrive-Website
6. **Still unsure?** → Ask in the transcript summary or default to BrainDrive-Core

---

## Assignment Rules

| Type | Assignee |
|------|----------|
| Coding (any repo) | DJJones66 |
| Documentation | davewaring |
| Marketing/Content | davewaring |
| Design/UX decisions | davewaring |
| Business/Strategy | davewaring |
