---
title: PluginTemplate Overview
---

# PluginTemplate Overview

BrainDrive plugins are modular, self-contained packages that extend your AI system. To make getting started easier, the BrainDrive team provides an official **Plugin Template**—a boilerplate project you can fork or clone to build your own plugin quickly. The template includes a sample frontend component, an optional backend lifecycle manager, build configuration, and documentation.

## Why Use the Template?

- **Minimal boilerplate:** Start with a working React component and Python lifecycle manager so you can focus on your plugin’s unique functionality.
- **Consistent structure:** Plugins that follow the template’s layout are automatically discoverable by the core backend and can be managed through the Plugin Manager.
- **Rapid iteration:** With just a few tweaks, you can achieve a one-minute development cycle—edit, build, refresh—to see your changes live.

## Installing the Template Plugin

Preview the template plugin inside your BrainDrive installation:

1. Open the **Plugin Manager**.
2. Enter the repository URL `https://github.com/BrainDriveAI/BrainDrive-PluginTemplate`.
3. Click **Install**.

A plugin named “Plugin Template” appears immediately. Open the Page Builder, create a new page, and drag the “Plugin Template” component onto the canvas. This lets you explore the plugin’s UI and configuration panel as end users will see it.

## Creating Your Own Plugin

1. **Clone the repository** under a new name:

   ```bash
   git clone https://github.com/BrainDriveAI/BrainDrive-PluginTemplate.git MyPlugin
   cd MyPlugin
   npm install
   ```

2. **Inspect the structure:** You’ll find `src/` for React components, `dist/` for build output, `lifecycle_manager.py` for optional backend logic, and `README.md`. The lifecycle manager class exposes hooks such as `install_plugin`, `delete_plugin`, and `get_plugin_status`, which BrainDrive invokes automatically.

3. **Configure build output:** Point the Webpack build to BrainDrive’s plugin directory (for example, `backend/plugins/shared/MyPlugin/latest/dist`). This avoids reinstalling after each change—run `npm run build` and refresh BrainDrive to test updates.

4. **Leverage service bridges:** Use the API, Event, Theme, Settings, Page Context, and Plugin State bridges to interact with the core system while staying decoupled and forward compatible.

5. **Start small:** Begin with a “Hello, world” component. Try sending a prompt via the API bridge or adapting styles through the Theme bridge to understand the development flow.

## Next Steps

- Read the template’s `README.md` for detailed instructions and best practices.
- Dive into the **Plugin Development Guide** for lifecycle details, bridge APIs, and deployment strategies.
- Join the [community forum](https://community.braindrive.ai) to share ideas and get feedback.

With the PluginTemplate as your launchpad, you can build and iterate on custom plugins quickly, bringing new capabilities to BrainDrive.
