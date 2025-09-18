---
title: Introduction to BrainDrive Plugins
---

# Introduction to BrainDrive Plugins

BrainDrive’s power comes from its plugin ecosystem. The core system delivers a solid foundation—frontend, backend, and baseline UI—but plugins let you extend, customize, and monetize your AI on your own terms. Each plugin lives in its own repository and can be added to your installation dynamically; there’s no need to fork or modify the core.

## What Is a Plugin?

A BrainDrive plugin is a self-contained module that adds new capabilities to your deployment. You might build a plugin that wraps a new AI model, connects to an external data source, creates a custom visualization, or orchestrates multi-step workflows. Typical use cases include:

- custom chatbots with specialized knowledge
- AI-powered productivity tools and dashboards
- tailored user interfaces for specific AI models
- multi-plugin workflows where multiple AI components collaborate

A plugin can bundle:

- **Frontend code** built with React and TypeScript, loaded at runtime via Webpack Module Federation.
- **Backend code** written in Python with FastAPI, integrated through the standardized lifecycle API for installation, configuration, and cleanup.

The core automatically discovers installed plugins and serves their backend and frontend modules, so you can update or remove them independently.

## Installing Plugins

BrainDrive ships with a visual Plugin Manager where you can browse, install, update, or remove plugins. To add one, provide its GitHub URL; the manager downloads the repository, registers it with the backend, and exposes its components in the frontend. Manual installation is possible by following the plugin’s README, but the Plugin Manager is the recommended path for most operators.

## How Plugins Work

Plugins interact with the core through a suite of service bridges. These bridges hide implementation details and provide stable interfaces so your plugin can:

- call backend APIs (API Bridge)
- emit and subscribe to events (Event Bridge)
- access theme tokens (Theme Bridge)
- read or update user settings (Settings Bridge)
- understand the current route or page context (Page Context Bridge)
- persist per-plugin data (Plugin State Bridge)

By relying on these bridges instead of private internals, plugins stay decoupled from the core and remain forward compatible as BrainDrive evolves.

## Building Your Own Plugin

Ready to build? Start from the official Plugin Template and walk through the Developer Quick Start guide. You’ll learn how to scaffold a plugin, expose React components, register backend routes, and work with the service bridges. The template includes a working example you can modify, and the quick-start guide takes you from “Hello, world” to shipping your first plugin.

For deeper dives into lifecycle hooks, bridge APIs, and advanced patterns, check out the Plugin Development Guide in the documentation index.
