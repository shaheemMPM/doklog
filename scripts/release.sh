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
git commit -m "chore: bump version to ${VERSION}"
echo -e "${GREEN}✓ Changes committed${NC}\n"

# Step 7: Create Git tag
echo -e "${YELLOW}[7/8]${NC} Creating git tag ${TAG}..."
git tag -a "${TAG}" -m "Release ${TAG}"
echo -e "${GREEN}✓ Tag created${NC}\n"

# Step 8: Push to GitHub
echo -e "${YELLOW}[8/8]${NC} Pushing to GitHub..."
git push origin main
git push origin "${TAG}"
echo -e "${GREEN}✓ Pushed to GitHub${NC}\n"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Release ${TAG} completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Create a GitHub release manually at:"
echo -e "   ${BLUE}https://github.com/shaheemMPM/doklog/releases/new${NC}"
echo -e "2. Select tag: ${TAG}"
echo -e "3. Upload these binaries:"
echo -e "   - bin/doklog-macos"
echo -e "   - bin/doklog-linux"
echo -e "   - bin/doklog-win.exe"
echo -e "4. Publish the release\n"
