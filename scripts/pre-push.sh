#!/bin/bash

# Pre-push checks for doklog
# This runs tests and linting before pushing to ensure code quality

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Running pre-push checks...${NC}\n"

# Run tests
echo -e "${YELLOW}[1/3]${NC} Running tests..."
pnpm test:run
echo -e "${GREEN}✓ Tests passed${NC}\n"

# Run linting
echo -e "${YELLOW}[2/3]${NC} Running linter..."
pnpm check
echo -e "${GREEN}✓ Linting passed${NC}\n"

# Build to ensure no TypeScript errors
echo -e "${YELLOW}[3/3]${NC} Building TypeScript..."
pnpm build
echo -e "${GREEN}✓ Build successful${NC}\n"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All pre-push checks passed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

exit 0
