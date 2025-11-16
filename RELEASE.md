# Release Process

This document explains how to create a new release of doklog.

## Creating a Release

Use the automated release script to handle everything in one command:

```bash
pnpm release 1.0.0
```

This script will:
1. Update `package.json` version
2. Run all tests
3. Run linting checks
4. Build TypeScript
5. Create binaries for all platforms (macOS, Linux, Windows)
6. Commit the version change
7. Create and push a git tag
8. Push everything to GitHub

After the script completes, you'll see instructions for uploading binaries to GitHub releases.

---

## Creating the GitHub Release

After running `pnpm release`, follow these steps to publish on GitHub:

1. **Go to GitHub Releases**
   - Navigate to `https://github.com/shaheemMPM/doklog/releases/new`
   - Or: GitHub repo → Releases → "Create a new release"

2. **Select the tag**
   - Choose the tag that was just created (e.g., `v1.0.0`)

3. **Add release title**
   - Use format: `v1.0.0` or `doklog v1.0.0`

4. **Upload binaries**
   - Drag and drop or select these files from `bin/` folder:
     - `doklog-macos`
     - `doklog-linux`
     - `doklog-win.exe`

5. **Add release notes** (optional)
   - Describe what's new, fixed, or changed
   - List any breaking changes

6. **Publish the release**
   - Click "Publish release"
   - Your `install.sh` script will now work!

## Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **Major version** (X.0.0): Breaking changes
- **Minor version** (1.X.0): New features, backwards compatible
- **Patch version** (1.0.X): Bug fixes, backwards compatible

Examples:
- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature (e.g., add SQS support)
- `v2.0.0` - Breaking change (e.g., change CLI arguments)

---

## Troubleshooting

**Release script fails:**
- Ensure all tests pass: `pnpm test:run`
- Ensure build works: `pnpm build`
- Check for uncommitted changes: `git status`

**Tag already exists:**
- Delete the tag locally: `git tag -d v1.0.0`
- Delete the tag on GitHub: `git push origin :refs/tags/v1.0.0`
- Or simply use the next version number

**Binary build fails:**
- Ensure dependencies are installed: `pnpm install`
- Try building manually: `pnpm package`
- Check for disk space issues
