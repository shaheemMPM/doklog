# Scripts

This directory contains helper scripts for development and release workflows.

## Available Scripts

### `release.sh`

**Usage:** `pnpm release <version>`

One-command release script that handles the entire release process:
- Updates package.json version
- Runs tests and linting
- Builds TypeScript and binaries
- Creates git tag
- Pushes to GitHub

**Example:**
```bash
pnpm release 1.0.0
```

### `pre-push.sh`

**Usage:** `./scripts/pre-push.sh` (automatically run by Husky)

Quality checks that run before every git push:
- Runs all tests
- Runs linting checks
- Builds TypeScript to ensure no errors

This is automatically triggered by the Husky pre-push hook, so you don't need to run it manually.

## Git Hooks (Husky)

The project uses [Husky](https://typicode.github.io/husky/) to manage git hooks:

- **pre-push**: Runs `scripts/pre-push.sh` before every push to ensure code quality
- Hooks are automatically installed when running `pnpm install`
- All contributors get the same hooks

### Bypassing Hooks (Not Recommended)

If you need to bypass the pre-push hook (not recommended):
```bash
git push --no-verify
```
