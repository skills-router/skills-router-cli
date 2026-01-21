# Quick Start Guide

Get started with skills-router-cli in 5 minutes!

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g @skills/cli
```

### Option 2: Install from pip

```bash
pip install skills-router
```

### Option 3: Development Setup

```bash
# Clone the repository
git clone https://github.com/skills-router/skills-router-cli.git
cd skills-router-cli

# Install dependencies
npm install
pip install -r python/requirements.txt

# Build the project
npm run build

# Run directly
node dist/cli.js --help
```

## Your First Skill Installation

### Step 1: Find a Skill

You can:
- Use GitHub URLs directly
- Search online (search API coming soon)
- Browse popular skill repositories

### Step 2: Add a Skill

```bash
# Using full GitHub URL
skills-router add https://github.com/anthropics/skills/tree/main/skills

# Using short format
skills-router add anthropics/skills/skills

# Install to specific CLI
skills-router add https://github.com/owner/repo/tree/main/skill --cli claude
```

The CLI will:
1. Clone the repository
2. Find all skills (directories with `SKILL.md` files)
3. Ask you which skills to install (if multiple)
4. Ask you which CLI(s) to install to
5. Install the skills
6. Clean up temporary files

### Step 3: Verify Installation

```bash
skills-router list
```

You should see your installed skills listed!

### Step 4: Use Your Skills

Now your skills are available in your chosen AI CLI tool (Claude Code, Codex CLI, or Gemini CLI)!

## Basic Commands

```bash
# Add a skill
skills-router add <github-url-or-path> [--cli claude|codex|gemini] [--yes]

# List installed skills
skills-router list [--cli claude|codex|gemini]

# Remove a skill
skills-router remove <skill-name> [--cli claude|codex|gemini] [--yes]

# Search for skills (API coming soon)
skills-router search <keyword>
```

## Common Examples

### Example 1: Install to Claude Code

```bash
skills-router add https://github.com/anthropics/skills/tree/main/skills --cli claude
```

### Example 2: Install to Multiple CLIs

```bash
# When prompted, select multiple CLIs
skills-router add https://github.com/owner/repo/tree/main/skills

# Select: Claude Code, Codex CLI, Gemini CLI
```

### Example 3: Skip Confirmations (Automation)

```bash
skills-router add <url> --cli claude --yes
```

### Example 4: List Skills for Different CLIs

```bash
# Claude Code
skills-router list --cli claude

# Codex CLI
skills-router list --cli codex

# Gemini CLI
skills-router list --cli gemini
```

### Example 5: Remove a Skill

```bash
# With confirmation
skills-router remove my-skill

# Without confirmation
skills-router remove my-skill --yes

# From specific CLI
skills-router remove my-skill --cli claude
```

## Where Skills Are Stored

```bash
# Claude Code
~/.claude/skills/

# Codex CLI
~/.codex/skills/

# Gemini CLI
~/.gemini/skills/
```

## Troubleshooting

### "Command not found" error

After npm install, you might need to:

```bash
# Add npm global bin to PATH (if not already)
export PATH="$PATH:$(npm config get prefix)/bin"
```

Or restart your terminal.

### "No skills found in repository"

Make sure the repository contains:
- Directories with `SKILL.md` files
- Valid GitHub URL

### "Skill already exists"

Remove the existing skill first:

```bash
skills-router remove <skill-name>
```

Then install again.

### Search API errors

The search API is under development. Use GitHub URLs directly instead.

## Next Steps

- Read the [README.md](README.md) for detailed documentation
- Check [EXAMPLES.md](EXAMPLES.md) for more examples
- See [TESTING.md](TESTING.md) for testing guide

## Support

- Open an issue: https://github.com/skills-router/skills-router-cli/issues
- Read contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
