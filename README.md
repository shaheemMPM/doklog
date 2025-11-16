# doklog

AWS logs, simplified - Part of the **Dokops** toolkit.

## Quick Install

Install with a single command:

```bash
curl -fsSL https://raw.githubusercontent.com/shaheemMPM/doklog/main/install.sh | bash
```

Or download manually from the [releases page](https://github.com/shaheemMPM/doklog/releases).

## AWS Credentials

doklog automatically detects your AWS credentials from multiple sources in the following priority order:

### 1. Environment Variables (Highest Priority)
Credentials already exported in your shell session:
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 2. `.env` File (Project Root)
Create a `.env` file in the directory where you run the tool:
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 3. AWS Credentials File
Standard AWS CLI credentials file at `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

### 4. Interactive Prompt (Fallback)
If credentials aren't found in any of the above locations, you'll be prompted to enter them interactively. The credentials will be securely saved to `~/.aws/credentials` for future use.

**Note:** Secret keys are masked with asterisks (`*****`) when entered via prompt.

## Usage

```bash
# Development mode
pnpm dev

# Production mode
pnpm build
pnpm start

# Create standalone binaries
pnpm package
```

## Features

- 🔐 **Multiple credential sources** - Environment variables, .env file, or ~/.aws/credentials
- 🌍 **Multi-region support** - Select any AWS region
- ⚡ **Lambda function logs** - View logs from your Lambda functions with color-coded output
- 🔍 **Searchable lists** - Quick filtering for functions and log streams
- 🎨 **Smart log highlighting** - Errors in red, warnings in yellow, lifecycle events in green
- ⏱️ **Human-readable timestamps** - Shows "5m ago" or "16th Jan 2025, 10:30 AM EST"

## Building from Source

### Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev
```

### Building Standalone Binaries

doklog can be compiled into standalone executables that don't require Node.js:

```bash
# Build all platforms
pnpm package

# Or build for specific platform
pnpm package:macos
pnpm package:linux
pnpm package:win
```

This creates platform-specific binaries in the `bin/` directory:
- `doklog-macos` - macOS (x64)
- `doklog-linux` - Linux (x64)
- `doklog-win.exe` - Windows (x64)
