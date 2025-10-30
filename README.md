# BrainDrive Documentation Hub

BrainDrive-Docs-Site powers BrainDrive's public developer documentation. The site is powered by [Docusaurus 3](https://docusaurus.io/) and aggregates content from the main BrainDrive codebase, plugin templates, and dedicated documentation written in this repository.

## Quick start

1. **Install prerequisites**
   - Node.js ≥ 18
   - npm (bundled with Node.js)
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the local site**
   ```bash
   npm run start
   ```
   The site opens at <http://localhost:3000>. Saved changes to Markdown/MDX or React components trigger hot reloads.

### Other useful scripts

| Command | Description |
| ------- | ----------- |
| `npm run build` | Produces a production build in `build/`. |
| `npm run serve` | Serves the build output locally for verification. |
| `npm run typecheck` | Runs the TypeScript compiler against the custom theme/components. |
| `npm run clear` | Clears cached Docusaurus metadata—helpful when sidebar or plugin changes are not picked up. |
| `npm run sync` | Re-syncs documentation from external BrainDrive repositories (see below). |

## Repository layout

```
BrainDrive-Docs-Site/
├── docs/              # Hand-written docs that live only in this repo (tutorials, intro, etc.)
├── docs-core/         # Synced docs from BrainDrive-Core (see `npm run sync`).
├── docs-services/     # Service-specific docs (hand-written).
├── docs-plugins/      # Plugin docs; includes synced sections such as ai-chat.
├── docs-template/     # Synced docs from the BrainDrive Plugin Template repo.
├── blog/              # Blog posts (MDX) displayed in the Docs site blog.
├── site/              # Additional MDX/Markdown content used for the marketing landing pages.
├── src/               # Custom React theme/components and client-side behavior.
├── static/            # Static assets copied verbatim into the build output.
├── sidebars*.ts       # Sidebar definitions grouping documents by product area.
├── docusaurus.config.ts  # Docusaurus site configuration.
└── scripts/sync.mjs   # Sync utility for importing docs from other repos.
```

## Writing and organizing content

- **File format**: Use Markdown (`.md`) or MDX (`.mdx`). Docusaurus front matter (YAML fenced by `---`) sets titles, descriptions, and tags.
- **Placement**: Choose the folder that matches the topic (core, services, plugins, templates). If a new top-level area is required, add the folder under the project root and register it in the appropriate `sidebars.*.ts` file.
- **Sidebars & navigation**: Update the relevant `sidebars.<area>.ts` file to expose new docs in the left-hand navigation. For shared/global docs, use `sidebars.ts`.
- **Assets**: Place images or downloadable assets in the same folder as the referencing doc or under `static/`. Use relative paths when possible (e.g., `![Alt](./img/diagram.png)`).
- **MDX components**: Import reusable components from `src/components`. Avoid heavy logic in MDX; prefer extracting it into a React component.

## Syncing external documentation

Running `npm run sync` clones remote repositories into a temporary cache and copies curated documentation into this project:

- `BrainDriveAI/BrainDrive-Core` → `docs-core/`
- `BrainDriveAI/PluginTemplate` → `docs-template/`
- `DJJones66/BrainDriveChat` → `docs-plugins/ai-chat/` (optional; skips if cloning fails)

The script sanitizes Markdown for compatibility, removes unsupported Kramdown attributes, and ensures each synced section has an `intro.md`. Use a `GH_TOKEN` environment variable with appropriate GitHub access to avoid rate limits for private repositories.

> ⚠️ The sync script replaces the entire target directories. Commit any local edits before running it or they may be lost.

A scheduled GitHub Action (`.github/workflows/scheduled-docs-sync.yml`) runs this sync daily at 06:00 UTC, builds the site, and pushes any doc updates straight to `main`. Set the `DOCS_SYNC_TOKEN` secret if private repositories need to be cloned. The action can also be triggered manually from the GitHub Actions tab when an immediate refresh is required.

## Contribution workflow

1. Use the combined BrainDrive workspace at `BrainDrive-Core/.vscode/brain-drive.code-workspace` if you need to reference product code while editing docs.
2. Make changes in the relevant Markdown/MDX files and preview with VS Code (`Ctrl+Shift+V`) or the local dev server.
3. Update sidebars and navigation links as needed, then run `npm run typecheck` (and optionally `npm run build`) before committing.
4. Stage and commit with a descriptive message. Each PR should include a quick summary of the affected doc areas.

## Deployment

Production builds are created via `npm run build` and deployed from the generated `build/` directory. The deploy process depends on your hosting setup (e.g., GitHub Pages, Vercel). Ensure CI runs the build and TypeScript checks to catch broken links or MDX issues before publishing.

## Support

If you spot issues or need access to the synced repositories, reach out in the support forum at community.braindrive.ai or open an issue in this repository.
