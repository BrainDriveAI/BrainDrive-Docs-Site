# Plugin Developer Quickstart Improvements

Draft plan for improving `docs/plugin-development/quickstart.md`

## Current State

The quickstart covers the basics but has some gaps that may cause friction for first-time plugin developers.

## Proposed Improvements

### 1. Clarify the Clone vs Install Flow (High Priority)

**Problem:** Steps 2-4 are confusing. You install the template via Plugin Manager, then clone it. Developers wonder "why both?"

**Solution:** Add explicit callouts:
- Step 2: Install to verify your BrainDrive setup works correctly
- Step 4: Clone a *fresh* copy to build YOUR plugin (don't modify the installed one)

Consider restructuring as:
1. Verify BrainDrive works (install template, test it)
2. Set up your development environment (clone, rename, configure)
3. Build and iterate

---

### 2. Add "Rename Your Plugin" Section (High Priority)

**Problem:** After cloning, developers don't know what to rename. This is where most first-timers get stuck.

**Solution:** Add a clear checklist of files/values to update:

| File | What to Change |
|------|----------------|
| `package.json` | `name`, `description`, `version` |
| `lifecycle_manager.py` | `slug`, `name`, `description`, component IDs |
| `src/BrainDrive-PluginTemplate.tsx` | Rename file and component class/function |
| `webpack.config.js` | Module federation `name` and exposed component name |
| Output folder | `PluginTemplate/v1.0.0` → `YourPluginName/v1.0.0` |

Include a note about naming conventions (link to `naming-conventions.md`).

---

### 3. Modernize Code Examples (Medium Priority)

**Problem:** Examples use class component syntax (`this.props.services`, `componentDidMount`) but modern React prefers functional components with hooks.

**Solution:** Update examples to show functional component patterns, or show both:

```typescript
// Current (class component)
componentDidMount() {
  this.props.services.theme.addThemeChangeListener(this.handleThemeChange);
}

// Modern (functional component)
const MyPlugin = ({ services }: PluginProps) => {
  useEffect(() => {
    const unsubscribe = services.theme.addThemeChangeListener(handleThemeChange);
    return () => unsubscribe();
  }, []);
};
```

---

### 4. Make "Hello AI Chat" Example Complete (Medium Priority)

**Problem:** The example references `/chat` endpoint and `userInput` variable without context. Won't work as-is.

**Solution:** Provide a complete, copy-paste-ready example:

```typescript
const [input, setInput] = useState('');
const [response, setResponse] = useState('');

const handleSend = async () => {
  const result = await services.api.post('/api/v1/chat/completions', {
    messages: [{ role: 'user', content: input }],
    model: 'default'
  });
  setResponse(result.data.choices[0].message.content);
};
```

---

### 5. Add "Publishing Your Plugin" Section (Medium Priority)

**Problem:** Guide ends at "build something" but doesn't cover distribution.

**Solution:** Add brief section covering:
- Push to GitHub (public repo)
- Create a release/tag (optional but recommended)
- Share the repo URL — others can install via Plugin Manager
- Post to [Plugin Marketplace](https://community.braindrive.ai/c/the-marketplace/13) for visibility

---

### 6. Add Common Gotchas / Troubleshooting (Low Priority)

**Problem:** Common issues aren't addressed.

**Solution:** Add a troubleshooting section:

| Issue | Solution |
|-------|----------|
| Component not appearing in Page Builder | Check `dist/remoteEntry.js` exists; verify manifest in `lifecycle_manager.py` |
| Changes not showing after build | Verify webpack output path; hard refresh (Ctrl+Shift+R); check "Disable cache" is on |
| Plugin won't install from GitHub | Ensure repo is public; check for build errors in backend console |
| "Module not found" errors | Run `npm install`; check import paths |

---

### 7. Improve Webpack Path Configuration (Low Priority)

**Problem:** Step 4.2 requires hardcoding an absolute path, which is brittle and error-prone.

**Possible solutions:**
- Environment variable approach (`.env.local` with `BRAINDRIVE_PLUGINS_PATH`)
- npm script that auto-detects based on common locations
- Symlink from plugin folder to BrainDrive plugins directory

---

## Questions for Lead Dev

1. **Template architecture:** Does the PluginTemplate support functional components with hooks, or is it class-based only? This affects how we write examples.

2. **Webpack path:** Is there appetite for improving the dev setup (env var, auto-detect, or symlink) or is the manual path config intentional for flexibility?

3. **API endpoint:** What's the correct endpoint for the "Hello AI Chat" example? Is it `/api/v1/chat/completions` or something else? What model values are valid?

4. **Manifest fields:** Are there required vs optional fields in `lifecycle_manager.py` that we should call out? Any gotchas with the component ID format?

5. **Publishing flow:** Is there a preferred release/tag format for plugins? Any CI/CD patterns we should recommend?

6. **Scope:** Should this remain a "quickstart" (minimal, get-going-fast) or expand into a more comprehensive guide? If minimal, some of these improvements might belong in a separate "Plugin Development Guide" doc.
