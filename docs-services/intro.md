---
title: Service Bridges Overview
---

# Service Bridges Overview

When developing BrainDrive plugins, you don’t interact with the core system directly. Instead, you use **service bridges**, standardized interfaces that allow plugins to communicate with the BrainDrive backend, frontend, and user environment. These bridges insulate your plugin from the underlying implementation, keeping your code compatible as the core evolves.

## Why Service Bridges?

- **Decoupling:** Plugins avoid direct dependencies on the core codebase; they talk through well-defined services.
- **Forward compatibility:** As long as the service contracts remain stable, changes to the core internals will not break your plugin.
- **Simplified development:** You get ready-made helpers for common tasks—making API calls, emitting events, persisting state, retrieving settings—without writing boilerplate code.

In React components, bridges are available through `this.props.services`. Backend lifecycle code can import the same service interfaces.

## Available Bridges

| Service Bridge | Purpose | Example |
| --- | --- | --- |
| **API Bridge** | Call backend REST endpoints—including your own plugin’s routes—without setting up an HTTP client manually. | `await services.api.get('/my_plugin/endpoint')` |
| **Event Bridge** | Send and listen for cross-plugin events to coordinate state or actions. | `services.event.emit('eventName', data)` |
| **Theme Bridge** | Access the current theme (light or dark) and subscribe to changes so components adapt their styles. | `const theme = services.theme.getCurrentTheme()` |
| **Settings Bridge** | Read or update user preferences and plugin settings, with support for system and user-level scopes. | `services.settings.getSetting('myKey')` |
| **Page Context Bridge** | Retrieve the current page or route information—page IDs, paths, parameters—for context-aware plugins. | `services.pageContext.getContext()` |
| **Plugin State Bridge** | Store and retrieve persistent key–value data scoped to your plugin, perfect for lightweight caching. | `await services.pluginState.save(data)` |

## Best Practices

- **Lean on Bridges First:** Favor bridges over rolling your own networking or storage logic to stay aligned with the ecosystem.
- **Emit Meaningful Events:** Use descriptive event names and document payloads so other plugins can subscribe effectively.
- **Stay Theme-Aware:** Subscribe to theme updates via the Theme Bridge so your UI matches BrainDrive’s light and dark modes.
- **Respect User Preferences:** Read and write through the Settings Bridge to honor user expectations across sessions.
- **Keep Cached Data Small:** The Plugin State Bridge is best for small amounts of data. For larger needs, expose backend endpoints via the API Bridge.

## Next Steps

To see service bridges in action, explore the Plugin Template or follow the **Developer Quick Start** guide. These resources demonstrate how to import and use each bridge in React components and backend lifecycle hooks. By leaning on service bridges, you can ship powerful, forward-compatible plugins with minimal overhead.
