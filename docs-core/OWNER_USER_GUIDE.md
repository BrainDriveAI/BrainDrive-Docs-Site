---
id: OWNER_USER_GUIDE
title: BrainDrive Owner’s Manual
sidebar_label: Use
---

BrainDrive is your open-source, self-hosted ChatGPT alternative that's easy to use and build on.

The 4 pillars of BrainDrive:

1. Ownership — You control your AI system, data, and created value
2. Freedom — Fully customizable and portable, with no Big Tech restrictions
3. Empowerment — Simple to use and build on, with supportive community
4. Sustainability — Lean core with a thriving plugin ecosystem and sustainable revenue model

Think WordPress for AI: Install BrainDrive-Core, then add or develop plugins to rapidly deploy AI-powered features.

Every BrainDrive owner receives:

1. A web‑based Chat interface for interacting with AI models

![BrainDrive chat interface with plugin manager and page builder panes](/static/img/screenshots/AI-Chat-Interface.png)

2. A built‑in Plugin Manager to install/manage extensions

 ![BrainDrive Plugin Manager Screenshot](/static/img/screenshots/plugin-manager.png)

3. A Page Builder for creating custom UIs without code

  ![BrainDrive Page Builder Screenshot](/static/img/screenshots/Page-Builder.png)
  
 4. Example plugins, tutorials, and developer resources

Host your BrainDrive locally on your computer, or on the cloud host of your choice. No Big-Tech lockin. 

### Your BrainDrive has a modular, plugin based architecture comprised of:

#### Core System (BrainDrive‑Core repository)

Provides the primary UI (chat, page builder, etc.) and backend services (user management, plugin APIs, conversation storage, etc.)

* **Frontend:** React + TypeScript web application
* **Backend:** Python FastAPI server with a SQLite database (default)

#### Plugin Ecosystem (Seperate repositories)

* Each plugin is a separate module (its own repository) that can be added dynamically.
* Uses Webpack Module Federation to load frontend plugins at runtime.
* A standardized Lifecycle Manager (Python) to integrate backend/installation logic.
* Plugins communicate with the core through well‑defined Service Bridges.
* Decoupled design allows customizing/extending BrainDrive without modifying core; update core/plugins independently.

## Quick Start Installation

**Note**: A one-click installer is planned for v1.0. For now, follow the developer-friendly [install guide here](https://braindriveai.github.io/BrainDrive-Docs/core/INSTALL).

## Setting Up Your First AI Model

BrainDrive supports both local and API-based AI providers, giving you complete flexibility over your AI experience.

### Option A: Local Models via BrainDrive's Ollama Plugin

For complete privacy, run models locally using Ollama or similar providers. BrainDrive comes with an Ollama Plugin as a default, which you can choose to use or easily delete from your BrainDrive. 

To use the Ollama Plugin to run local AI models:

1. Install Ollama from Ollama.com
3. Go to BrainDrive Settings & Install Your Preferred Model(s):

![BrainDrive Ollama Settings Page](/static/img/screenshots/ollama-settings-screebshot.png)

4. Chat Locally — All conversations stay on your machine:

![chatting with an Ollama model in BrainDrive](/static/img/screenshots/choosing-a-model.png)

### Option B: API-Based Models via BrainDrive's OpenRouter Plugin:

For those that want the speed and power of hosted models, BrainDrive's OpenRouter plugin offers the ability to serve hundreds of models via their API. The OpenRouter plugin comes with your BrainDrive by default, and can be easily removed for those that do not want it. 

To use OpenRouter models in your BrainDrive:

1. Signup at OpenRouter.com
2. Generate an OpenRouter API Key
![OpenRouter API key generation](/static/img/screenshots/openrouter-api-keys-page.png)
3. Add in Settings → AI Providers 
   * Enter your API key  
 ![Enter your API key](/static/img/screenshots/adding-openrouter-api-key-to-braindrive.png)
4. Now your models will show in the model dropdown on your AI Chat Page

### Option C: Build Your Own Model Serving Plugin for the provider of your choice. 

* Use the BrainDrive Ollama plugin as a template for building another local model serving plugin for the provider of your choice. 
* Use the BrainDrive OpenRouter plugin as a template for building another API model serving plugin for the provider of your choice. 

## Building Your First Custom Page

The **Page Builder** is where BrainDrive's modularity shines. Create task-specific workspaces that match your workflow.

### Creating a Research Page

1. **Navigate to Studio** → New Page  
2. **Name your page** (e.g., "Research Workspace")  
3. **Add Components**:  
   * Drag a **Chat** component and configure with research prompts  
   * Add a **Notes** component for capturing insights  
   * Include any plugin components you've installed  
4. **Arrange and Resize** components to fit your workflow  
5. **Save** your layout

*\[Screenshot placeholder: Page Builder with research workspace layout\]*

### Page Management

* **Export/Import** layouts as JSON for backup or sharing  
* **Responsive Design** — pages adapt to desktop, tablet, and mobile  
* **Real-Time Preview** — see changes immediately  
* **Version Control** — layouts are saved automatically

### Page Ideas for Different Workflows

* **Writing Studio**: Chat \+ grammar tools \+ research components  
* **Data Analysis**: Multiple model chat \+ visualization components  
* **Client Work**: Custom prompts \+ project tracking \+ billing tools  
* **Learning**: Chat \+ note-taking \+ progress tracking components

---

## Installing and Managing Plugins

BrainDrive's plugin system is designed for safety and simplicity. All plugins are **user-scoped**, meaning each user controls their own plugin versions independently.

### Installing Plugins

*\[Screenshot placeholder: Plugin Manager install dialog with GitHub URL field\]*

1. **Find a Plugin**: Browse community recommendations or GitHub  
2. **Get the URL**: Copy the plugin's GitHub repository URL  
3. **Install**: Plugin Manager → Install Plugin → Paste URL → Confirm  
4. **Use Components**: New components appear immediately in the Page Builder

### Plugin Management

**Enable/Disable**: Turn plugins on/off without uninstalling **Update**: Get latest features when plugin authors release updates **Uninstall**: Completely remove plugin files and data

### Plugin Safety

* **Hot-swap**: Install/uninstall without restarting BrainDrive  
* **Error Boundaries**: Plugin failures won't crash your system  
* **Plugin Repair**: Fix broken plugins with one click  
* **Isolated State**: Each plugin manages its own data

### Recommended Starter Plugins

Install these to experience BrainDrive's extensibility:

* **Plugin Template** — Learn plugin development basics  
* **Ollama Integration** — Connect to local models  
* **Enhanced Chat** — Advanced conversation features  
* **Data Visualizer** — Charts and graphs from AI responses

---

## Essential Settings and Configuration

### Profile and Preferences

*\[Screenshot placeholder: Settings panel showing profile and theme options\]*

* **Display Name**: How you appear in the system  
* **Theme**: Light/dark mode (affects all plugins)  
* **Default Language**: For AI interactions  
* **Conversation Settings**: History retention, auto-save frequency

### AI Provider Configuration

* **Default Model**: System-wide AI model preference  
* **API Keys**: Secure storage for external AI services  
* **Model Parameters**: Temperature, max tokens, system prompts  
* **Usage Tracking**: Monitor API costs and usage

### Performance and Storage

* **Database Settings**: SQLite location and backup frequency  
* **Plugin Storage**: How plugins store their data  
* **Cache Management**: Clear cached responses and temporary files  
* **Export Options**: Backup conversations and configurations

---

## Daily Use Best Practices

### Effective Prompting

* **Be Specific**: Clear goals get better results  
* **Break Down Complex Tasks**: Use step-by-step instructions  
* **Use Context**: Reference previous conversations when relevant  
* **Experiment**: Try different models for different tasks

### Organization Strategies

* **Name Conversations**: Use descriptive titles for easy finding  
* **Tag by Project**: Organize conversations with consistent tags  
* **Archive Old Threads**: Keep your workspace clean  
* **Export Important Results**: Save key insights outside the system

### Workflow Optimization

* **Create Dedicated Pages**: One page per major task or project  
* **Use Multiple Models**: Compare responses across providers  
* **Leverage Plugins**: Extend functionality instead of working around limitations  
* **Regular Backups**: Export page layouts and critical conversations

### Performance Tips

* **Local vs API**: Choose based on privacy needs and performance requirements  
* **Component Placement**: Organize page layouts for efficient workflows  
* **Plugin Updates**: Keep plugins current for best performance and features  
* **Resource Monitoring**: Watch system resources if running large local models

---

## Backup and Data Management

### What to Back Up

**Essential Data**:

* Page layouts (export as JSON)  
* Important conversations (export function)  
* Plugin configurations  
* AI provider settings  
* Custom prompts and templates

**Database Backup**: The SQLite database contains all your data. Back up the entire `backend/` directory regularly.

### Export Options

*\[Screenshot placeholder: Export dialog showing various backup options\]*

* **Individual Conversations**: Export specific threads as text or JSON  
* **Page Layouts**: Save custom interfaces for sharing or backup  
* **Settings**: Export configuration for easy restoration  
* **Plugin Data**: Each plugin manages its own backup options

### Migration Planning

BrainDrive is designed to be portable:

* **Database Migration**: Move your SQLite database to new installations  
* **Plugin Portability**: Reinstall plugins from the same GitHub URLs  
* **Configuration Transfer**: Settings exports work across installations  
* **No Vendor Lock-in**: All data remains in open, accessible formats

---

## Troubleshooting Common Issues

### **Installation Problems**

**Port Conflicts**:

\# Backend won't start \- port 8005 in use  
\# Edit backend/.env to change port, restart server  
APP\_PORT=8006

**Module Not Found**:

\# Ensure conda environment is activated  
conda activate BrainDriveDev  
pip install \--upgrade pip  
pip install \-r requirements.txt

### **Runtime Issues**

**Frontend Not Updating**:

* Disable browser cache in developer tools  
* Ensure both backend and frontend servers are running  
* Check browser console for error messages

**Plugin Installation Fails**:

* Verify GitHub URL is correct and accessible  
* Check that the repository has releases/builds  
* Review backend logs for detailed error messages

**Database Errors**:

* Verify `.env` database settings  
* Ensure app has write permissions to database directory  
* Check available disk space

### **Performance Issues**

**Slow Response Times**:

* Check available system resources (RAM, CPU)  
* Consider switching from local to API models  
* Reduce conversation history length in settings

**Page Load Issues**:

* Clear plugin cache in settings  
* Disable problematic plugins to isolate issues  
* Restart both backend and frontend servers

---

## **Community and Ecosystem**

### **Getting Help and Support**

**Primary Resources**:

* **Community Forum**: [community.braindrive.ai](https://community.braindrive.ai/) — Questions, help, ideas, weekly updates  
* **GitHub Issues**: Report bugs and request features  
* **Documentation**: Complete guides and API references  
* **Plugin Community**: Share and discover new plugins

### **Contributing to the Ecosystem**

**As a BrainDrive Owner**:

* Share your page layouts and workflows  
* Report bugs and suggest improvements  
* Help new owners in the community forum  
* Write guides for your specific use cases

**Growing into a Builder**:

* Start with the Plugin Template  
* Follow the Plugin Developer Quickstart  
* Contribute to existing plugins  
* Create plugins for your own needs

**Becoming an Entrepreneur**:

* Package your plugins for others  
* Offer custom BrainDrive implementations  
* Provide hosting and support services  
* Build businesses around the BrainDrive ecosystem

### **Brand Guidelines**

You're free to build on BrainDrive and monetize your work:

**Acceptable**:

* ✅ "NeuronWorks — Built on BrainDrive"  
* ✅ "Custom AI Solutions powered by BrainDrive"  
* ✅ Your own branding with attribution

**Not Acceptable**:

* ❌ "BrainDrive Pro" (implies official product)  
* ❌ "Official BrainDrive Hosting" (unless you're officially affiliated)  
* ❌ Using BrainDrive logos without permission

---

## **Understanding BrainDrive's Mission**

### **Why Personal AI Ownership Matters**

The choice between corporate AI and personal AI defines our future:

**Corporate AI** \= Data extraction, lock-ins, shifting terms, constrained capabilities **Personal AI** \= Privacy, freedom, ownership of value, unlimited customization

BrainDrive exists to make personal AI ownership practical for everyone.

### **The Four Pillars in Practice**

1. **Ownership** — You control the system, data, and innovations  
2. **Freedom** — MIT license, modular architecture, no vendor lock-ins  
3. **Empowerment** — Clear documentation, supportive community, rapid development  
4. **Sustainability** — Lean core, thriving ecosystem, value flows to creators

### **Long-Term Vision**

BrainDrive aims for a world where:

* Everyone owns their AI system instead of being a user of Big Tech AI  
* Innovation happens at the edges through owners and builders  
* Value flows to creators and communities, not monopolistic platforms  
* Open ecosystems outcompete walled gardens on speed, trust, and capability

---

## **Next Steps and Advanced Usage**

### **Immediate Next Steps**

1. **Complete Setup**: Ensure BrainDrive runs smoothly on your system  
2. **Install Core Plugins**: Add essential functionality for your workflow  
3. **Create Your First Custom Page**: Build a workspace that matches your needs  
4. **Join the Community**: Connect with other owners and builders  
5. **Plan Your Backups**: Establish regular backup routines

### **Growing Your Skills**

**Week 1-2**: Master basic usage patterns

* Chat effectively with different AI models  
* Create and organize multiple pages  
* Install and configure plugins

**Month 1**: Advanced customization

* Build complex multi-component pages  
* Experiment with local vs API models  
* Optimize performance for your use cases

**Month 2+**: Community engagement

* Share your best practices and workflows  
* Help new owners get started  
* Consider building your first plugin

### **Expanding Your BrainDrive**

**Technical Growth**:

* Learn plugin development basics  
* Contribute to existing plugins  
* Set up production deployments

**Business Applications**:

* Package solutions for clients  
* Offer BrainDrive consulting services  
* Build products on the BrainDrive platform

**Community Leadership**:

* Mentor new owners  
* Write documentation and guides  
* Participate in project governance

---

## **Conclusion**

BrainDrive gives you complete control over your AI experience — no corporate gatekeepers, no data extraction, no artificial limitations. You own the system, the data, and the value you create.

**Your journey starts now**:

* Own your AI infrastructure  
* Control your data and workflows  
* Benefit from the value you create  
* Build the tools you need  
* Share your success with the community

Welcome to the future of personal AI ownership.

**Your AI. Your Rules.**

---

*This guide covers BrainDrive v0.6.x+. For the latest updates and features, visit the [documentation site](https://braindriveai.github.io/BrainDrive-Docs/) and [community forum](https://community.braindrive.ai/).*

**Questions?** The BrainDrive community is here to help. Join us at [community.braindrive.ai](https://community.braindrive.ai/) to connect with other owners, builders, and entrepreneurs.

