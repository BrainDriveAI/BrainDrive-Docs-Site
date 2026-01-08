# Gotchas Discovered During Test Plugin Build

**Date:** January 8, 2025
**Test:** Built "TestGotchasPlugin" from PluginTemplate

## Gotchas Found

### 1. Import paths break after renaming files
**Location:** `src/index.tsx`, any file that imports the main component
**Problem:** After renaming `src/PluginTemplate.tsx` → `src/TestGotchasPlugin.tsx`, the import in `src/index.tsx` still says:
```typescript
import PluginTemplate from './PluginTemplate';
```
**Fix:** Update to match new filename:
```typescript
import TestGotchasPlugin from './TestGotchasPlugin';
```

### 2. CSS import path also breaks
**Location:** Main component file (e.g., `src/TestGotchasPlugin.tsx`)
**Problem:** The CSS import still references old name:
```typescript
import './PluginTemplate.css';
```
**Fix:** Update after renaming CSS file:
```typescript
import './TestGotchasPlugin.css';
```

### 3. Class name inside renamed file doesn't auto-update
**Location:** `src/TestGotchasPlugin.tsx` (the renamed file)
**Problem:** Just renaming the file doesn't change the class inside:
```typescript
class PluginTemplate extends React.Component  // Still old name!
```
**Fix:** Update class name AND export default:
```typescript
class TestGotchasPlugin extends React.Component
// ...
export default TestGotchasPlugin;
```

### 4. Multiple occurrences in index.tsx
**Location:** `src/index.tsx`
**Problem:** The component name appears in multiple places:
- Import statement (line 2)
- Export default (line 9)
- Metadata object (line 19)
- JSX render call (lines 138, 140)

**All of these need updating!**

### 5. Types file may need updating (optional)
**Location:** `src/types.ts`
**Observation:** The types file has `PluginTemplateProps` and `PluginTemplateState`. These still work because TypeScript doesn't require type names to match component names. However, for consistency, you may want to rename them too.

### 6. lifecycle_manager.py has 3 places to update for plugin identity
**Location:** `lifecycle_manager.py`
**Places to update:**
- `plugin_data["name"]`
- `plugin_data["scope"]`
- `plugin_data["plugin_slug"]`

**These must all match!**

### 7. Module name must be different from plugin name
**Location:** `lifecycle_manager.py` → `module_data[0]["name"]`
**Problem:** If you name your module the same as your plugin:
```python
plugin_data["name"] = "MyPlugin"
module_data[0]["name"] = "MyPlugin"  # BAD!
```
BrainDrive can't tell them apart.
**Fix:** Use different names:
```python
plugin_data["name"] = "MyPlugin"
module_data[0]["name"] = "MyPluginModule"  # Good!
```

### 8. webpack.config.js has both plugin and module names
**Location:** `webpack.config.js` lines 7-8
**Problem:** Both need updating, and module must match lifecycle_manager.py:
```javascript
const PLUGIN_NAME = "TestGotchasPlugin";
const PLUGIN_MODULE_NAME = "TestGotchasModule"; // Must match lifecycle_manager.py!
```

### 9. npm deprecation warnings (informational, not blocking)
**Observation:** `npm install` shows deprecation warnings for inflight, rimraf, and glob. These don't prevent the plugin from working but may be addressed in future template updates.

## Summary: Complete Rename Checklist

When renaming a plugin, update these locations in order:

| Step | File | What to change |
|------|------|----------------|
| 1 | Folder | Rename the entire plugin folder |
| 2 | `package.json` | `name`, `description` |
| 3 | `src/*.tsx` | Rename main component file |
| 4 | `src/*.css` | Rename CSS file to match |
| 5 | `src/[Component].tsx` | Class name, export default, CSS import path |
| 6 | `src/index.tsx` | Import statement, export, metadata, JSX usage |
| 7 | `src/types.ts` | (Optional) Rename type interfaces |
| 8 | `webpack.config.js` | `PLUGIN_NAME`, `PLUGIN_MODULE_NAME` |
| 9 | `lifecycle_manager.py` | `name`, `scope`, `plugin_slug` (must match!) |
| 10 | `lifecycle_manager.py` | `module_data[0]["name"]` (must DIFFER from plugin!) |

## Recommended: Use Find & Replace

Most IDEs support project-wide find & replace. Search for:
- `PluginTemplate` → replace with `YourPluginName`
- `PluginTemplateModule` → replace with `YourPluginModule`

But always verify the module name is different from the plugin name after replacing!
