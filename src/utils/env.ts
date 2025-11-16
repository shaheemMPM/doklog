import fs from 'node:fs';
import path from 'node:path';

export const parseEnvFile = (filePath: string): Record<string, string> => {
	if (!fs.existsSync(filePath)) {
		return {};
	}

	const envContent = fs.readFileSync(filePath, 'utf-8');
	const envVars: Record<string, string> = {};

	envContent.split('\n').forEach((line) => {
		const trimmedLine = line.trim();
		if (!trimmedLine || trimmedLine.startsWith('#')) return;

		const match = trimmedLine.match(/^([^=]+)=(.*)$/);
		if (match) {
			const key = match[1].trim();
			let value = match[2].trim();
			// Remove quotes if present
			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}
			envVars[key] = value;
		}
	});

	return envVars;
};

export const loadEnvFromCwd = (): Record<string, string> => {
	const envPath = path.join(process.cwd(), '.env');
	return parseEnvFile(envPath);
};
