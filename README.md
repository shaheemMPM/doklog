# doklog

> AWS logs, simplified - Part of the **Dokops** toolkit

A fast, interactive CLI tool for viewing AWS Lambda logs with smart highlighting and searchable interfaces.

## ✨ Features

- 🔐 **Multiple credential sources** - Environment variables, .env file, or ~/.aws/credentials
- 🌍 **Multi-region support** - Select any AWS region interactively
- ⚡ **Lambda function logs** - Browse and view logs from your Lambda functions
- 🔍 **Searchable lists** - Quick filtering for functions and log streams
- 🎨 **Smart log highlighting** - Errors in red, warnings in yellow, lifecycle events in green
- ⏱️ **Human-readable timestamps** - Shows "5m ago" or "16th Jan 2025, 10:30 AM EST"
- 🚀 **Fast & lightweight** - Standalone binary, no Node.js required

## 📦 Installation

### Quick Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/shaheemMPM/doklog/main/install.sh | bash
```

### Manual Download

Download the latest binary for your platform from the [releases page](https://github.com/shaheemMPM/doklog/releases):

- **macOS**: `doklog-macos`
- **Linux**: `doklog-linux`
- **Windows**: `doklog-win.exe`

Make it executable and move to your PATH:
```bash
chmod +x doklog-macos
sudo mv doklog-macos /usr/local/bin/doklog
```

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

## 🚀 Usage

Simply run `doklog` and follow the interactive prompts:

```bash
doklog
```

The tool will guide you through:
1. **Region Selection** - Choose your AWS region
2. **Service Selection** - Pick AWS Lambda (more services coming soon)
3. **Function Selection** - Browse your Lambda functions
4. **Log Stream Selection** - View recent invocations
5. **Log Display** - See color-coded logs with timestamps

## 🎨 Log Highlighting

doklog automatically colorizes logs for easy scanning:

- 🟢 **Green** - START/END/REPORT (Lambda lifecycle)
- 🔴 **Red** - ERROR/EXCEPTION
- 🟡 **Yellow** - WARN/WARNING
- 🔵 **Cyan** - INFO
- ⚪ **Gray** - DEBUG

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, guidelines, and how to submit pull requests.

## 📝 License

MIT © [Shaheem MPM](https://github.com/shaheemMPM)

## 🔗 Part of Dokops

doklog is part of the Dokops toolkit - a collection of developer tools for DevOps workflows.

---

**Issues?** Report them on [GitHub Issues](https://github.com/shaheemMPM/doklog/issues)
