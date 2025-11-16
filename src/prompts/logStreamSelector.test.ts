import { describe, expect, it } from 'vitest';

// Helper function extracted for testing (not exported in original, so we'll test the concept)
const formatTimestampRelative = (timestamp: number): string => {
	const now = new Date();
	const diffMs = now.getTime() - timestamp;
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return formatTimestampFull(timestamp);
};

const formatTimestampFull = (timestamp: number): string => {
	const date = new Date(timestamp);
	const day = date.getDate();
	const suffix = ['th', 'st', 'nd', 'rd'][
		day % 10 > 3 ? 0 : (day % 100) - (day % 10) !== 10 ? day % 10 : 0
	];
	const month = date.toLocaleString('en-US', { month: 'short' });
	const year = date.getFullYear();
	const time = date.toLocaleString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	const timezone = date
		.toLocaleString('en-US', { timeZoneName: 'short' })
		.split(' ')
		.pop();

	return `${day}${suffix} ${month} ${year}, ${time} ${timezone}`;
};

const formatBytes = (bytes?: number): string => {
	if (!bytes) return '0 B';
	const kb = bytes / 1024;
	if (kb < 1) return `${bytes} B`;
	if (kb < 1024) return `${kb.toFixed(1)} KB`;
	return `${(kb / 1024).toFixed(1)} MB`;
};

describe('Timestamp Formatting', () => {
	describe('formatTimestampRelative', () => {
		it('should show "Just now" for very recent timestamps', () => {
			const now = Date.now();
			const result = formatTimestampRelative(now);
			expect(result).toBe('Just now');
		});

		it('should show minutes ago for timestamps < 1 hour', () => {
			const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
			const result = formatTimestampRelative(fiveMinutesAgo);
			expect(result).toMatch(/^\d+m ago$/);
			expect(result).toBe('5m ago');
		});

		it('should show hours ago for timestamps < 24 hours', () => {
			const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
			const result = formatTimestampRelative(twoHoursAgo);
			expect(result).toMatch(/^\d+h ago$/);
			expect(result).toBe('2h ago');
		});

		it('should show days ago for timestamps < 7 days', () => {
			const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
			const result = formatTimestampRelative(threeDaysAgo);
			expect(result).toMatch(/^\d+d ago$/);
			expect(result).toBe('3d ago');
		});

		it('should show full timestamp for timestamps >= 7 days', () => {
			const tenDaysAgo = Date.now() - 10 * 24 * 60 * 60 * 1000;
			const result = formatTimestampRelative(tenDaysAgo);
			// Should not be relative format
			expect(result).not.toMatch(/ago$/);
			// Should contain month and year
			expect(result).toMatch(/\d{4}/); // Year
		});
	});

	describe('formatTimestampFull', () => {
		it('should format with ordinal suffix', () => {
			const date = new Date('2025-01-16T10:30:00Z');
			const result = formatTimestampFull(date.getTime());

			expect(result).toContain('16th'); // 16th
			expect(result).toContain('Jan');
			expect(result).toContain('2025');
		});

		it('should handle 1st correctly', () => {
			const date = new Date('2025-01-01T10:30:00Z');
			const result = formatTimestampFull(date.getTime());

			expect(result).toContain('1st');
		});

		it('should handle 2nd correctly', () => {
			const date = new Date('2025-01-02T10:30:00Z');
			const result = formatTimestampFull(date.getTime());

			expect(result).toContain('2nd');
		});

		it('should handle 3rd correctly', () => {
			const date = new Date('2025-01-03T10:30:00Z');
			const result = formatTimestampFull(date.getTime());

			expect(result).toContain('3rd');
		});

		it('should handle 21st correctly', () => {
			const date = new Date('2025-01-21T10:30:00Z');
			const result = formatTimestampFull(date.getTime());

			expect(result).toContain('21st');
		});

		it('should include timezone abbreviation', () => {
			const date = new Date('2025-01-16T10:30:00Z');
			const result = formatTimestampFull(date.getTime());

			// Should end with timezone abbreviation or offset (varies by locale)
			// Examples: GMT, EST, PST, GMT+5:30, UTC+1
			expect(result).toMatch(/([A-Z]{3,4}|[A-Z]{3}[+-]\d{1,2}(:\d{2})?)$/);
		});

		it('should include time with AM/PM', () => {
			const date = new Date('2025-01-16T14:30:00Z');
			const result = formatTimestampFull(date.getTime());

			expect(result).toMatch(/\d{1,2}:\d{2}\s[AP]M/);
		});
	});

	describe('formatBytes', () => {
		it('should format 0 bytes', () => {
			expect(formatBytes(0)).toBe('0 B');
			expect(formatBytes()).toBe('0 B');
		});

		it('should format bytes < 1 KB', () => {
			expect(formatBytes(512)).toBe('512 B');
			expect(formatBytes(1023)).toBe('1023 B');
		});

		it('should format KB', () => {
			expect(formatBytes(1024)).toBe('1.0 KB');
			expect(formatBytes(2048)).toBe('2.0 KB');
			expect(formatBytes(1536)).toBe('1.5 KB');
		});

		it('should format MB', () => {
			expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
			expect(formatBytes(1024 * 1024 * 2)).toBe('2.0 MB');
			expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.5 MB');
		});

		it('should format large values', () => {
			expect(formatBytes(10 * 1024 * 1024)).toBe('10.0 MB');
			expect(formatBytes(100 * 1024 * 1024)).toBe('100.0 MB');
		});
	});
});
