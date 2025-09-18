---
title: Core Overview
slug: /
---

# Welcome to BrainDrive

BrainDrive is an open‑source, modular ChatGPT alternative that makes it easy to build, control, and benefit from your own AI system.  Self‑hosted and MIT‑licensed, BrainDrive takes control away from Big Tech companies, and gives it back to you.

Inspired by the WordPress --> Install the core, add plugins, and rapidly ship AI‑powered features.

## What You Can Do With BrainDrive

Out of the box you get:

- **Chat interface** — a web‑based chat UI for interacting with local or API‑hosted AI models.
- **Plugin Manager** — a marketplace where you can browse, install, and update extensions.
- **Page Builder** — a drag‑and‑drop editor for composing dashboards and custom interfaces without writing code.
- **Developer resources** — examples and tutorials to guide you through building your own plugins.

Using these tools, you can build personal assistants, productivity tools, data‑analysis dashboards, custom UIs around AI models, or even multi‑plugin workflows that coordinate several components. You can host your BrainDrive locally or deploy it anywhere. No Big Tech lockin, just Your AI. Your Rules. 

## System Architecture

BrainDrive is composed of two primary layers: the **Core System** and the **Plugin Ecosystem**.

### Core System

The core system lives in the `BrainDrive‑Core` repository. It includes:

| Component | Description |
| --- | --- |
| **Frontend (PluginStudio)** | A single‑page application built with React 18, TypeScript, Vite, and Material‑UI. It provides the chat UI, plugin manager, page builder, route management, and theme support. |
| **Backend** | A FastAPI server using SQLModel (on top of SQLAlchemy and Pydantic) with SQLite by default. It manages users, authentication, plugin lifecycle, conversation storage, and settings. |

These components communicate over HTTP. The backend exposes REST APIs and serves plugin modules; the frontend orchestrates the UI and calls these APIs.

### Plugin Ecosystem

BrainDrive’s power comes from its modular plugin architecture. Plugins are hosted in their own repositories and can contain frontend code, backend code, or both. Plugins integrate with the core using **service bridges**—abstracted interfaces for calling APIs, emitting events, accessing theme and settings information, reading page context, and storing plugin state. This decoupled design means that plugins remain forward‑compatible even as the core evolves.

Thanks to Webpack’s **module federation**, frontend plugins are loaded at runtime, allowing you to add new features without recompiling the core. Back‑end plugins register themselves with the core server via a universal lifecycle interface for installation and updates.

Because BrainDrive is open source and modular, you can customize every layer:

- Deploy local models, connect to API services, or build your own provider through the **AI provider registry**.
- Use the visual tools to assemble UIs or dive into code with the plugin template and development guides.
- Stay in control of your data—host on your own machines or on the cloud of your choice.

## Getting Started

Head over to the **Installation Guide** for step‑by‑step instructions on setting up BrainDrive locally. Once you have the backend and frontend running, explore the **Plugin Manager**, build custom pages in **PluginStudio**, or start developing your own plugins with the **developer quick‑start guide**.

If you encounter questions or want to see what others are building, join our friendly **community forum**.

We’re excited to see what you create with BrainDrive!

---

**Related:** Backend README in the BrainDrive-Core repository: [Backend README](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/backend/README.md)
