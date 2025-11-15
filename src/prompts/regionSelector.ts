import { search } from '@inquirer/prompts';
import { AWS_REGIONS } from '../data/regions';

export const selectRegion = async (): Promise<string> => {
	const region = await search({
		message: 'Select an AWS region:',
		source: async (input) => {
			if (!input) {
				return AWS_REGIONS.map((r) => ({
					name: `${r.code} - ${r.name}`,
					value: r.code,
				}));
			}

			const searchTerm = input.toLowerCase();
			return AWS_REGIONS.filter(
				(r) =>
					r.code.toLowerCase().includes(searchTerm) ||
					r.name.toLowerCase().includes(searchTerm)
			).map((r) => ({
				name: `${r.code} - ${r.name}`,
				value: r.code,
			}));
		},
	});

	return region;
};
