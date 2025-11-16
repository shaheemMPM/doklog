import { search } from '@inquirer/prompts';
import type { LambdaFunction } from '../services/lambdaService';

export const selectLambdaFunction = async (
	functions: LambdaFunction[],
): Promise<string> => {
	const functionName = await search({
		message: 'Select a Lambda function:',
		source: async (input) => {
			if (!input) {
				return functions.map((fn) => ({
					name: `${fn.name}${fn.runtime ? ` (${fn.runtime})` : ''}`,
					value: fn.name,
					description: fn.description,
				}));
			}

			const searchTerm = input.toLowerCase();
			return functions
				.filter(
					(fn) =>
						fn.name.toLowerCase().includes(searchTerm) ||
						fn.runtime?.toLowerCase().includes(searchTerm) ||
						fn.description?.toLowerCase().includes(searchTerm),
				)
				.map((fn) => ({
					name: `${fn.name}${fn.runtime ? ` (${fn.runtime})` : ''}`,
					value: fn.name,
					description: fn.description,
				}));
		},
	});

	return functionName;
};
