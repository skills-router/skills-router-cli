# Skills Router CLI - Examples

This document provides detailed examples of how to use the skills-router CLI.

## Table of Contents

- [Adding Skills](#adding-skills)
- [Searching Skills](#searching-skills)
- [Managing Skills](#managing-skills)

## Adding Skills

### Example 1: Add a skill from a GitHub directory

When you provide a GitHub directory URL containing multiple skills, skills-router will detect all available skills and let you choose which ones to install:

```bash
skills-router add https://github.com/anthropics/skills/tree/main/skills
```

Expected output:
```
✓ Repository cloned successfully
✓ Found 5 skill(s)

? Select skills to install:
❯ ◉ algorithmic-art
  ◉ image-processing
  ◉ code-analysis
  ◉ data-visualization
  ◉ text-processing

? Select target CLI(s):
❯ ◉ Claude Code
  ◯ Codex CLI
  ◯ Gemini CLI

✓ Installing: algorithmic-art
  ✓ Installed to claude

✓ Installing: image-processing
  ✓ Installed to claude

✓ All operations completed successfully!
```

### Example 2: Add a specific skill

When you provide a specific skill URL, skills-router will install only that skill:

```bash
skills-router add https://github.com/anthropics/skills/blob/main/skills/algorithmic-art
```

Expected output:
```
✓ Repository cloned successfully
✓ Found 1 skill(s)
✓ Installing: algorithmic-art
  ✓ Installed to claude

✓ All operations completed successfully!
```

### Example 3: Add skill to specific CLI

You can specify which CLI to install the skill to using the `--cli` flag:

```bash
# Install to Claude Code
skills-router add https://github.com/owner/repo/tree/main/skill --cli claude

# Install to Codex CLI
skills-router add owner/repo/skill-path --cli codex

# Install to Gemini CLI
skills-router add owner/repo/skill-path --cli gemini
```

### Example 4: Use short repository format

You can use the short `owner/repo/path` format instead of full URLs:

```bash
skills-router add anthropics/skills/skills/algorithmic-art
```

### Example 5: Skip confirmation prompts

Use the `--yes` flag to skip all confirmation prompts:

```bash
skills-router add https://github.com/owner/repo/tree/main/skill --cli claude --yes
```

### Example 6: Add to multiple CLIs

When prompted, you can select multiple target CLIs:

```bash
skills-router add https://github.com/owner/repo/tree/main/skill

? Select target CLI(s):
❯ ◉ Claude Code
  ◉ Codex CLI
  ◯ Gemini CLI
```

The skill will be installed to both Claude Code and Codex CLI.

## Searching Skills

### Example 1: Basic search

Search for skills using a keyword:

```bash
skills-router search frida
```

Expected output:
```
✓ Found 3 skill(s)

Search Results: frida

1. frida-tracer
   Trace and monitor Frida instrumentation
   Repository: https://github.com/owner/frida-tracer
   Author: username | ⭐ 245

2. frida-dynamic-loader
   Dynamic loader for Frida scripts
   Repository: https://github.com/owner/frida-dynamic-loader
   Author: username | ⭐ 189

3. frida-network-analyzer
   Network analysis tool using Frida
   Repository: https://github.com/owner/frida-network-analyzer
   Author: username | ⭐ 156

Page 1 of 1
```

### Example 2: Search for algorithm-related skills

```bash
skills-router search algorithmic-art
```

## Managing Skills

### Example 1: List installed skills

List all installed skills for a CLI (defaults to Claude Code):

```bash
skills-router list
```

Expected output:
```
✓ Skills loaded for claude

Installed Skills (claude):

  1. algorithmic-art
     /Users/username/.claude/skills/algorithmic-art

  2. image-processing
     /Users/username/.claude/skills/image-processing

  3. code-analysis
     /Users/username/.claude/skills/code-analysis

Total: 3 skill(s)
```

### Example 2: List skills for specific CLI

```bash
# List Claude Code skills
skills-router list --cli claude

# List Codex CLI skills
skills-router list --cli codex

# List Gemini CLI skills
skills-router list --cli gemini
```

### Example 3: Remove a skill

Remove a skill with confirmation prompt:

```bash
skills-router remove algorithmic-art
```

Expected output:
```
? Remove skill "algorithmic-art" from claude? (y/N) y
✓ Removing skill "algorithmic-art" from claude...
✓ Skill removed successfully

✓ Skill removed successfully!
```

### Example 4: Remove skill from specific CLI

```bash
skills-router remove algorithmic-art --cli claude
skills-router remove image-processing --cli codex
```

### Example 5: Remove skill without confirmation

Use the `--yes` flag to skip the confirmation prompt:

```bash
skills-router remove algorithmic-art --yes
```

## Common Workflows

### Workflow 1: Install skills to all CLIs

```bash
# Add skill and select all CLIs when prompted
skills-router add https://github.com/owner/repo/tree/main/skill

? Select target CLI(s):
❯ ◉ Claude Code
  ◉ Codex CLI
  ◉ Gemini CLI
```

### Workflow 2: Find and install a skill

```bash
# Step 1: Search for the skill
skills-router search frida

# Step 2: Add the skill from the repository URL found in search results
skills-router add https://github.com/owner/frida-tracer/tree/main/skill

# Step 3: Verify installation
skills-router list
```

### Workflow 3: Bulk install skills

```bash
# Add from a repository with multiple skills
skills-router add https://github.com/anthropics/skills/tree/main/skills

# Select all desired skills when prompted
? Select skills to install:
❯ ◉ algorithmic-art
  ◉ image-processing
  ◉ code-analysis

# Select all target CLIs
? Select target CLI(s):
❯ ◉ Claude Code
  ◉ Codex CLI
```

### Workflow 4: Clean up unused skills

```bash
# List all installed skills
skills-router list --cli claude

# Remove unused skills
skills-router remove unused-skill-1 --yes
skills-router remove unused-skill-2 --yes
```

## Troubleshooting

### Issue: "No valid skill found at specified path"

**Cause**: The specified path doesn't contain a valid `SKILL.md` file.

**Solution**: Verify the URL points to a valid skill directory containing a `SKILL.md` file.

### Issue: "Skill already exists"

**Cause**: A skill with the same name is already installed.

**Solution**: Remove the existing skill first, or use a different name.

### Issue: "Failed to clone repository"

**Cause**: Network issues or invalid repository URL.

**Solution**:
- Check your internet connection
- Verify the GitHub URL is correct
- Ensure the repository is public

## Tips

1. **Use short formats** for frequently used repos:
   ```bash
   skills-router add anthropics/skills/skills/algorithmic-art
   ```

2. **Skip confirmations** for automation:
   ```bash
   skills-router add <path> --cli claude --yes
   ```

3. **Search before adding** to find the best skills:
   ```bash
   skills-router search <keyword>
   ```

4. **List skills regularly** to keep track of your installations:
   ```bash
   skills-router list --cli claude
   ```

5. **Remove unused skills** to keep your environment clean:
   ```bash
   skills-router remove <skill-name> --yes
   ```
