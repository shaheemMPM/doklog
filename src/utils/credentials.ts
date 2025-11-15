import fs from 'fs';
import path from 'path';
import os from 'os';
import ini from 'ini';
import { input, password } from '@inquirer/prompts';
import chalk from 'chalk';
import { loadEnvFromCwd } from './env';

export type AWSCredentials = {
	accessKeyId: string;
	secretAccessKey: string;
};

const getEnvCredentials = (): AWSCredentials | null => {
	// First check if already in process.env (from shell or already loaded)
	let accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

	if (accessKeyId && secretAccessKey) {
		return { accessKeyId, secretAccessKey };
	}

	// Check .env file in current working directory
	const envVars = loadEnvFromCwd();
	accessKeyId = envVars.AWS_ACCESS_KEY_ID;
	secretAccessKey = envVars.AWS_SECRET_ACCESS_KEY;

	if (accessKeyId && secretAccessKey) {
		return { accessKeyId, secretAccessKey };
	}

	return null;
};

const getAwsCredentialsPath = (): string => {
	return path.join(os.homedir(), '.aws', 'credentials');
};

const readAwsCredentialsFile = (): AWSCredentials | null => {
	const credentialsPath = getAwsCredentialsPath();

	if (!fs.existsSync(credentialsPath)) {
		return null;
	}

	try {
		const content = fs.readFileSync(credentialsPath, 'utf-8');
		const parsed = ini.parse(content);

		const profile = parsed.default || parsed.Default;
		if (profile?.aws_access_key_id && profile?.aws_secret_access_key) {
			return {
				accessKeyId: profile.aws_access_key_id,
				secretAccessKey: profile.aws_secret_access_key,
			};
		}
	} catch (error) {
		console.error(chalk.red('Error reading AWS credentials file:'), error);
	}

	return null;
};

const saveAwsCredentials = (credentials: AWSCredentials): void => {
	const awsDir = path.join(os.homedir(), '.aws');
	const credentialsPath = getAwsCredentialsPath();

	// Create .aws directory if it doesn't exist
	if (!fs.existsSync(awsDir)) {
		fs.mkdirSync(awsDir, { mode: 0o700 });
	}

	let existingContent: any = {};
	if (fs.existsSync(credentialsPath)) {
		const content = fs.readFileSync(credentialsPath, 'utf-8');
		existingContent = ini.parse(content);
	}

	// Update or add default profile
	existingContent.default = {
		...existingContent.default,
		aws_access_key_id: credentials.accessKeyId,
		aws_secret_access_key: credentials.secretAccessKey,
	};

	const iniContent = ini.stringify(existingContent);
	fs.writeFileSync(credentialsPath, iniContent, { mode: 0o600 });

	console.log(chalk.green('✓ Credentials saved to ~/.aws/credentials'));
};

const promptForCredentials = async (): Promise<AWSCredentials> => {
	console.log(
		chalk.yellow('\nAWS credentials not found. Please enter your credentials:')
	);
	console.log(
		chalk.gray('(These will be securely stored in ~/.aws/credentials)\n')
	);

	const accessKeyId = await input({
		message: 'AWS Access Key ID:',
		validate: (value) => {
			if (!value || value.trim().length === 0) {
				return 'Access Key ID is required';
			}
			return true;
		},
	});

	const secretAccessKey = await password({
		message: 'AWS Secret Access Key:',
		mask: '*',
		validate: (value) => {
			if (!value || value.trim().length === 0) {
				return 'Secret Access Key is required';
			}
			return true;
		},
	});

	return {
		accessKeyId: accessKeyId.trim(),
		secretAccessKey: secretAccessKey.trim(),
	};
};

export const ensureAwsCredentials = async (): Promise<AWSCredentials> => {
	// 1. Check shell process.env or .env file in current directory
	let credentials = getEnvCredentials();
	if (credentials) {
		console.log(
			chalk.green('✓ Using credentials from environment variables or .env file')
		);
		return credentials;
	}

	// 2. Check ~/.aws/credentials
	credentials = readAwsCredentialsFile();
	if (credentials) {
		console.log(chalk.green('✓ Using credentials from ~/.aws/credentials'));
		return credentials;
	}

	// 3. Prompt user for credentials
	credentials = await promptForCredentials();

	// Save for future use
	saveAwsCredentials(credentials);

	return credentials;
};

export const setAwsEnvCredentials = (credentials: AWSCredentials): void => {
	process.env.AWS_ACCESS_KEY_ID = credentials.accessKeyId;
	process.env.AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey;
};
