# BrainDrive Docs Site

## Project Overview
Documentation site for BrainDrive (Docusaurus). Docs are synced from external repos daily.

## Key Commands
- `npm run sync` — Pull latest docs from external repos
- `npm run build` — Build the site (verify no broken links)
- `npm run start` — Local dev server

## Documentation Workflow
- **Synced folders** (edit in source repos, not here):
  - `docs-core/` ← BrainDrive-Core
  - `docs-template/` ← PluginTemplate
  - `docs-plugins/<plugin>/` ← Individual plugin repos
- **Editable here**: `docs-services/`, `docs-plugins/intro.md`

## Style Guide Highlights
- Use "Owner" or "Builder" instead of "user"
- Voice: Direct, empowering, technical but accessible
- Target persona: Adam Carter (tech-savvy developer/entrepreneur)
- Templates in `docs-context/templates/`

## Current State (as of Jan 2025)
- Audited docs-core, docs-plugins, docs-template
- Fixed typos and broken links
- Removed Docusaurus template content (blog/, docs/, site/ folders)
- Removed duplicate INSTALL.mdx route (was creating /core/INSTALL, now only /core/getting-started/install exists)
- Fixed all broken /core/INSTALL links across docs and sync script
- Pending: API Reference guide (planned, needs backend API info)
- Pending: Delete intro.md placeholders in source repos (BrainDrive-Core, PluginTemplate)
- Pending: 7 minor fixes in plugin repos (Chat, Ollama, Settings) — see below

## Pending Plugin Repo Fixes

### BrainDrive-Chat-Plugin
- Line ~85: Fix clone URL (YourOrg → BrainDriveAI)
- Line ~129: Clarify CSS description (Tailwind-like → Custom)
- Lines ~166-167: Remove duplicate "## Resources" heading
- Line ~168: Add missing space ("modify,and" → "modify, and")

### BrainDrive-Ollama-Plugin
- Lines ~18-19: Fix path ("PluginBuild/BrainDrive-Ollama-Plugin" → "BrainDrive-Ollama-Plugin")

### BrainDrive-Settings-Plugin
- Lines ~18-19: Fix path ("PluginBuild/BrainDrive-Settings-Plugin" → "BrainDrive-Settings-Plugin")
- Line ~38: Add missing space ("modify,and" → "modify, and")

## Key Context Files
- `docs-context/documentation-plan.md` — Overall docs strategy
- `docs-context/technical-docs-style-guide.md` — Writing style
- `docs-context/personas/adam-carter.md` — Target audience
- `docs-context/doc-types.md` — How-to, Concept, Reference, Troubleshooting templates

## API Reference Planning
Next major task. Needs from user:
1. Backend API endpoints (from FastAPI at localhost:8005/docs or route files)
2. Service Bridge TypeScript interfaces (from BrainDrive-Core frontend)
3. Authentication model details

Proposed structure:
- Overview + architecture
- Backend REST API (auth, plugins, settings, pages)
- Service Bridges (all 6 with full method signatures)
- Plugin API Contracts (lifecycle manager, metadata formats)
- Error handling

## Developer Experience Evaluation (Jan 2025)
Overall score: 7/10. Strengths: plugin development docs are excellent. Gaps:
- No clear "Start Here" landing page
- API Reference is placeholder only
- No troubleshooting guide
- Service Bridges docs scattered (need unified reference)
