# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-21

### Added

- Initial release of skills-router-cli
- `add` command - Add skills from GitHub repositories
- `search` command - Search for skills using the skills-router API
- `list` command - List installed skills for a specific CLI
- `remove` command - Remove installed skills
- Multi-CLI support:
  - Claude Code
  - Codex CLI
  - Gemini CLI
- GitHub URL parsing and skill detection
- Interactive CLI selection
- Interactive skill selection for repositories with multiple skills
- TypeScript CLI implementation
- Python backend for git operations and file management
- Comprehensive documentation
- Installation via npm and pip

### Features

- Shallow git clone for faster repository downloads
- Automatic skill directory detection (SKILL.md file)
- Cross-platform support (Windows, macOS, Linux)
- Colored terminal output with progress indicators
- Confirmation prompts for destructive operations
- Support for both full GitHub URLs and short `owner/repo/path` format
- Automatic cleanup of temporary files

### Documentation

- README with installation and usage instructions
- EXAMPLES.md with detailed usage examples
- CONTRIBUTING.md with development guidelines
- In-code comments and JSDoc for TypeScript
