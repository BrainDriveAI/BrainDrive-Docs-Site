# Sources

This page lists the canonical inputs the Docs AI must read **first**, with scope, ownership, and authority.  
Use `/docs-context/manifest.json` as the machine-readable mirror.

> **Legend**
> - **type** = repo | site | spec | pdf | design | doc | dataset | policy | community | external  
> - **authority_order**: 1 = highest authority (tie-breaker)

---

## A) Code & API — *source of truth for behavior* (authority 1)

- **BrainDrive Core (README & API)**
  - type: repo
  - url: https://github.com/BrainDriveAI/BrainDrive-Core
  - scope: core runtime, endpoints, CLI flags, install
  - source_of_truth: repo
  - owner: @DJJones66
  - update_cadence: per release
  - authority_order: 1
  - tags: core, api, install

- **Plugin Template**
  - type: repo
  - url: https://github.com/BrainDriveAI/PluginTemplate
  - scope: boilerplate, lifecycle, installer/updater
  - source_of_truth: repo
  - owner: @DJJones66
  - authority_order: 1
  - tags: plugins, template

- **Service Bridge Examples (Index)**
  - type: doc
  - url: https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/SERVICE_BRIDGE_EXAMPLES.md
  - scope: links to API/Events/Theme/Settings/PageContext/PluginState example repos (currently on dev GitHub; moving to main)
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 2
  - tags: bridges, examples
  - note: Examples illustrate usage patterns; if anything conflicts with Core bridge contracts, **Core wins**.

- **Build & Scripts**
  - type: repo
  - url: https://github.com/DJJones66/BrainDriveScripts
  - scope: packaging/build (e.g., `build_archive.py`)
  - source_of_truth: repo
  - owner: @DJJones66
  - authority_order: 2
  - tags: tooling

---

## B) Product Docs — *concepts/how-tos/training* (authority 3)

- **Docs Site (Docusaurus)**
  - type: site
  - url: https://braindriveai.github.io/BrainDrive-Docs/
  - scope: concepts, how-tos, upgrade guides, What’s New
  - source_of_truth: docs
  - owner: @davewaring
  - update_cadence: weekly
  - authority_order: 3
  - tags: docs, training

---

## C) Strategy, Audience & Brand — *in this folder* (authority 4)

- **vision.md**
  - type: doc
  - path: /docs-context/vision.md
  - scope: what BrainDrive is, who it’s for
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 4

- **adam-carter.md**
  - type: doc
  - path: /docs-context/personas/adam-carter.md
  - scope: segments, reading level, **persona anchor**: `#persona-adam-carter`
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 4

- **technical-docs-style-guide.md**
  - type: doc
  - path: /docs-context/technical-docs-style-guide.md
  - scope: tone/voice, formatting, code style
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 4

- **doc-types.md**
  - type: doc
  - path: /docs-context/doc-types.md
  - scope: when to use Reference | Guide | How-to | Concept
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 4

- **glossary.csv**
  - type: dataset
  - path: /docs-context/glossary.csv
  - scope: term, definition, canonical spelling
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 4

---

## D) Specs & Design (authority 2)

- **System / Architecture Overview**
  - type: doc
  - path: /docs-context/project-overviews/BrainDrive-System.md
  - scope: high-level architecture, interfaces, flows
  - source_of_truth: spec
  - owner: @davewaring
  - authority_order: 2
  - tags: architecture, spec

---

## E) Authoring Templates & Prompts — *in this folder* (authority 4)

- **templates/**
  - type: doc
  - path: /docs-context/templates/
  - scope: how-to.md, concept.md, reference.md, troubleshooting.md, release-notes.md
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 4

- **prompts/**
  - type: doc
  - path: /docs-context/prompts/
  - scope: system + job prompts (create-how-to, update-reference, troubleshoot)
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 4

---

## F) Process & Change Signals — *in this folder* (authority 2)

- **update-policy.md**
  - type: policy
  - path: /docs-context/update-policy.md
  - scope: triggers, SLAs, review flow
  - source_of_truth: policy
  - owner: @davewaring
  - authority_order: 2

- **manifest.json**
  - type: doc
  - path: /docs-context/manifest.json
  - scope: machine-readable sources + rules
  - source_of_truth: docs
  - owner: @davewaring
  - authority_order: 2

---

## G) Community & Support (authority 5)

- **Forum**
  - type: community
  - url: https://community.braindrive.ai
  - scope: FAQs, canonical answers to mirror into docs
  - owner: @davewaring
  - authority_order: 5

---

## H) Legal & Policy (authority 2)

- **License / Security / Governance**
  - type: policy
  - path: /LICENSE, /SECURITY.md, /GOVERNANCE.md
  - scope: license (MIT), security contact/process, decision-making
  - source_of_truth: policy
  - owner: @davewaring
  - authority_order: 2

---

## Authority Order (tie-breaker)

1. **Code & API contracts** (repos) — owner: @DJJones66  
2. **Specs/Policy** (PDFs, LICENSE/SECURITY/GOVERNANCE) — owners: @DJJones66 / @davewaring  
3. **Product docs** (Docusaurus concepts/how-tos) — owner: @davewaring  
4. **Strategy/Audience/Brand + Templates/Prompts** — owner: @davewaring  
5. **Community** — owner: @davewaring
