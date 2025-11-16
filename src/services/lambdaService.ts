import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';

export type LambdaFunction = {
	name: string;
	runtime?: string;
	lastModified?: string;
	description?: string;
};

export const listLambdaFunctions = async (
	region: string,
): Promise<LambdaFunction[]> => {
	const client = new LambdaClient({ region });

	const functions: LambdaFunction[] = [];
	let nextMarker: string | undefined;

	do {
		const command = new ListFunctionsCommand({
			Marker: nextMarker,
			MaxItems: 50,
		});

		const response = await client.send(command);

		if (response.Functions) {
			for (const fn of response.Functions) {
				if (fn.FunctionName) {
					functions.push({
						name: fn.FunctionName,
						runtime: fn.Runtime,
						lastModified: fn.LastModified,
						description: fn.Description,
					});
				}
			}
		}

		nextMarker = response.NextMarker;
	} while (nextMarker);

	return functions;
};
