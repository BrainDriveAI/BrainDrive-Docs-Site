# BrainDrive Code Concierge

**Status:** Initial Planning
**Created:** January 9, 2025
**Updated:** January 9, 2025 (added multi-interface strategy, plugin UX analysis, monetization)
**Owner:** Navaneeth Krishnan
**Priority:** Post-launch (not required for initial release)

## Concept

An AI-powered development assistant specifically designed for building on BrainDrive. Unlike general-purpose tools (Replit, Lovable, Bolt, Claude Code) that must handle the entire universe of tech stacks, databases, and deployment scenarios, Code Concierge is laser-focused on the BrainDrive ecosystem.

**Core value proposition:** Because BrainDrive is a constrained environment with a defined tech stack, plugin architecture, and deployment model, we can build an AI assistant that's dramatically more effective than general tools—enabling non-developers to build real applications.

### What Code Concierge Knows

- Plugin architecture and lifecycle
- Hook usage patterns and anti-patterns
- Class-based component structure
- Service bridges and their contracts
- BrainDrive-specific deployment (no "how do I deploy?" confusion)
- The quirks and conventions of the BrainDrive codebase

### Target User: The Technical Tinkerer

**Not for:** Experienced developers who just want raw code output

**For:** Technically inclined people who:
- Are willing to tinker and experiment
- Need context and explanation alongside code
- Find traditional coding tools intimidating
- Want to build real applications without deep programming knowledge

This matches David Waring's experience: "Claude Code was the first one where I'm like, I can actually build shit with this."

---

## Strategic Advantage

### Why This Should Work Better Than General Tools

| General Tools (Replit, Lovable, etc.) | BrainDrive Code Concierge |
|---------------------------------------|---------------------------|
| Must handle any database | BrainDrive's defined data layer |
| Any frontend framework | React + BrainDrive conventions |
| Infinite deployment options | BrainDrive handles deployment |
| Unknown hosting environments | Known plugin hosting model |
| Arbitrary project structures | Plugin template structure |
| Generic code generation | BrainDrive-specific patterns |

**Key insight:** "They have the entire universe to deal with... where BrainDrive is very constrained—it's just building on top of this tech stack."

### Problems Already Solved

Things that frustrate non-developers with general tools that BrainDrive eliminates:

- **Deployment confusion** — Plugins just work once created
- **Hosting decisions** — Handled by BrainDrive instance
- **Architecture choices** — Plugin template provides structure
- **Integration complexity** — Service bridges abstract it away

---

## Inspiration: What Claude Code Gets Right

David's experience with Claude Code highlighted key success factors for non-developers:

### 1. Human-Like Interaction
- Provides context, not just code
- Explains the "why" alongside the "what"
- Has personality (more approachable for non-coders)

### 2. Handles the Setup Pain
- GitHub authentication
- API key configuration
- Environment setup
- Repository initialization

Claude Code "just does it now"—removing barriers that were "a fucking nightmare" before.

### 3. End-to-End Workflow
- Not just code generation
- Handles the entire development loop
- From concept to working application

---

## MVP Scope

### Goal
Enable people like David (technically inclined non-developers) to build simple BrainDrive applications through conversation.

### Success Criteria
- Non-developer can create a basic plugin from scratch
- Understands and correctly uses BrainDrive hooks
- Generates code that follows plugin conventions
- Provides clear explanations of what it's doing and why

### MVP Features
1. **Plugin scaffolding** — Create new plugins from description
2. **Code generation** — Generate plugin components, hooks, UI
3. **BrainDrive RAG** — Deep knowledge of documentation, APIs, patterns
4. **Error guidance** — Explain and fix common mistakes
5. **Conversational flow** — Natural back-and-forth development

### Not in MVP
- Full IDE integration
- Automated testing
- Deployment automation
- Multi-plugin orchestration

---

## Technical Approach Options

### Option A: RAG-Enhanced Existing Model

"A RAG with Replit" — Navaneeth's initial framing

| Aspect | Details |
|--------|---------|
| Base | Claude/GPT-4 via API |
| Enhancement | RAG over BrainDrive docs, code, templates |
| Interface | Chat-based web or desktop app |
| Complexity | Medium |

**Pros:**
- Leverages best-in-class models
- Faster time to MVP
- Navaneeth's ML background well-suited

**Cons:**
- API costs at scale
- Dependent on external models

### Option B: Fine-Tuned Model

| Aspect | Details |
|--------|---------|
| Base | Open model (Llama, Mistral, Qwen) |
| Enhancement | Fine-tuned on BrainDrive codebase |
| Interface | Local or hosted |
| Complexity | High |

**Pros:**
- No per-request API costs
- Full control over model behavior
- Could run locally

**Cons:**
- Significant training investment
- May underperform vs. RAG + frontier model

### Option C: Hybrid

| Aspect | Details |
|--------|---------|
| Base | Frontier model API (Claude Opus/Sonnet) |
| Enhancement | RAG + specialized prompting |
| Routing | Small local model for classification |
| Interface | Web app initially, desktop later |

**Pros:**
- Best quality for code generation
- RAG keeps it BrainDrive-aware
- Can evolve toward local models over time

### Option D: Claude Code Plugin (Recommended Fast-Track)

Instead of building from scratch, package BrainDrive expertise as a Claude Code plugin. This leverages the tool David found most effective.

| Aspect | Details |
|--------|---------|
| Base | Claude Code (uses Opus 4.5) |
| Enhancement | Skills + MCP server + subagents |
| Interface | CLI (Claude Code) |
| Complexity | Low |

**Plugin Structure:**
```
braindrive-concierge/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── plugin-development/SKILL.md
│   ├── service-bridges/SKILL.md
│   ├── hooks-guide/SKILL.md
│   └── braindrive-conventions/SKILL.md
├── agents/
│   ├── plugin-creator.md
│   ├── debugger.md
│   └── code-reviewer.md
├── commands/
│   ├── new-plugin.md          # /bd:new-plugin
│   ├── add-hook.md            # /bd:add-hook
│   └── check.md               # /bd:check
└── .mcp.json                  # Connect to BrainDrive services
```

**Pros:**
- Dramatically reduced scope (days to MVP, not weeks)
- Leverages Opus 4.5 — the model that "actually works"
- No infrastructure to build (Claude Code handles AI, context, file ops)
- Skills = knowledge, MCP = tools, already proven pattern
- Users install plugin, immediately productive

**Cons:**
- Requires users to have Claude Code
- Less control over UX
- Not accessible to non-CLI users

**Hybrid Path:**
1. **Phase 1:** Claude Code plugin (quick win for developers)
2. **Phase 2:** Web-based version for broader audience
3. **Phase 3:** Shared knowledge base between both

---

## Multi-Interface Strategy: Build Once, Deploy Twice

The Claude Code plugin is the **fastest path to MVP** because it eliminates infrastructure work. More importantly, the components you build are **directly reusable** for a web interface later.

### Component Reusability

| Component Built for Plugin | Reusable in Web App? | How |
|---------------------------|---------------------|-----|
| Skills (markdown knowledge) | ✓ | Become system prompts |
| Few-shot examples | ✓ | Same examples in prompts |
| RAG content (docs, code) | ✓ | Same vector store |
| MCP server backend | ✓ | Same API endpoints |
| Validation logic (`/bd:check`) | ✓ | Same rules, different UI |
| Command logic | ✓ | Become buttons/actions |

**Result:** 80%+ of the work transfers directly to the web app.

### What You DON'T Build Twice

- BrainDrive knowledge encoding
- Plugin conventions and patterns
- Service bridge documentation
- Error handling and gotchas
- Code generation prompts

The Claude Code plugin forces you to **get the knowledge right first** — which is the hard part. The web UI is then just a different way to access that same knowledge.

### Architecture

```
┌─────────────────────────────────────────────────┐
│           Shared Knowledge Base                 │
│  (Skills, docs, prompts, few-shot examples)     │
└──────────────┬──────────────────┬───────────────┘
               │                  │
               ▼                  ▼
    ┌──────────────────┐  ┌──────────────────┐
    │  Claude Code     │  │   Web Interface  │
    │  Plugin (CLI)    │  │   (Browser)      │
    │                  │  │                  │
    │  For developers  │  │  For everyone    │
    └──────────────────┘  └──────────────────┘
```

### Recommended Timeline

| Phase | Deliverable | Timeline | Users |
|-------|-------------|----------|-------|
| **Phase 1** | Claude Code plugin | Week 1-2 | Developers with CLI |
| **Phase 2** | Ship + gather feedback | Week 2-3 | Early adopters |
| **Phase 3** | Web app (reuses 80%+) | Week 3+ | Everyone |

### Web App Options (Phase 3)

Once the plugin knowledge base is built, several web interface options become easy:

**Option A: Claude.ai Project (Zero infrastructure)**
- Upload skills as project knowledge
- Share project link with users
- Quick win, but limited features

**Option B: Custom Web App (Full control)**
- Build React frontend at `braindrive.ai/code-concierge`
- Your API server calls Claude API with same prompts
- Returns generated code as downloadable zip or GitHub repo
- Full-featured experience with buttons for common actions

**Option C: Embedded in BrainDrive (Native integration)**
- Build Code Concierge directly into BrainDrive UI
- "Build a plugin" wizard powered by same knowledge base
- Tightest integration, most seamless UX

---

## Plugin Development UX Analysis

Based on the [Plugin Developer Quick Start Guide](https://docs.braindrive.ai/core/plugin-development/quickstart), here's how Code Concierge eliminates friction.

### Current Pain Points

| Pain Point | What It Involves |
|------------|------------------|
| **8+ rename locations** | Folder, package.json, lifecycle_manager.py, src files, webpack.config.js, output folder |
| **Path configuration** | Finding BrainDrive backend path, updating webpack output |
| **Naming conflicts** | Must keep plugin and module names distinct (critical rule) |
| **Service Bridges learning** | 6 different bridges, each with specific use cases |
| **Common gotchas** | 10+ documented ways things break |
| **Publishing workflow** | Git setup, releases, marketplace posting |

### Slash Commands That Eliminate Pain

#### `/bd:new-plugin` — One Command Setup

Instead of manual cloning + 8 renames:

```
User: /bd:new-plugin

Claude: What would you like to name your plugin?

User: Weather Dashboard

Claude: Creating "Weather Dashboard" plugin...
        ✓ Cloned BrainDrive-PluginTemplate
        ✓ Renamed folder to WeatherDashboard
        ✓ Updated package.json (name: "weather-dashboard")
        ✓ Updated lifecycle_manager.py (slug, name, component IDs)
        ✓ Renamed src/PluginTemplate.tsx → WeatherDashboardModule.tsx
        ✓ Updated class name and exports
        ✓ Updated webpack.config.js (federation name, exposed component)
        ✓ Set output path to [detected BrainDrive path]/backend/plugins/shared/

        Your plugin is ready at ./WeatherDashboard
        Run `npm install` then describe what you want to build.
```

Automatically handles the "Critical Naming Rule" — plugin = "Weather Dashboard", module = "WeatherDashboardModule"

#### `/bd:add-feature` — Describe What You Want

```
User: /bd:add-feature I want to show weather for a city the user types in

Claude: [Loads service-bridges skill]

        I'll add a city weather lookup. This needs:
        1. Input field for city name
        2. API call via services.api
        3. Theme-aware display for weather data

        [Generates component using correct BrainDrive patterns]
        [Uses services.api.post() properly]
        [Handles loading and error states]
        [Applies current theme via services.theme]

        Added to src/WeatherDashboardModule.tsx. Run `npm run build` to test.
```

#### `/bd:check` — Catch Problems Before They Bite

```
User: /bd:check

Claude: Checking WeatherDashboard plugin...

        ✓ package.json name matches folder
        ✓ lifecycle_manager.py slug matches
        ✓ Plugin and module names are distinct
        ✓ webpack.config.js federation name correct
        ⚠ dist/remoteEntry.js not found — run `npm run build`
        ✓ Component exports match webpack exposed modules
        ✓ No CSS import path issues detected

        1 issue to fix before testing.
```

#### `/bd:publish` — Streamlined Publishing

```
User: /bd:publish

Claude: Preparing WeatherDashboard v1.0.0 for publication...

        ✓ Repository: github.com/yourname/WeatherDashboard
        ✓ Pushed to main branch
        ✓ Created release v1.0.0

        Install URL: https://github.com/yourname/WeatherDashboard

        Marketplace post ready to copy:
        ─────────────────────────────────
        ## Weather Dashboard
        A BrainDrive plugin that displays weather for any city.
        **Install:** https://github.com/yourname/WeatherDashboard
        ─────────────────────────────────

        Post at community.braindrive.ai/c/the-marketplace
```

### Skills for Service Bridges

The `service-bridges` skill knows all 6 bridges and recommends the right one:

```
User: I want to save user preferences in my plugin

Claude: [Loads service-bridges skill]

        For persisting user preferences, use the Settings bridge:

        // Save a setting
        await this.props.services.settings.setSetting('preferredUnit', 'celsius');

        // Retrieve it later
        const unit = await this.props.services.settings.getSetting('preferredUnit');

        This persists across sessions. For temporary state that resets
        on page refresh, use pluginState instead.
```

| Bridge | When Skill Recommends It |
|--------|-------------------------|
| API | "call the backend", "fetch data", "send request" |
| Event | "communicate between plugins", "notify", "broadcast" |
| Theme | "dark mode", "light mode", "colors", "styling" |
| Settings | "save preferences", "remember", "persist" |
| Page Context | "current page", "where am I", "page info" |
| Plugin State | "temporary data", "component state", "session" |

### MCP Server Connections

| Connection | Capability |
|------------|------------|
| Running BrainDrive instance | Live testing, see plugin in Page Builder |
| Plugin Manager API | Install/uninstall during development |
| Backend logs | Surface errors directly in Claude's context |
| Docs server | Real-time RAG over latest documentation |

### Before/After Comparison

**Before (current quickstart):**
1. Read guide (~10 min)
2. Clone template
3. Manually rename 8+ locations (error-prone)
4. Configure webpack path
5. Learn Service Bridges API
6. Build, hit gotchas, debug
7. Manually set up GitHub, releases, marketplace

**After (with Code Concierge):**
1. `/bd:new-plugin` → ready in seconds
2. "I want it to do X" → working code
3. `/bd:check` → catch issues before they happen
4. `/bd:publish` → live in marketplace

**Time to first working plugin:** 30+ minutes → 5-10 minutes

### Quickstart Guide → Skill Mapping

The existing documentation becomes skill content:

| Guide Section | Plugin Component |
|---------------|------------------|
| Phase 1-2: Setup | `/bd:new-plugin` command |
| Phase 3: Build cycle | Skills know webpack, paths, dev workflow |
| Phase 4: Service Bridges | `service-bridges` skill |
| Phase 5: Code Examples | Few-shot examples embedded in skills |
| Phase 6: Publish | `/bd:publish` command |
| Common Gotchas table | `/bd:check` validation rules |

---

## Implementation Phases

### Phase 1: RAG Foundation
- Index all BrainDrive documentation
- Index plugin template and example plugins
- Index service bridge code and contracts
- Build retrieval pipeline

### Phase 2: Conversational Interface
- Chat-based web UI
- Context management (conversation history)
- Code display and syntax highlighting
- Copy/apply code snippets

### Phase 3: BrainDrive-Specific Prompting
- System prompts encoding plugin conventions
- Few-shot examples for common patterns
- Hook usage guidelines
- Error message interpretation

### Phase 4: Developer Experience Polish
- File/folder awareness within plugin structure
- Integration with plugin template
- Basic debugging assistance
- "Explain this error" capability

### Phase 5: Advanced Features (Post-MVP)
- IDE extension (VS Code)
- Direct file editing (with user approval)
- Plugin testing guidance
- Performance recommendations

---

## Knowledge Base Requirements

### Documentation to Index
- `docs-core/` — All core documentation
- `docs-plugins/` — All plugin documentation
- `docs-template/` — Plugin template docs
- `docs-core/reference/` — API reference (complete)
- `docs-core/troubleshooting/` — Common issues

### Code to Index
- Plugin template source code
- Example plugin implementations
- Service bridge implementations
- Core BrainDrive patterns

### Metadata to Capture
- Hook names and correct usage
- Service bridge method signatures
- Plugin manifest schema
- UI component patterns

---

## Open Questions

1. **Hosting model** — Web app vs. desktop app vs. Claude Code plugin vs. all three?
2. **Model selection** — Claude vs. GPT-4 vs. open models for MVP?
3. **Authentication** — Tie to BrainDrive account or standalone?
4. **Integration depth** — Just generate code or also apply changes?

---

## Monetization Strategy

### Recommended Approach: Freemium Funnel to Managed Hosting

The plugin/tool itself drives adoption; connected services generate revenue.

```
Free Plugin → Builds on BrainDrive → Needs hosting → Managed Hosting $$$
```

This mirrors successful models:
- **Vercel** — Free framework (Next.js), paid hosting
- **Supabase** — Free client, paid infrastructure
- **GitHub** — Free tool, paid enterprise/actions

### Tiered Access Model

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | $0 | Plugin/skills, code generation, local development |
| **Pro** | $X/month | Deploy to BrainDrive Cloud, plugin analytics, priority support |
| **Enterprise** | Custom | Team features, private plugin registry, SLA |

### What's Gated Behind Payment

| Feature | Free | Paid | Rationale |
|---------|------|------|-----------|
| Skills (knowledge) | ✓ | ✓ | Hard to enforce, drives adoption |
| Code generation | ✓ | ✓ | Core value, drives adoption |
| Local development | ✓ | ✓ | No cost to us |
| MCP server (basic) | ✓ | ✓ | Connects to BrainDrive docs |
| MCP server (premium) | | ✓ | Live testing, deployment, analytics |
| One-click deploy | | ✓ | Requires managed hosting |
| Plugin marketplace listing | | ✓ | Visibility/distribution value |
| Advanced debugging | | ✓ | Connects to running instance |

### Why This Works

1. **Skills are hard to gate** — They're markdown files on disk. Trying to lock them down creates friction and bad UX.

2. **Services are easy to gate** — MCP server requires authentication. Deployment requires infrastructure. These naturally require accounts.

3. **Managed hosting is the real product** — Code Concierge is an acquisition funnel. Users build something → need to deploy it → pay for hosting.

4. **Network effects** — Free tier creates more plugins → more BrainDrive value → more users → more paid conversions.

### Revenue Projections (Placeholder)

| Metric | Conservative | Optimistic |
|--------|-------------|------------|
| Free users | 1,000 | 10,000 |
| Pro conversion | 5% | 10% |
| Pro revenue/month | $500 | $10,000 |
| Managed hosting upsell | 20% of Pro | 30% of Pro |

*Actual pricing and projections TBD based on managed hosting costs and market research.*

---

## Dependencies

- [ ] Complete documentation (mostly done)
- [ ] Plugin template finalized
- [ ] API reference complete (done Jan 6, 2025)
- [ ] Example plugins to learn from

---

## Next Steps

1. Navaneeth to evaluate RAG approaches
2. Prototype basic retrieval over BrainDrive docs
3. Test code generation quality with BrainDrive context
4. Design conversational UX for plugin building
5. Define MVP feature set based on prototype learnings

---

## References

- **Claude Code** — Primary UX inspiration
- **Cursor** — IDE integration patterns
- **Replit/Lovable/Bolt** — What to improve upon
- **BrainDrive Plugin Template** — Target structure for generated code

---

## Appendix A: Claude Code Architecture

This appendix explains how Claude Code's components work together. Understanding this architecture is essential for building the Code Concierge plugin.

### Core Components

| Component | Purpose | Analogy |
|-----------|---------|---------|
| **Skills** | Teach Claude *how* to do things | Instruction manuals |
| **MCP Servers** | Give Claude *tools* to do things | API connections |
| **Plugins** | Bundle components for distribution | App packages |
| **Subagents** | Isolated contexts for specialized tasks | Dedicated assistants |

### How They Fit Together

```
┌─────────────────────────────────┐
│      Main Claude Instance       │
└───────────────┬─────────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
   ┌────────┐       ┌───────────┐
   │ Skills │       │ Subagents │
   │ (how)  │       │ (isolated)│
   └────────┘       └─────┬─────┘
                          │
                          ▼
                   ┌────────────┐
                   │MCP Servers │
                   │  (tools)   │
                   └─────┬──────┘
                         ▼
                  External APIs
```

### Skills: Knowledge and Guidance

**What they are**: Markdown files (`.claude/skills/`) that teach Claude specialized knowledge or techniques.

**How they work**:
- Stored as `SKILL.md` files in `~/.claude/skills/` or `.claude/skills/`
- Claude loads skill descriptions at startup
- When a request matches a skill's description, Claude asks permission then loads the full content
- Can restrict which tools Claude uses while the skill is active
- Can run in a forked sub-agent context with isolated history

**Example**: A "code-review" skill teaches Claude your team's standards. When you say "Review this code," Claude automatically applies it.

**For Code Concierge**: Skills will encode BrainDrive plugin patterns, service bridge usage, hook guidelines, and conventions.

### MCP Servers: External Tools and Data Sources

**What they are**: Connections to external tools, APIs, and data sources via the Model Context Protocol.

**How they work**:
- Configured with `claude mcp add` or in `.mcp.json` files
- Three transport options:
  - **HTTP**: Remote cloud services
  - **SSE**: Server-Sent Events (streaming)
  - **stdio**: Local processes
- Claude calls tools exposed by MCP servers just like built-in tools
- Can also expose resources (for @ mentions) and prompts (for / commands)

**Example**: A GitHub MCP server lets Claude read issues, review PRs, create repositories without manual copying.

**For Code Concierge**: MCP server will connect to running BrainDrive instance, plugin manager, backend logs, and docs.

### Plugins: Packaged Extensions

**What they are**: Directories containing a manifest plus organized subdirectories for all components.

**Structure**:
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Manifest with metadata
├── commands/                # Slash commands
├── agents/                  # Subagents
├── skills/                  # Agent skills
├── hooks/                   # Event handlers
└── .mcp.json               # MCP server configs
```

**How they work**:
- Can contain any combination of commands, agents, skills, hooks, MCP servers
- Distributed through marketplaces, installed with `/plugin install`
- Slash commands get namespaced (e.g., `/my-plugin:hello`)
- When enabled, all plugin components become available

**Example**: A "security-plugin" bundles a security review skill, security-focused subagent, GitHub MCP server, and `/security-review` command.

**For Code Concierge**: The plugin bundles all BrainDrive skills, the `/bd:*` commands, debugging subagents, and MCP connections.

### Subagents: Specialized Contexts

**What they are**: Specialized AI assistants with their own context windows, tool restrictions, and system prompts.

**How they work**:
- Defined as markdown files in `.claude/agents/` or `~/.claude/agents/`
- Claude automatically delegates matching tasks to them
- Each operates independently with fresh context
- Can have their own tool permissions, models, and skills

**Built-in subagents**:
- **Explore**: Fast, read-only searches using Haiku model
- **General-purpose**: Complex multi-step operations with full tool access
- **Plan**: Research assistant for planning mode

**Example**: A "code-reviewer" subagent has read-only file access. Claude delegates code review to it, keeping the main context clean.

**For Code Concierge**: Subagents for plugin creation, debugging, and code review — each with appropriate tool restrictions.

### When to Use Each Component

| Component | Use When | Code Concierge Example |
|-----------|----------|------------------------|
| **Skills** | Teach Claude *how* to do something | Plugin conventions, service bridge patterns |
| **MCP Servers** | Connect to external tools/data | BrainDrive instance, plugin manager |
| **Plugins** | Package multiple components | The entire Code Concierge distribution |
| **Subagents** | Need isolated contexts | Plugin creator, debugger agents |

### Example Flow: `/bd:new-plugin`

When a user runs `/bd:new-plugin`:

```
1. User: /bd:new-plugin

2. Claude Code recognizes the slash command
   └── Defined in braindrive-concierge/commands/new-plugin.md

3. Command invokes plugin-creator subagent
   └── Defined in braindrive-concierge/agents/plugin-creator.md
   └── Has file write permissions, git access

4. Subagent loads plugin-development skill
   └── Defined in braindrive-concierge/skills/plugin-development/SKILL.md
   └── Contains naming rules, file structure, conventions

5. Subagent asks for plugin name, then:
   └── Clones BrainDrive-PluginTemplate
   └── Renames all 8+ locations correctly
   └── Updates webpack.config.js
   └── Follows skill guidelines throughout

6. Results returned to main conversation
   └── User sees clean summary
   └── Main context stays focused
```

### Configuration Scopes

Both skills and MCP servers follow a scope hierarchy:

| Scope | Location | Who Has Access |
|-------|----------|----------------|
| **Local** | `.claude.json` | Your machine, current project |
| **Project** | `.claude/` or `.mcp.json` | Team via git |
| **User** | `~/.claude/` | Your machine, all projects |
| **Enterprise** | System directories | Organization-wide via IT |

Higher scopes can be overridden by lower ones when needed.

### Key Takeaways

1. **Skills teach, MCP servers enable** — Skills provide knowledge, MCP servers provide tool access
2. **Plugins package everything** — For distribution and team sharing
3. **Subagents isolate** — Each handles tasks in their own context
4. **Claude coordinates** — The AI decides what to use based on your request
5. **Build once, use everywhere** — Skills and MCP configs work in both CLI and (future) web interfaces

---

*When this draft is ready to become actionable, create GitHub Issues for the work items and move or delete this file.*
