# skills-router-cli

A unified CLI tool to manage skills for different AI CLI tools (Claude Code, Codex CLI, Gemini CLI).

## Features

- 🔍 **Discover & Install**: Easily find and install skills from GitHub repositories
- 🎯 **Multi-CLI Support**: Install skills to Claude Code, Codex CLI, or Gemini CLI
- 📦 **Unified Management**: Single entry point for all your AI CLI skills
- 🔎 **Search**: Find skills using a built-in search API
- 📋 **List & Remove**: Manage your installed skills

## Installation

### Node.js (Global)

```bash
npm install -g @skills/cli
```

### Python

```bash
pip install skills-router
```

## Usage

### Add Skills

Add a skill from a GitHub repository:

```bash
# Using full GitHub URL
skills-router add https://github.com/anthropics/skills/tree/main/skills

# Using owner/repo/path format
skills-router add anthropics/skills/skills

# Specify target CLI
skills-router add https://github.com/owner/repo/tree/main/skill-path --cli claude
skills-router add owner/repo/path --cli codex
skills-router add owner/repo/path --cli gemini

# Skip confirmation
skills-router add https://github.com/owner/repo/tree/main/skill-path --yes
```

### Search Skills

Search for available skills:

```bash
skills-router search frida
skills-router search algorithmic-art
```

> **Note**: The search API endpoint (`https://www.skills-router.com/api/skills`) is currently under development. If you encounter API errors, please use the `add` command directly with GitHub URLs.

### List Installed Skills

List all installed skills for a specific CLI:

```bash
# List Claude Code skills (default)
skills-router list

# List skills for specific CLI
skills-router list --cli claude
skills-router list --cli codex
skills-router list --cli gemini
```

### Remove Skills

Remove an installed skill:

```bash
# Remove with confirmation
skills-router remove skill-name

# Remove from specific CLI
skills-router remove skill-name --cli claude

# Skip confirmation
skills-router remove skill-name --yes
```

## Supported CLIs

- **Claude Code** (`--cli claude`) - Skills installed to `~/.claude/skills/`
- **Codex CLI** (`--cli codex`) - Skills installed to `~/.codex/skills/`
- **Gemini CLI** (`--cli gemini`) - Skills installed to `~/.gemini/skills/`

## Architecture

skills-router-cli consists of two parts:

1. **TypeScript CLI** - Handles user interaction, command parsing, and UI
2. **Python Backend** - Handles git operations, file management, and skill installation

### Project Structure

```
skills-router-cli/
├── src/
│   ├── cli.ts                 # Main CLI entry point
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions (git, paths)
│   ├── python/                # Python bridge
│   └── commands/              # CLI commands
│       ├── add.ts
│       ├── search.ts
│       ├── list.ts
│       └── remove.ts
├── python/
│   ├── setup.py
│   └── skills_router/
│       ├── __init__.py
│       ├── core.py            # Core functionality
│       └── cli.py             # Python CLI entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- Python >= 3.8
- Git

### Setup

```bash
# Install Node dependencies
npm install

# Install Python dependencies
pip install -r python/requirements.txt
```

### Build

```bash
# Build TypeScript
npm run build

# Build Python package
cd python
python setup.py build
```

### Testing

```bash
# Run TypeScript CLI in development mode
npm run dev

# Run Python CLI
python3 -m skills_router.cli --help
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Roadmap

- [ ] Support for GitHub tags and commits
- [ ] Support for non-GitHub skill sources
- [ ] Configuration file support
- [ ] Skill update functionality
- [ ] More CLI targets (OpenAI, Anthropic, etc.)
