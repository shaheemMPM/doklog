import { search } from '@inquirer/prompts';

export type AWSService = 'lambda' | 'sqs';

type ServiceOption = {
	value: AWSService;
	name: string;
	description: string;
};

const SERVICES: ServiceOption[] = [
	{
		value: 'lambda',
		name: 'Lambda',
		description: 'AWS Lambda Functions',
	},
	{
		value: 'sqs',
		name: 'SQS',
		description: 'Simple Queue Service',
	},
];

export const selectService = async (): Promise<AWSService> => {
	const service = await search({
		message: 'Select an AWS service:',
		source: async (input) => {
			if (!input) {
				return SERVICES.map((s) => ({
					name: `${s.name} - ${s.description}`,
					value: s.value,
				}));
			}

			const searchTerm = input.toLowerCase();
			return SERVICES.filter(
				(s) =>
					s.name.toLowerCase().includes(searchTerm) ||
					s.description.toLowerCase().includes(searchTerm) ||
					s.value.toLowerCase().includes(searchTerm),
			).map((s) => ({
				name: `${s.name} - ${s.description}`,
				value: s.value,
			}));
		},
	});

	return service;
};
