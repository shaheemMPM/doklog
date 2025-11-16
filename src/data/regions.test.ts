import { describe, expect, it } from 'vitest';
import { AWS_REGIONS, type AWSRegion } from './regions';

describe('AWS Regions Data', () => {
	it('should have at least 20 regions', () => {
		expect(AWS_REGIONS.length).toBeGreaterThanOrEqual(20);
	});

	it('should have all required fields for each region', () => {
		AWS_REGIONS.forEach((region) => {
			expect(region).toHaveProperty('code');
			expect(region).toHaveProperty('name');
			expect(typeof region.code).toBe('string');
			expect(typeof region.name).toBe('string');
		});
	});

	it('should have unique region codes', () => {
		const codes = AWS_REGIONS.map((r) => r.code);
		const uniqueCodes = new Set(codes);
		expect(uniqueCodes.size).toBe(codes.length);
	});

	it('should have non-empty codes and names', () => {
		AWS_REGIONS.forEach((region) => {
			expect(region.code.length).toBeGreaterThan(0);
			expect(region.name.length).toBeGreaterThan(0);
		});
	});

	it('should include common regions', () => {
		const codes = AWS_REGIONS.map((r) => r.code);

		expect(codes).toContain('us-east-1');
		expect(codes).toContain('us-west-2');
		expect(codes).toContain('eu-west-1');
		expect(codes).toContain('ap-southeast-1');
	});

	it('should have properly formatted region codes', () => {
		const regionCodeRegex = /^[a-z]{2}-[a-z]+-\d+$/;

		AWS_REGIONS.forEach((region) => {
			expect(region.code).toMatch(regionCodeRegex);
		});
	});

	it('should have descriptive names with location info', () => {
		AWS_REGIONS.forEach((region) => {
			// Names should contain parentheses with location
			expect(region.name).toMatch(/\(.+\)/);
		});
	});

	it('should export AWSRegion type correctly', () => {
		const testRegion: AWSRegion = {
			code: 'us-test-1',
			name: 'Test Region (Testing)',
		};

		expect(testRegion.code).toBe('us-test-1');
		expect(testRegion.name).toBe('Test Region (Testing)');
	});

	it('should have regions from different continents', () => {
		const codes = AWS_REGIONS.map((r) => r.code);

		// North America
		expect(codes.some((c) => c.startsWith('us-'))).toBe(true);

		// Europe
		expect(codes.some((c) => c.startsWith('eu-'))).toBe(true);

		// Asia Pacific
		expect(codes.some((c) => c.startsWith('ap-'))).toBe(true);

		// South America
		expect(codes.some((c) => c.startsWith('sa-'))).toBe(true);
	});
});
