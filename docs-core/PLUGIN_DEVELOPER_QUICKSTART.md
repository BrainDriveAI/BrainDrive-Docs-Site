---
title: Plugin Developer Quick Start
---

# ⚡ BrainDrive Plugin Developer Quick Start

Bring your AI-powered ideas to life in 30 minutes or less.

By the end of this guide you will be able to:

- ✅ Install and test plugins through the Plugin Manager
- ✅ Set up a rapid development environment with one-minute build cycles
- ✅ Use Service Bridges to tap into BrainDrive functionality without boilerplate
- ✅ Build, test, and iterate on plugin ideas quickly

## Prerequisites

- Node.js 16 or newer
- Git
- A local BrainDrive instance running

## Step 1: Install BrainDrive

Follow the [Installation Guide](https://docs.braindrive.ai/core/INSTALL) to get BrainDrive running locally.

## Step 2: Install the Plugin Template

1. Open **Plugin Manager → Install Plugins**.
2. Enter the URL `https://github.com/BrainDriveAI/BrainDrive-PluginTemplate`.
3. Click **Install** and wait for the green success message.

![BrainDrive Plugin Manager screenshot](https://raw.githubusercontent.com/BrainDriveAI/BrainDrive/main/images/Plugin%20Manager%20Install.png)

## Step 3: Test the Template

1. Open BrainDrive Studio.
2. Create a new page.
3. Drag **Plugin Template** from the left panel onto the canvas.
4. Click **Publish**.
5. Navigate to the new page—you should see the template plugin running.

![BrainDrive Studio screenshot](https://raw.githubusercontent.com/BrainDriveAI/BrainDrive/main/images/Install%20Plugin%20Template.png)

## Step 4: Set Up a Fast Development Environment

**Clone the template:**

```bash
# In your preferred development folder
git clone https://github.com/BrainDriveAI/BrainDrive-PluginTemplate.git MyPlugin
cd MyPlugin
npm install
```

**Configure for instant updates (skip full reinstall cycles):**

1. **Locate your BrainDrive backend path:** it will look like `[your-braindrive-path]/backend/plugins/shared/`.
2. **Update the Webpack config:** open `webpack.config.js`, find the commented `output` block, then uncomment and point it at your BrainDrive backend path:

   ```javascript
   output: {
     path: path.resolve(
       __dirname,
       '/path/to/BrainDrive-Core/backend/plugins/shared/PluginTemplate/v1.0.0/dist'
     ),
     // ... rest of config
   }
   ```

3. **Disable browser caching during development:** open DevTools, switch to the Network tab, check **Disable cache**, and leave DevTools open while testing.

## Step 5: Make Your First Change

1. **Edit the plugin:** open `src/BrainDrive-PluginTemplate.tsx` and change the title to `My Awesome Plugin!!`.
2. **Build and test:**

   ```bash
   npm run build
   ```

   Then refresh BrainDrive with `Ctrl+F5` (or `Cmd+Shift+R` on macOS).

3. **See instant results:** your change should appear immediately—no reinstall required.

> 🎉 You just experienced the one-minute development cycle.

## Step 6: Understand Service Bridges (The BrainDrive Secret Sauce)

**Why Service Bridges matter:**

- **Zero dependencies:** plugins stay compatible when BrainDrive updates.
- **Simple APIs:** complex backend operations become one-line calls.
- **Consistent interface:** the same patterns apply across BrainDrive features.

### Available Bridges

Each bridge has an example plugin and documentation you can explore.

| **Bridge** | **Purpose** | **Example Use** | **Learn by Doing** |
| --- | --- | --- | --- |
| `API` | Backend communication | `await services.api.get('/data')` | [API Example](https://github.com/DJJones66/ServiceExample_API) |
| `Event` | Plugin messaging | `services.event.emit('myEvent', data)` | [Events Example](https://github.com/DJJones66/ServiceExample_Events) |
| `Theme` | Light/dark mode switching | `services.theme.getCurrentTheme()` | [Theme Example](https://github.com/DJJones66/ServiceExample_Theme) |
| `Settings` | User preferences | `services.settings.getSetting('myKey')` | [Settings Example](https://github.com/DJJones66/ServiceExample_Settings) |
| `Page Context` | Current page information | `services.pageContext.getContext()` | [Context Example](https://github.com/DJJones66/ServiceExample_PageContext) |
| `Plugin State` | Data persistence | `services.pluginState.save(data)` | [State Example](https://github.com/DJJones66/ServiceExample_PluginState) |

## Step 7: Build Something Simple

Review the [Lifecycle Manager Customization Guide](https://github.com/BrainDriveAI/PluginTemplate/blob/main/references/LIFECYCLE_MANAGER_CUSTOMIZATION_GUIDE.md) for the full set of hooks and patterns, then pick a bridge and ship a tiny feature.

**Starter ideas:**

### Hello AI Chat

```typescript
// Simple AI interaction using the API bridge
const response = await this.props.services.api.post('/chat', {
  message: userInput,
  model: 'gpt-4',
});
```

### Theme-Aware Widget

```typescript
// React to theme changes
componentDidMount() {
  this.props.services.theme.addThemeChangeListener(this.handleThemeChange);
}
```

### Cross-Plugin Messaging

```typescript
// Send messages between plugins
this.props.services.event.emit('dataUpdate', { newValue: 42 });
```

## Step 8: Bring Your AI-Powered Ideas to Life

The only limit is your imagination—your AI, your rules.

### Dave J's Rules for Success

1. **Test the unmodified template first:** verify the base works before customizing.
2. **Make incremental changes:** test after each small modification.
3. **Use the one-minute cycle:** avoid falling back to slow reinstall loops.
4. **Lean on Service Bridge examples:** copy working patterns instead of reinventing them.

### Have Questions?

- 💬 [Developer Forum](https://community.braindrive.ai) — Get help and share plugins.
- 📖 [API Documentation](http://localhost:8005/api/v1/docs) — Explore backend endpoints (when running locally).
- 🐛 [Report Issues](https://github.com/BrainDriveAI/BrainDrive-Core/issues) — Use the `[plugin]` tag for plugin-related reports.

Happy building!
