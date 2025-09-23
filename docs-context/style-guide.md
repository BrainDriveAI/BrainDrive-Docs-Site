# BrainDrive Documentation Style Guide

## Overview
This style guide ensures consistency across all BrainDrive documentation. Follow these standards when creating or updating any documentation—whether in GitHub repos or the Docusaurus site.

## Tone and Voice

### Primary Voice Characteristics
- **Clear and direct**: Use simple, actionable language
- **Helpful and supportive**: Assume users want to succeed
- **Technically accurate**: Precision over casual language
- **Respectful**: Avoid assumptions about user skill level

### Writing Style
- **Active voice preferred**: "Configure the plugin" not "The plugin should be configured"
- **Present tense**: "BrainDrive creates" not "BrainDrive will create"
- **Second person**: Address the user as "you"
- **Conversational but professional**: Friendly without being overly casual

### Words to Avoid
- "Simply" or "just" (dismissive of difficulty)
- "Obviously" or "clearly" (assumes knowledge)
- "Please" in instructions (unnecessary politeness)
- Absolute terms like "never" or "always" (unless technically accurate)

## Content Structure

### Page Organization
1. **Title**: Clear, specific, action-oriented
2. **Description**: One sentence summary in frontmatter
3. **Prerequisites** (if applicable): What users need before starting
4. **Main content**: Structured with clear headings
5. **Next steps** (if applicable): Where to go from here
6. **Open questions** (if any): What needs clarification

### Headings
- Use sentence case: "Getting started" not "Getting Started"
- Be specific: "Configure authentication" not "Setup"
- Use parallel structure in lists
- Maximum 4 heading levels (H1-H4)

### Paragraphs
- One main idea per paragraph
- Start with the most important information
- Keep paragraphs under 4 sentences
- Use connecting words to improve flow

## Formatting Standards

### Code and Commands

#### Inline Code
- Use backticks for: file names, commands, variables, short code snippets
- Examples: `config.yml`, `braindrive start`, `API_KEY`

#### Code Blocks
```bash
# Always include language identifier
# Add comments for complex commands
braindrive install --config /path/to/config.yml
```

#### File Paths
- Use forward slashes: `/docs-context/style-guide.md`
- Relative paths when possible: `./templates/how-to.md`
- Absolute paths only when necessary

### Lists

#### Unordered Lists
- Use hyphens (`-`) for consistency
- Parallel structure: all items same format
- End items with periods if they're complete sentences
- No periods for short phrases

#### Ordered Lists
1. Use for sequential steps
2. Start each item with action verb
3. Include expected outcomes when helpful
4. Break complex steps into sub-steps

### Links
- **Internal links**: Use relative paths
- **External links**: Include domain in link text when helpful
- **Link text**: Descriptive, not "click here" or "read more"
- **Example**: [BrainDrive installation guide](./install-guide.md)

### Emphasis
- **Bold** for UI elements, important terms, warnings
- *Italic* for emphasis, new concepts, variable names in text
- `Code formatting` for technical terms, file names, commands

## Technical Writing Guidelines

### API Documentation
- Always include example requests and responses
- Show both success and error cases
- Include required vs optional parameters
- Use realistic example data

### Code Examples
- Test all code examples before publishing
- Include necessary imports/setup
- Show complete, working examples
- Add comments for complex logic

### Error Messages
- Quote exact error text in `code formatting`
- Provide context about when error occurs
- Include specific resolution steps
- Link to troubleshooting when applicable

## Terminology

### Consistent Terms
- Use the canonical terms from `glossary.csv`
- BrainDrive (not Brain Drive, braindrive, or brain-drive)
- Plugin (not add-on, extension, or module)
- Owner, Builder, Admin (our standard user types)

### Technical Accuracy
- Verify version-specific information
- Include version compatibility in frontmatter
- Update examples when APIs change
- Mark deprecated features clearly

## Quality Standards

### Before Publishing
- [ ] All code examples tested
- [ ] Links verified (internal and external)
- [ ] Frontmatter complete and accurate
- [ ] Spelling and grammar checked
- [ ] Follows template structure
- [ ] Reviewed by designated owner

### Maintenance
- Review pages every 90 days (check `last_verified` date)
- Update when underlying features change
- Archive outdated content rather than leaving incorrect info
- Keep examples current with latest stable version

## Templates Usage

### When to Use Each Template
- **how-to.md**: Task-oriented, step-by-step instructions
- **concept.md**: Explanation of what something is and why it matters
- **reference.md**: Complete, searchable information (APIs, configs)
- **troubleshooting.md**: Problem-solution format
- **release-notes.md**: Version-specific changes and impacts

### Template Compliance
- Always start from the appropriate template
- Fill in all required sections
- Replace all placeholder text
- Include frontmatter with all required fields

## Accessibility

### Writing for All Users
- Define technical terms on first use
- Provide multiple ways to accomplish tasks
- Include alternative text for images
- Use clear, descriptive headings for screen readers

### Visual Design
- Use consistent formatting for similar content types
- Ensure adequate contrast in any visual elements
- Structure content with proper heading hierarchy
- Keep line length readable (under 80 characters when possible)

## Review Process

### Self-Review Checklist
1. Does this help the user accomplish their goal?
2. Is the information accurate and up-to-date?
3. Would someone unfamiliar with BrainDrive understand this?
4. Are all links working and relevant?
5. Does the content follow this style guide?

### Peer Review
- Technical accuracy review by area expert
- Style and clarity review by documentation team
- User testing for complex procedures
- Final approval by designated owner

---

**Questions about this style guide?** Open an issue with the `docs-needed` label or contact the documentation team.
