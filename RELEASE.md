# Release Process

This document explains how to create a new release of doklog.

## Automated Release via GitHub Actions

The project uses GitHub Actions to automatically build binaries and create releases whenever you push a version tag.

### Creating a New Release

1. **Update the version in package.json**
   ```bash
   # Edit package.json and update the version number
   # For example, change "1.0.0" to "1.0.1"
   ```

2. **Commit the version change**
   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.0.1"
   ```

3. **Create and push a version tag**
   ```bash
   # Create a tag matching the version (must start with 'v')
   git tag v1.0.1

   # Push the commit and tag
   git push origin main
   git push origin v1.0.1
   ```

4. **GitHub Actions will automatically:**
   - Build the project
   - Create binaries for macOS, Linux, and Windows
   - Create a GitHub release with the tag
   - Upload all binaries to the release
   - Generate release notes from commits

5. **Monitor the release**
   - Go to your GitHub repository
   - Click on "Actions" tab to see the workflow running
   - Once complete, check the "Releases" section

### Release Workflow Details

The workflow (`.github/workflows/release.yml`) is triggered when you push a tag matching the pattern `v*.*.*` (e.g., `v1.0.0`, `v1.2.3`, `v2.0.0-beta.1`).

**What it does:**
1. Checks out the code
2. Sets up Node.js 18
3. Installs pnpm and dependencies
4. Runs `pnpm build` to compile TypeScript
5. Runs `pnpm package` to create binaries
6. Creates a GitHub release
7. Uploads binaries: `doklog-macos`, `doklog-linux`, `doklog-win.exe`

### Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **Major version** (X.0.0): Breaking changes
- **Minor version** (1.X.0): New features, backwards compatible
- **Patch version** (1.0.X): Bug fixes, backwards compatible

Examples:
- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature (e.g., add SQS support)
- `v2.0.0` - Breaking change (e.g., change CLI arguments)

### Pre-releases

You can also create pre-release versions:

```bash
git tag v1.1.0-beta.1
git push origin v1.1.0-beta.1
```

The workflow will mark these as "pre-release" on GitHub.

### Manual Release (if needed)

If you need to create a release manually:

```bash
# Build binaries locally
pnpm package

# Manually create a release on GitHub
# Upload bin/doklog-macos, bin/doklog-linux, bin/doklog-win.exe
```

### Testing the Workflow

Before creating your first official release, you can test with a pre-release tag:

```bash
git tag v1.0.0-test.1
git push origin v1.0.0-test.1
```

Check GitHub Actions to ensure everything builds correctly, then delete the test tag and release.

### Troubleshooting

**Workflow doesn't trigger:**
- Ensure tag starts with `v` (e.g., `v1.0.0`, not `1.0.0`)
- Ensure you pushed the tag: `git push origin v1.0.0`

**Build fails:**
- Check GitHub Actions logs for errors
- Ensure all tests pass: `pnpm test:run`
- Ensure build works locally: `pnpm build && pnpm package`

**Permission errors:**
- The workflow uses `GITHUB_TOKEN` which is automatically provided
- No additional secrets needed for public repositories
