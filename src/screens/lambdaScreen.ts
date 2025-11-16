import chalk from 'chalk';
import { selectLambdaFunction } from '../prompts/lambdaFunctionSelector';
import { selectLogStream } from '../prompts/logStreamSelector';
import { getLogEvents, listLogStreams } from '../services/cloudwatchService';
import { listLambdaFunctions } from '../services/lambdaService';
import { displayLog, displayLogSeparator } from '../services/logDisplayService';

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
		console.log(chalk.yellow('\nLoading logs...'));

		// Fetch and display logs
		const events = await getLogEvents(region, logGroupName, selectedStream);

		if (events.length === 0) {
			console.log(chalk.red('\nNo log events found in this stream.'));
			return;
		}

		console.log(chalk.green(`\n✓ Found ${events.length} log event(s)\n`));
		displayLogSeparator();

		for (const event of events) {
			displayLog(event.timestamp, event.message);
		}

		displayLogSeparator();
	} catch (error: unknown) {
		// Re-throw ExitPromptError to be handled by main
		if (
			error &&
			typeof error === 'object' &&
			('name' in error || 'message' in error)
		) {
			const err = error as { name?: string; message?: string };
			if (
				err.name === 'ExitPromptError' ||
				err.message?.includes('force closed')
			) {
				throw error;
			}
		}

		console.error(chalk.red('\nError:'), error);
		throw error;
	}
};
