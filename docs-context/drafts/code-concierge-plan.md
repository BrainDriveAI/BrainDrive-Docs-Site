# BrainDrive Code Concierge

**Status:** Initial Planning
**Created:** January 9, 2025
**Updated:** January 9, 2025 (added Claude Code plugin option + monetization strategy)
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

*When this draft is ready to become actionable, create GitHub Issues for the work items and move or delete this file.*
