# Testing Guide

This document provides instructions for testing the skills-router CLI tool.

## Prerequisites

Before testing, ensure you have:

- Node.js >= 18.0.0 installed
- Python >= 3.8 installed
- Git installed
- All dependencies installed:
  ```bash
  npm install
  pip install -r python/requirements.txt
  ```

## Building the Project

```bash
npm run build
```

This will compile the TypeScript source to the `dist/` directory.

## Running Tests

### Test 1: CLI Help

Verify the CLI is installed and working:

```bash
node dist/cli.js --help
```

**Expected Output**:
- Shows usage information
- Lists all available commands: add, search, list, remove

### Test 2: List Skills

Check installed skills (should be empty initially):

```bash
node dist/cli.js list
node dist/cli.js list --cli claude
node dist/cli.js list --cli codex
node dist/cli.js list --cli gemini
```

**Expected Output**:
- Shows "No skills installed"
- Total: 0 skill(s)

### Test 3: Add a Skill

**Important**: You need a valid GitHub repository containing skills.

#### Option A: Use a real repository

```bash
# Add from GitHub directory
node dist/cli.js add https://github.com/anthropics/skills/tree/main/skills

# Or use short format
node dist/cli.js add anthropics/skills/skills
```

**Expected Flow**:
1. Clones the repository
2. Scans for skills (directories with SKILL.md files)
3. Prompts to select skills (if multiple found)
4. Prompts to select target CLI(s)
5. Installs skills to selected CLI directories
6. Cleans up temporary files

#### Option B: Test with a mock repository

Create a test repository structure:

```bash
mkdir -p /tmp/test-skills/my-skill
cat > /tmp/test-skills/my-skill/SKILL.md << 'EOF'
# Test Skill

This is a test skill.
EOF

cd /tmp
git init test-repo
cd test-repo
cp -r /tmp/test-skills/* .
git add .
git commit -m "Initial commit"
```

Then test:

```bash
node dist/cli.js add /tmp/test-repo/my-skill --cli claude --yes
```

### Test 4: Verify Installation

Check that the skill was installed:

```bash
node dist/cli.js list
```

**Expected Output**:
- Shows the installed skill(s)
- Displays skill name and path

**Manual Verification**:

```bash
ls -la ~/.claude/skills/
# Should show the installed skill directory
```

### Test 5: Remove a Skill

Remove an installed skill:

```bash
# With confirmation
node dist/cli.js remove my-skill

# Without confirmation
node dist/cli.js remove my-skill --yes

# From specific CLI
node dist/cli.js remove my-skill --cli claude
```

**Expected Output**:
- Confirms removal
- Skill directory is deleted

### Test 6: Search Skills

```bash
node dist/cli.js search frida
```

**Expected Behavior**:
- Note: The search API is currently under development
- You may receive a 400 error or timeout
- This is expected behavior

### Test 7: Python CLI (Standalone)

Test the Python CLI directly:

```bash
python3 python/skills_router/cli.py --help
python3 python/skills_router/cli.py list
```

### Test 8: Python Backend Directly

Test Python backend functions directly:

```bash
# List skills
python3 python/skills_router/core.py list '{"cliType": "claude"}'

# Test error handling
python3 python/skills_router/core.py invalid-action '{}'
```

**Expected Output**:
- Returns JSON response
- Includes success status and data/error message

## Common Issues and Solutions

### Issue: "Python script not found"

**Cause**: Incorrect path resolution after build

**Solution**:
```bash
# Rebuild the project
npm run build

# Verify path
ls -la dist/python/
```

### Issue: "No valid skill found at specified path"

**Cause**: The directory doesn't contain a SKILL.md file

**Solution**:
- Verify the repository contains skills with SKILL.md files
- Check the URL path is correct

### Issue: "Failed to clone repository"

**Cause**: Network issues or invalid repository URL

**Solution**:
- Check your internet connection
- Verify the GitHub URL is correct
- Ensure the repository is public

### Issue: "Skill already exists"

**Cause**: A skill with the same name is already installed

**Solution**:
- Remove the existing skill first
- Or choose a different skill from the repository

### Issue: API Error 400 on search

**Cause**: Search API is not yet implemented

**Solution**:
- This is expected behavior
- Use the `add` command directly with GitHub URLs instead

## Cleanup

Remove test installations:

```bash
# Remove Claude Code skills
rm -rf ~/.claude/skills/*

# Remove Codex CLI skills
rm -rf ~/.codex/skills/*

# Remove Gemini CLI skills
rm -rf ~/.gemini/skills/*

# Clean temporary files
rm -rf /tmp/skills-router
```

## Running Automated Tests (Future)

When automated tests are added:

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "add command"
```

## Performance Testing

Test with large repositories:

```bash
# Time the clone operation
time node dist/cli.js add https://github.com/owner/large-repo

# Test multiple skills
node dist/cli.js add https://github.com/owner/repo-with-many-skills
```

## Security Testing

Verify that:

1. Skills are installed to correct directories only
2. No arbitrary code execution occurs during installation
3. Temporary files are cleaned up after use
4. Malicious URLs are handled safely

## Integration Testing

Test with actual AI CLI tools:

1. **Claude Code**: Install a skill and verify it appears in Claude Code
2. **Codex CLI**: Install a skill and verify it appears in Codex CLI
3. **Gemini CLI**: Install a skill and verify it appears in Gemini CLI

## Reporting Test Results

When reporting issues, include:

- Command used
- Full error message
- Environment information:
  ```bash
  node --version
  python3 --version
  git --version
  npm list @skills/cli
  ```
- Expected vs actual behavior
