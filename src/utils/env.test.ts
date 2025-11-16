import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadEnvFromCwd, parseEnvFile } from './env';

describe('parseEnvFile', () => {
	let tempDir: string;
	let tempEnvFile: string;

	beforeEach(() => {
		// Create a temporary directory for test files
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doklog-test-'));
		tempEnvFile = path.join(tempDir, '.env');
	});

	afterEach(() => {
		// Clean up temporary files
		if (fs.existsSync(tempEnvFile)) {
			fs.unlinkSync(tempEnvFile);
		}
		if (fs.existsSync(tempDir)) {
			fs.rmdirSync(tempDir);
		}
	});

	it('should parse simple key-value pairs', () => {
		const content = 'KEY1=value1\nKEY2=value2';
		fs.writeFileSync(tempEnvFile, content);

		const result = parseEnvFile(tempEnvFile);

		expect(result).toEqual({
			KEY1: 'value1',
			KEY2: 'value2',
		});
	});

	it('should handle quoted values', () => {
		const content = 'KEY1="quoted value"\nKEY2=\'single quoted\'';
		fs.writeFileSync(tempEnvFile, content);

		const result = parseEnvFile(tempEnvFile);

		expect(result).toEqual({
			KEY1: 'quoted value',
			KEY2: 'single quoted',
		});
	});

	it('should ignore comments', () => {
		const content =
			'# This is a comment\nKEY1=value1\n# Another comment\nKEY2=value2';
		fs.writeFileSync(tempEnvFile, content);

		const result = parseEnvFile(tempEnvFile);

		expect(result).toEqual({
			KEY1: 'value1',
			KEY2: 'value2',
		});
	});

	it('should ignore empty lines', () => {
		const content = 'KEY1=value1\n\n\nKEY2=value2\n\n';
		fs.writeFileSync(tempEnvFile, content);

		const result = parseEnvFile(tempEnvFile);

		expect(result).toEqual({
			KEY1: 'value1',
			KEY2: 'value2',
		});
	});

	it('should handle values with equals signs', () => {
		const content = 'URL=https://example.com?foo=bar';
		fs.writeFileSync(tempEnvFile, content);

		const result = parseEnvFile(tempEnvFile);

		expect(result).toEqual({
			URL: 'https://example.com?foo=bar',
		});
	});

	it('should trim whitespace around keys and values', () => {
		const content = '  KEY1  =  value1  \n  KEY2=value2  ';
		fs.writeFileSync(tempEnvFile, content);

		const result = parseEnvFile(tempEnvFile);

		expect(result).toEqual({
			KEY1: 'value1',
			KEY2: 'value2',
		});
	});

	it('should return empty object for non-existent file', () => {
		const result = parseEnvFile('/non/existent/file.env');

		expect(result).toEqual({});
	});

	it('should handle AWS credentials format', () => {
		const content =
			'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nAWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
		fs.writeFileSync(tempEnvFile, content);

		const result = parseEnvFile(tempEnvFile);

		expect(result).toEqual({
			AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
			AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
		});
	});
});

describe('loadEnvFromCwd', () => {
	const originalCwd = process.cwd();
	let tempDir: string;

	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doklog-test-'));
	});

	afterEach(() => {
		process.chdir(originalCwd);
		// Clean up
		const envFile = path.join(tempDir, '.env');
		if (fs.existsSync(envFile)) {
			fs.unlinkSync(envFile);
		}
		if (fs.existsSync(tempDir)) {
			fs.rmdirSync(tempDir);
		}
	});

	it('should load .env from current working directory', () => {
		const envContent = 'TEST_KEY=test_value';
		fs.writeFileSync(path.join(tempDir, '.env'), envContent);

		process.chdir(tempDir);
		const result = loadEnvFromCwd();

		expect(result).toEqual({
			TEST_KEY: 'test_value',
		});
	});

	it('should return empty object if no .env in cwd', () => {
		process.chdir(tempDir);
		const result = loadEnvFromCwd();

		expect(result).toEqual({});
	});
});
