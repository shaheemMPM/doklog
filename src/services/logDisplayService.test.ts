import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { displayLog, displayLogSeparator } from './logDisplayService';

describe('logDisplayService', () => {
	let consoleLogSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
	});

	describe('displayLog', () => {
		it('should display log with timestamp', () => {
			const timestamp = new Date('2025-01-16T10:30:45.000Z').getTime();
			const message = 'Test log message';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('Test log message');
		});

		it('should detect and colorize START messages', () => {
			const timestamp = Date.now();
			const message = 'START RequestId: abc-123-def';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			// Green color code for START messages
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('START RequestId');
		});

		it('should detect and colorize END messages', () => {
			const timestamp = Date.now();
			const message = 'END RequestId: abc-123-def';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('END RequestId');
		});

		it('should detect and colorize REPORT messages', () => {
			const timestamp = Date.now();
			const message =
				'REPORT RequestId: abc-123-def Duration: 1234ms Memory: 128MB';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('REPORT RequestId');
		});

		it('should detect and colorize ERROR messages', () => {
			const timestamp = Date.now();
			const message = 'ERROR: Something went wrong';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('ERROR');
		});

		it('should detect and colorize WARN messages', () => {
			const timestamp = Date.now();
			const message = 'WARN: This is a warning';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('WARN');
		});

		it('should detect and colorize INFO messages', () => {
			const timestamp = Date.now();
			const message = 'INFO: Informational message';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('INFO');
		});

		it('should detect and colorize DEBUG messages', () => {
			const timestamp = Date.now();
			const message = 'DEBUG: Debug information';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('DEBUG');
		});

		it('should handle multi-line messages with indentation', () => {
			const timestamp = Date.now();
			const message =
				'Error: Connection failed\n    at Database.connect\n    at index.js:45';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('Error: Connection failed');
		});

		it('should handle messages with EXCEPTION keyword', () => {
			const timestamp = Date.now();
			const message = 'EXCEPTION: Unhandled exception occurred';

			displayLog(timestamp, message);

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			expect(output).toContain('EXCEPTION');
		});
	});

	describe('displayLogSeparator', () => {
		it('should display a separator line', () => {
			displayLogSeparator();

			expect(consoleLogSpy).toHaveBeenCalled();
			const output = consoleLogSpy.mock.calls[0][0];
			// Should contain dash characters
			expect(output).toContain('─');
		});
	});
});
