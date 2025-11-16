import chalk from 'chalk';
import { selectLambdaFunction } from '../prompts/lambdaFunctionSelector';
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
		// TODO: Show function details/logs
	} catch (error) {
		console.error(chalk.red('\nError fetching Lambda functions:'), error);
		throw error;
	}
};
