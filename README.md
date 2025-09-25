# BrainDrive-Docs
Up to date, easy to follow developer documentation.

## Documentation Workflow Checklist
1. Open the workspace file at `BrainDrive-Core/.vscode/brain-drive.code-workspace` in VS Code so `BrainDrive-Core` and `BrainDrive-Docs` show up together in the Explorer.
2. In Explorer (`Ctrl+Shift+E`), expand `BrainDrive-Docs` and edit the Markdown file you need; peek at `BrainDrive-Core` whenever you need context or assets.
3. Preview your edits with `Ctrl+Shift+V` to confirm headings, links, and tables render as expected.
4. Run `Ctrl+Shift+F` with `BrainDrive-Docs/**` in “files to include” to update related references across the docs set.
5. Open the Source Control view, review the diff, then stage and commit the updated files with a clear message.
6. (Optional) For a browser preview, run `npm install` once and then `npm run start` inside `BrainDrive-Docs`; stop the local server with `Ctrl+C` when finished.
