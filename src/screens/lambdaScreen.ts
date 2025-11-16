import chalk from 'chalk';
import { selectLambdaFunction } from '../prompts/lambdaFunctionSelector';
import { selectLogStream } from '../prompts/logStreamSelector';
import { listLogStreams } from '../services/cloudwatchService';
import { listLambdaFunctions } from '../services/lambdaService';

export const showLambdaScreen = async (region: string) => {
	console.log(chalk.cyan('\n=== AWS Lambda ==='));
	console.log(chalk.gray(`Region: ${region}\n`));

	console.log(chalk.yellow('Loading Lambda functions...'));

	try {
		const functions = await listLambdaFunctions(region);

		if (functions.length === 0) {
			console.log(chalk.red('\nNo Lambda functions found in this region.'));
			return;
		}

		console.log(chalk.green(`\n✓ Found ${functions.length} function(s)\n`));

		const selectedFunction = await selectLambdaFunction(functions);

		console.log(chalk.cyan(`\nSelected function: ${selectedFunction}`));

		// Fetch log streams for the selected function
		const logGroupName = `/aws/lambda/${selectedFunction}`;
		console.log(chalk.yellow('\nLoading log streams...'));

		const streams = await listLogStreams(region, logGroupName, 50);

		if (streams.length === 0) {
			console.log(
				chalk.red('\nNo log streams found for this Lambda function.'),
			);
			console.log(
				chalk.gray(
					'The function may not have been invoked yet, or logs expired.',
				),
			);
			return;
		}

		console.log(chalk.green(`\n✓ Found ${streams.length} log stream(s)\n`));

		const selectedStream = await selectLogStream(streams);

		console.log(chalk.cyan(`\nSelected log stream: ${selectedStream}`));
		// TODO: Show logs from the selected stream
	} catch (error) {
		console.error(chalk.red('\nError:'), error);
		throw error;
	}
};
