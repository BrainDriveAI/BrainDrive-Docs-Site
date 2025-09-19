---
id: OWNER_USER_GUIDE
title: BrainDrive Owner’s User Guide
sidebar_label: BrainDrive User Guide
---

# BrainDrive Owner’s User Guide

## 1) Welcome

### What is BrainDrive?
BrainDrive is your personal, self-hosted AI system—open-source (MIT-licensed), modular, and built so you fully own the software, the data, and the value you create. In short: **Your AI. Your Rules.**

BrainDrive gives you a private ChatGPT-style experience that runs under your control, with a plugin system that lets you add capabilities or build your own. You can run it locally for maximum privacy or connect to API-based models if you prefer—your choice.

### Who is it for?
BrainDrive serves three groups that often overlap:
- **Owners** who want full control over their AI and data.  
- **Builders** who like to customize and extend with plugins.  
- **Entrepreneurs** who want to package and monetize AI solutions.

Two example profiles:
- **Adam Carter (Builder/Entrepreneur):** tech-savvy, values decentralization, wants to build & sell tools on his own terms.  
- **Katie Carter (Creator/Owner):** a solo creator scaling content and community with an AI that learns her voice—without ceding control to Big Tech.

### What you’ll accomplish with this guide
- Understand what BrainDrive includes out of the box  
- Set up your first AI model (local or API)  
- Create a custom page with components that match your workflow  
- Install and manage plugins safely and confidently

> BrainDrive is built on four pillars: **Ownership, Freedom, Empowerment, Sustainability.** Keep these in mind as you shape your system.

---

## 2) What you get with BrainDrive

### The five components (high level)
1) **BrainDrive Core** — the owner-controlled foundation (auth, chat, storage).  
2) **BrainDrive Studio** — visual page builder; compose your workspace from components.  
3) **BrainDrive Community** — learn, share, and get help.  
4) **BrainDrive Marketplace** — discover and exchange plugins, templates, and services.  
5) **BrainDrive LLC** — the first business node (optional hosting/support), not a gatekeeper.

### Out-of-the-box experience
- Web chat interface (private conversations, history, tags)  
- **Plugin Manager** (install, update, disable, remove)  
- **Page Builder (Studio)** with drag-and-drop components  
- Light/Dark themes  
- Settings for models, themes, and preferences

---

## 3) Key concepts you’ll use daily

### Pages
Pages are custom workspaces you design in **Studio**. Build one for writing, another for research, another for client work—each with different components and models. Reorder, rename, or remove any time.

### Components
Components are the building blocks you drop onto a page (e.g., Chat, Notes, Data Viz). Many come from plugins you install. Configure each instance (model, prompt, options) via the properties panel.

### Plugins
Plugins add new capabilities (components, services, workflows). Install from a GitHub URL in **Plugin Manager**, then use their components in Studio. You can enable/disable, update, or uninstall as needed.

> Language & tone in this guide: conversational, clear, and empowering for owners.

---

## 4) Quick start (owner-friendly)

> A one-click installer is on the roadmap; for now, you can set up quickly using the standard steps summarized here. If you prefer managed hosting later, that will be available through ecosystem businesses.

### Quick setup overview
1) **Prereqs:** Conda (or Python env), Git, Node.js.  
2) **Get the code:** Clone BrainDrive-Core.  
3) **Start:** Run the backend (FastAPI) and the frontend (Vite).  
4) **Visit:** Open the app in your browser and sign in.  
5) **Verify:** Confirm chat works, then head to Settings and Studio.

If you run into trouble, check **Troubleshooting** at the end of this guide.

---

## 5) Set up your first AI model

### Option A — Local model (maximum privacy)
- Install a local provider (e.g., Ollama) and pull a model.  
- In **Settings → AI Providers**, choose your local provider and model.  
- Return to Chat and say hello—everything stays on your machine.

### Option B — API-based model (convenience & speed)
- Get an API key from your preferred provider.  
- In **Settings → AI Providers**, add the key and select a model.  
- Test in Chat. (You control which data is sent and can switch providers any time.)

> BrainDrive doesn’t require a subscription. API-based models may have their own usage fees—your choice.

---

## 6) Build your first page in Studio

1) Open **Studio → New Page** and name it (e.g., “Research Desk”).  
2) Add a **Chat** component; set its model and (optionally) a system prompt.  
3) Add any plugin components you’ve installed (Notes, Viz, etc.).  
4) Resize and arrange; click **Save**.  
5) Find your page in the top navigation and start using it.

**Tips**
- Make task-specific pages (Writing, Inbox Triage, Learning).  
- Keep layouts simple at first; evolve as your workflow evolves.  
- Export/import page JSONs to back up or share setups.

---

## 7) Install and manage plugins

### Install
- Go to **Settings → Plugin Manager → Install Plugin**.  
- Paste a plugin’s GitHub URL and confirm. The new components appear in Studio.

### Update / Disable / Remove
- Use the toggles and **Update/Uninstall** actions in Plugin Manager as needed.  
- If you remove a plugin, delete its components from your pages first.

### Brand & attribution note
You’re free to say **“Built on”** or **“Powered by BrainDrive”**, build your own brand, and monetize your solutions—just don’t imply you’re the official BrainDrive or use the name/logo in a way that causes confusion. Examples:  
- ✅ “NeuronWorks — Built on BrainDrive”  
- ❌ “BrainDrive Pro” for a fork, or “Official BrainDrive Hosting” for a service you run

---

## 8) Settings you’ll care about

- **Profile & Preferences** — name, theme (light/dark), defaults.  
- **AI Providers** — set your default model, add API keys, switch between local/API.  
- **Performance & History** — choose chat retention and resource options.

> The “why” behind our defaults ties back to the mission: make AI ownership easy while preserving real control.

---

## 9) Daily use best practices

- **Prompts:** Be specific about goals; break complex tasks into steps.  
- **Organization:** Name chats clearly; tag by project; archive older threads.  
- **Pages:** Use dedicated pages per context (writing, analysis, support).  
- **Backups:** Export page layouts and important conversations periodically.

Pro tip: If you’re a builder or entrepreneur, shape pages around your repeatable workflows, then productize them for others.

---

## 10) Troubleshooting (quick fixes)

- **Server won’t start** → Another app may be on the same port; change ports in your `.env` and restart.  
- **“Module not found”** → Re-install requirements; verify your environment is active.  
- **Frontend not updating** → Disable browser cache and ensure both servers are running.  
- **Plugin install fails** → Double-check the repo URL and review backend logs for details.

---

## 11) Community & next steps

- **Community forum:** Ask questions, share pages, request features, and follow weekly updates.  
- **Guiding principles:** Ownership, freedom, empowerment, sustainability—help us keep them central as you build.  
- **Mission:** Make it easy to build, control, and benefit from your own AI system—free from Big Tech restrictions.

---

## 12) Why this matters
Soon we’ll all rely on AI systems. Who owns those systems will define our future: **corporate AI = exploitation and lock-in; personal AI = freedom and empowerment.** BrainDrive exists to make personal AI ownership practical for everyone. **Become an owner—then build, control, and benefit from what you create.**

---

**Brand note:** Use the tagline exactly as **“Your AI. Your Rules.”** Keep messaging bold, straightforward, and empowering.  
**Visual note:** BrainDrive supports light/dark UI; follow accessible, high-contrast patterns when you customize themes.  
**Ecosystem note:** Owners, Builders, and Entrepreneurs each strengthen the community—and the marketplace ensures value flows to the people creating it.

*This guide is owner-focused. For developer setup, lifecycle APIs, and service bridges, see the technical docs when you’re ready to build.*
