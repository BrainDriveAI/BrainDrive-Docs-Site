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

## Working with Source Repos in Codespaces
Codespaces tokens are scoped only to this repo by default. To push to other BrainDrive repos:

1. **One-time setup** — Re-authenticate gh with broader scope:
   ```bash
   GITHUB_TOKEN= gh auth login -w -p https
   GITHUB_TOKEN= gh auth setup-git
   ```
   Complete the browser auth flow, then git will use your full permissions.

2. **Clone source repos** to `/workspaces/`:
   ```bash
   cd /workspaces
   gh repo clone BrainDriveAI/BrainDrive-Chat-Plugin
   ```

3. **Push changes** (prefix with `GITHUB_TOKEN=` to bypass Codespaces token):
   ```bash
   GITHUB_TOKEN= git -C /workspaces/BrainDrive-Chat-Plugin push
   ```

Already cloned: `BrainDrive-Core`, `BrainDrive-Chat-Plugin`, `BrainDrive-Ollama-Plugin`, `BrainDrive-Openrouter-Plugin`, `BrainDrive-Settings-Plugin`, `BrainDrive-PluginTemplate`

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
- ✅ API Reference guide complete (5 files in `docs-core/reference/`)
- Removed Chat-With-Docs plugin docs (plugin removed from BrainDrive; new version coming later)
- Pending: Delete intro.md placeholders in source repos (BrainDrive-Core, PluginTemplate)
- Pending: 7 minor fixes in plugin repos (Chat, Ollama, Settings) — see below
- Pending: "Start Here" landing page for new developers
- Pending: Troubleshooting guide

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

## API Reference (COMPLETE)
Published January 6, 2025 to `BrainDrive-Core/docs/reference/` (syncs to `docs-core/reference/`).

| File | Contents |
|------|----------|
| `API.md` | Overview, architecture, auth, response formats |
| `backend-api.md` | ~100 REST endpoints across 15 groups |
| `service-bridges-api.md` | All 6 frontend TypeScript bridges |
| `plugin-api-contracts.md` | Lifecycle manager, manifest schemas |
| `workflows.md` | Practical examples tying APIs together |

Planning doc: `docs-context/drafts/api-reference-guide-planning.md`

## Developer Experience Evaluation (Jan 2025)
Overall score: 7/10 → improved with API Reference. Remaining gaps:
- No clear "Start Here" landing page
- ~~API Reference is placeholder only~~ ✅ Complete
- No troubleshooting guide
- ~~Service Bridges docs scattered~~ ✅ Unified in `service-bridges-api.md`
