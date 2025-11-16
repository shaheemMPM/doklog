#!/bin/bash

# Release script for doklog
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 1.0.0

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if version is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Version number required${NC}"
  echo "Usage: ./scripts/release.sh <version>"
  echo "Example: ./scripts/release.sh 1.0.0"
  exit 1
fi

VERSION=$1
TAG="v${VERSION}"

# Check current version in package.json
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)

if [ "$CURRENT_VERSION" = "$VERSION" ]; then
  echo -e "${YELLOW}⚠ Warning: package.json is already at version ${VERSION}${NC}"
  echo -e "${YELLOW}This will create a release without a version bump commit.${NC}"
  echo -e "${YELLOW}Consider using a newer version number.${NC}\n"
fi

echo -e "${BLUE}Starting release process for version ${TAG}${NC}\n"

# Step 1: Update package.json version
echo -e "${YELLOW}[1/8]${NC} Updating package.json version to ${VERSION}..."
if command -v jq &> /dev/null; then
  # Use jq if available (more reliable)
  jq ".version = \"${VERSION}\"" package.json > package.json.tmp && mv package.json.tmp package.json
else
  # Fallback to sed
  sed -i.bak "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" package.json && rm package.json.bak
fi
# Format package.json with Biome to ensure consistent formatting
pnpm biome format --write package.json > /dev/null 2>&1
echo -e "${GREEN}✓ Version updated${NC}\n"

# Step 2: Run tests
echo -e "${YELLOW}[2/8]${NC} Running tests..."
pnpm test:run
echo -e "${GREEN}✓ Tests passed${NC}\n"

# Step 3: Run linting
echo -e "${YELLOW}[3/8]${NC} Running linter..."
pnpm check
echo -e "${GREEN}✓ Linting passed${NC}\n"

# Step 4: Build TypeScript
echo -e "${YELLOW}[4/8]${NC} Building TypeScript..."
pnpm build
echo -e "${GREEN}✓ Build completed${NC}\n"

# Step 5: Build binaries
echo -e "${YELLOW}[5/8]${NC} Building binaries for all platforms..."
pnpm package
echo -e "${GREEN}✓ Binaries built${NC}\n"

# Step 6: Git commit
echo -e "${YELLOW}[6/8]${NC} Committing version changes..."
git add package.json
if git diff --staged --quiet; then
  echo -e "${YELLOW}⚠ No version changes detected (already at ${VERSION})${NC}\n"
else
  git commit -m "Bumps version to ${VERSION}"
  echo -e "${GREEN}✓ Changes committed${NC}\n"
fi

# Step 7: Create Git tag
echo -e "${YELLOW}[7/8]${NC} Creating git tag ${TAG}..."
if git rev-parse "${TAG}" >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠ Tag ${TAG} already exists locally${NC}"

  # Check if tag exists on remote
  if git ls-remote --tags origin | grep -q "refs/tags/${TAG}"; then
    echo -e "${YELLOW}⚠ Tag ${TAG} also exists on GitHub${NC}"
    echo -e "${YELLOW}Will update existing tag and force push${NC}\n"
    # Delete local tag and recreate it at current commit
    git tag -d "${TAG}" >/dev/null 2>&1
    git tag -a "${TAG}" -m "Release ${TAG}"
  else
    echo -e "${YELLOW}Recreating tag locally${NC}\n"
    git tag -d "${TAG}" >/dev/null 2>&1
    git tag -a "${TAG}" -m "Release ${TAG}"
  fi
else
  git tag -a "${TAG}" -m "Release ${TAG}"
  echo -e "${GREEN}✓ Tag created${NC}\n"
fi

# Step 8: Push to GitHub
echo -e "${YELLOW}[8/8]${NC} Pushing to GitHub..."
git push origin main

# Check if we need to force push the tag
if git ls-remote --tags origin | grep -q "refs/tags/${TAG}"; then
  echo -e "${YELLOW}Force pushing tag ${TAG} to update on GitHub...${NC}"
  git push origin "${TAG}" --force
else
  git push origin "${TAG}"
fi
echo -e "${GREEN}✓ Pushed to GitHub${NC}\n"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Release ${TAG} completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}Next steps:${NC}"

# Check if release already exists on GitHub
if git ls-remote --tags origin | grep -q "refs/tags/${TAG}"; then
  echo -e "1. ${YELLOW}Update the existing GitHub release:${NC}"
  echo -e "   ${BLUE}https://github.com/shaheemMPM/doklog/releases/tag/${TAG}${NC}"
  echo -e "2. Click 'Edit release'"
  echo -e "3. Delete old binaries (if any)"
  echo -e "4. Upload these new binaries:"
else
  echo -e "1. Create a GitHub release manually at:"
  echo -e "   ${BLUE}https://github.com/shaheemMPM/doklog/releases/new${NC}"
  echo -e "2. Select tag: ${TAG}"
  echo -e "3. Upload these binaries:"
fi

echo -e "   - bin/doklog-macos"
echo -e "   - bin/doklog-linux"
echo -e "   - bin/doklog-win.exe"

if git ls-remote --tags origin | grep -q "refs/tags/${TAG}"; then
  echo -e "5. Save the release\n"
else
  echo -e "4. Publish the release\n"
fi
