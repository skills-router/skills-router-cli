# Contributing to Skills Router CLI

Thank you for your interest in contributing to Skills Router CLI! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Python >= 3.8
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/skills-router-cli.git
   cd skills-router-cli
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

4. Install Python dependencies:
   ```bash
   pip install -r python/requirements.txt
   ```

5. Build the project:
   ```bash
   npm run build
   ```

## Project Structure

```
skills-router-cli/
├── src/                    # TypeScript source code
│   ├── cli.ts              # Main CLI entry point
│   ├── commands/           # CLI command implementations
│   ├── utils/              # Utility functions
│   └── python/             # Python bridge
├── python/                 # Python source code
│   └── skills_router/     # Python package
│       ├── core.py         # Core functionality
│       └── cli.py          # Python CLI
├── dist/                   # Compiled JavaScript (generated)
└── package.json            # Node.js package config
```

## Development Workflow

### Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes to the source code

3. Test your changes:
   ```bash
   # Run TypeScript CLI in development mode
   npm run dev

   # Build the project
   npm run build

   # Test the compiled CLI
   node dist/cli.js --help
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/my-feature
   ```

6. Create a pull request

## Code Style

### TypeScript

- Use TypeScript strict mode
- Follow ESLint rules (if configured)
- Add JSDoc comments for public APIs
- Use meaningful variable and function names

### Python

- Follow PEP 8 style guidelines
- Add docstrings to functions and classes
- Use type hints where appropriate

## Adding New Features

### Adding a New CLI Command

1. Create a new command file in `src/commands/`:
   ```typescript
   // src/commands/mycommand.ts
   import { Command } from 'commander';

   export const myCommand = new Command('mycommand')
     .description('My new command')
     .action(() => {
       console.log('Hello from my command!');
     });
   ```

2. Register the command in `src/cli.ts`:
   ```typescript
   import { myCommand } from './commands/mycommand';

   program.addCommand(myCommand);
   ```

### Adding Python Functionality

1. Add the function to `python/skills_router/core.py`:
   ```python
   def my_function(self, param: str) -> Dict:
       # Implementation
       return {'success': True, 'data': result}
   ```

2. Add a handler in the `main()` function:
   ```python
   elif action == 'myaction':
       result = manager.my_function(params.get('param'))
   ```

3. Call it from TypeScript if needed:
   ```typescript
   const result = await runPythonScript('myaction', { param: 'value' });
   ```

## Testing

### Manual Testing

Test the CLI with various scenarios:

```bash
# Test add command
node dist/cli.js add <github-url>

# Test search command
node dist/cli.js search <keyword>

# Test list command
node dist/cli.js list

# Test remove command
node dist/cli.js remove <skill-name>
```

### Automated Testing

We welcome contributions to add automated tests. Tests should be placed in appropriate test directories.

## Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Environment information (OS, Node.js version, Python version)
- Error messages or stack traces

## Feature Requests

We welcome feature requests! When creating a feature request, please:

- Provide a clear description of the feature
- Explain the use case and why it would be useful
- Consider potential implementation details

## Pull Request Guidelines

- Keep PRs focused and minimal
- Add clear descriptions of changes
- Reference related issues
- Ensure all tests pass
- Update documentation as needed

## Code of Conduct

Be respectful and inclusive. We strive to maintain a welcoming environment for all contributors.

## Questions?

Feel free to open an issue for any questions about contributing or the project in general.
