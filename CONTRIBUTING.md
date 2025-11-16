# Contributing to doklog

Thank you for your interest in contributing to doklog! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm (package manager)
- AWS account (for testing)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/shaheemMPM/doklog.git
   cd doklog
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run in development mode**
   ```bash
   pnpm dev
   ```

4. **Build the project**
   ```bash
   pnpm build
   ```

## Development Workflow

### Project Structure

```
src/
├── data/          # Static data (AWS regions)
├── prompts/       # Interactive user prompts
├── screens/       # Application screens (Lambda, SQS)
├── services/      # AWS service integrations
└── utils/         # Utility functions (credentials, banner, env)
```

### Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

**Before committing, run:**
```bash
# Check for issues
pnpm check

# Auto-fix issues
pnpm fix

# Format code
pnpm format
```

**Code conventions:**
- Use arrow functions instead of function declarations
- Use tabs for indentation
- Use double quotes for strings
- Add TypeScript types for all functions
- Avoid `any` types - use proper type definitions

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add TypeScript types
   - Follow existing code style
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Run in development mode
   pnpm dev

   # Build and test binaries
   pnpm package:macos  # or package:linux, package:win
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with..."
   ```

   **Commit message format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes clearly
   - Reference any related issues

## Pull Request Guidelines

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Code has been formatted with Biome (`pnpm fix`)
- [ ] Changes have been tested locally
- [ ] Documentation has been updated (if applicable)
- [ ] Commit messages follow the format described above
- [ ] PR description clearly explains the changes

### PR Review Process

1. Maintainers will review your PR
2. You may be asked to make changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in the release notes

## Testing

This project uses [Vitest](https://vitest.dev/) for testing.

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests

Tests are located next to the files they test with a `.test.ts` extension.

**Example structure:**
```
src/
├── utils/
│   ├── env.ts
│   └── env.test.ts
├── services/
│   ├── logDisplayService.ts
│   └── logDisplayService.test.ts
```

**Test guidelines:**
- Write tests for utility functions and services
- Use descriptive test names
- Test edge cases and error conditions
- Mock external dependencies (AWS SDK, file system when needed)
- Aim for good coverage of critical paths

**Example test:**
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFunction';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('');
    expect(myFunction(null)).toBe(null);
  });
});
```

## Building Binaries

```bash
# Build for all platforms
pnpm package

# Build for specific platform
pnpm package:macos
pnpm package:linux
pnpm package:win
```

Binaries will be output to the `bin/` directory.

## Adding New Features

### Adding a New AWS Service

1. Create a new service file in `src/services/`
2. Create a new screen in `src/screens/`
3. Add the service to the service selector in `src/prompts/serviceSelector.ts`
4. Update the main routing in `src/index.ts`

**Example structure:**
```typescript
// src/services/yourService.ts
export const listYourResources = async (region: string) => {
  // AWS SDK calls
};

// src/screens/yourScreen.ts
export const showYourScreen = async (region: string) => {
  // Screen logic
};
```

### Adding New Prompts

Create prompt files in `src/prompts/` using `@inquirer/prompts`:

```typescript
import { search } from '@inquirer/prompts';

export const selectYourThing = async (items: Item[]): Promise<string> => {
  const selected = await search({
    message: 'Select an item:',
    source: async (input) => {
      // Filter and return options
    },
  });
  return selected;
};
```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages or logs
- Screenshots (if applicable)

### Feature Requests

When requesting features, please describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered
- Additional context

## Releasing

For maintainers: See [RELEASE.md](RELEASE.md) for instructions on creating new releases.

The release process is automated via GitHub Actions - simply push a version tag and binaries will be built and released automatically.

## Questions?

- Open an issue with the `question` label
- Check existing issues for similar questions

## License

By contributing to doklog, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Future CONTRIBUTORS.md file

Thank you for contributing to doklog! 🎉
