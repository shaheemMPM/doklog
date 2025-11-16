# CloudWatch Lens

AWS logs, simplified.

## AWS Credentials

CloudWatch Lens automatically detects your AWS credentials from multiple sources in the following priority order:

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
```
