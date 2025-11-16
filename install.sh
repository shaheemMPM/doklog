#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO="shaheemMPM/doklog"
VERSION="latest"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="doklog"

# Detect OS and architecture
detect_platform() {
    local os=""
    local arch=""

    # Detect OS
    case "$(uname -s)" in
        Linux*)     os="linux";;
        Darwin*)    os="macos";;
        MINGW*|MSYS*|CYGWIN*) os="win";;
        *)
            echo -e "${RED}Unsupported operating system: $(uname -s)${NC}"
            exit 1
            ;;
    esac

    # Detect architecture
    case "$(uname -m)" in
        x86_64|amd64)   arch="x64";;
        arm64|aarch64)  arch="arm64";;
        *)
            echo -e "${RED}Unsupported architecture: $(uname -m)${NC}"
            echo -e "${YELLOW}Currently only x64 and arm64 are supported${NC}"
            exit 1
            ;;
    esac

    # Only x64 is available for now
    if [ "$arch" != "x64" ]; then
        echo -e "${RED}Only x64 architecture is currently supported${NC}"
        exit 1
    fi

    echo "${os}"
}

download_binary() {
    local platform=$1
    local binary_name="${BINARY_NAME}-${platform}"

    if [ "$platform" = "win" ]; then
        binary_name="${binary_name}.exe"
    fi

    local download_url="https://github.com/${REPO}/releases/latest/download/${binary_name}"
    local temp_file="/tmp/${binary_name}"

    echo -e "${YELLOW}Downloading doklog for ${platform}...${NC}"

    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$download_url" -o "$temp_file"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$download_url" -O "$temp_file"
    else
        echo -e "${RED}Error: Neither curl nor wget is available${NC}"
        exit 1
    fi

    if [ ! -f "$temp_file" ]; then
        echo -e "${RED}Download failed${NC}"
        exit 1
    fi

    echo "$temp_file"
}

install_binary() {
    local temp_file=$1
    local platform=$2

    if [ "$platform" = "win" ]; then
        echo -e "${YELLOW}For Windows, please manually copy the binary to a directory in your PATH${NC}"
        echo -e "${GREEN}Binary downloaded to: ${temp_file}${NC}"
        exit 0
    fi

    # Make binary executable
    chmod +x "$temp_file"

    # Try to install to /usr/local/bin
    if [ -w "$INSTALL_DIR" ]; then
        mv "$temp_file" "${INSTALL_DIR}/${BINARY_NAME}"
        echo -e "${GREEN}✓ Installed to ${INSTALL_DIR}/${BINARY_NAME}${NC}"
    else
        echo -e "${YELLOW}Installing to ${INSTALL_DIR} requires sudo privileges${NC}"
        sudo mv "$temp_file" "${INSTALL_DIR}/${BINARY_NAME}"
        echo -e "${GREEN}✓ Installed to ${INSTALL_DIR}/${BINARY_NAME}${NC}"
    fi
}

verify_installation() {
    if command -v $BINARY_NAME >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Installation verified${NC}"
        echo -e "\nRun '${BINARY_NAME}' to get started!"
    else
        echo -e "${RED}Installation completed but binary not found in PATH${NC}"
        echo -e "${YELLOW}You may need to restart your terminal or add ${INSTALL_DIR} to your PATH${NC}"
    fi
}

main() {
    echo ""
    echo "╔═══════════════════════════════════════════╗"
    echo "║                                           ║"
    echo "║  📋 doklog Installer                      ║"
    echo "║     Part of Dokops toolkit                ║"
    echo "║                                           ║"
    echo "╚═══════════════════════════════════════════╝"
    echo ""

    # Detect platform
    platform=$(detect_platform)
    echo -e "${GREEN}Detected platform: ${platform}-x64${NC}\n"

    # Download binary
    temp_file=$(download_binary "$platform")

    # Install binary
    install_binary "$temp_file" "$platform"

    # Verify installation
    verify_installation
}

main
