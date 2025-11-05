# BrainDrive Ollama Plugin

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/BrainDriveAI/BrainDrive-Ollama-Plugin)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/BrainDriveAI/BrainDrive-Ollama-Plugin/blob/main/LICENSE)
[![BrainDrive](https://img.shields.io/badge/BrainDrive-Plugin-purple.svg)](https://github.com/BrainDriveAI/BrainDrive)

The default [BrainDrive](https://github.com/BrainDriveAI/BrainDrive-Core) plugin that delivers Ollama-specific experiences including server lifecycle management, model installation, and a prompt chat interface.

![Ollama Settings Page](https://raw.githubusercontent.com/BrainDriveAI/BrainDrive-Core/refs/heads/main/images/braindrive-ollama-plugin.png)

## Features
- Ollama server registration, health checks, and connection testing
- Model discovery and install/remove flows with streaming progress
- Prompt chat UI with streaming toggle, conversation history, and event-driven model selection
- Module federation exposes `ComponentOllamaServer` and `AIPromptChat` for flexible host integration

## Getting Started
```bash
cd PluginBuild/BrainDrive-Ollama-Plugin
npm install
npm run build
```
Build artifacts are emitted to `dist/remoteEntry.js` for consumption by the BrainDrive host.

## Development
- `npm start` serves the plugin on port 9006 for local development
- Webpack Module Federation library name: `BrainDriveOllama`
- Exposed modules:
  - `ComponentOllamaServer`
  - `AIPromptChat`

## Lifecycle Manager
See `lifecycle_manager.py` for installation hooks, module metadata, and settings definitions registered with BrainDrive.

## License
[MIT License](https://github.com/BrainDriveAI/BrainDrive-Ollama-Plugin/blob/main/LICENSE) **Your AI. Your Rules.**

## Resources

[Owner's Manual](https://docs.braindrive.ai/core/how-to/use-braindrive) - Full overview of how to install, setup, and use your BrainDrive.  
[Community](https://community.braindrive.ai/) - For support, and to connect with other BrainDrive Owners.  
[Roadmap](https://docs.braindrive.ai/core/ROADMAP) - BrainDrive's 5 Phase vision for building a superior, user-owned alternative to Big Tech AI systems.   
[Contributing](https://docs.braindrive.ai/core/CONTRIBUTING) - How to get involved. 

Thank you for joining us on the journey away from Big Tech extraction, and towards individual freedom and empowerment.

