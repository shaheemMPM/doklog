import { selectRegion } from './prompts/regionSelector';
import { selectService } from './prompts/serviceSelector';
import { showLambdaScreen } from './screens/lambdaScreen';
import { showSqsScreen } from './screens/sqsScreen';
import { displayBanner } from './utils/banner';
import {
	ensureAwsCredentials,
	setAwsEnvCredentials,
} from './utils/credentials';

const main = async () => {
	displayBanner();

	// Check and setup AWS credentials
	const credentials = await ensureAwsCredentials();
	setAwsEnvCredentials(credentials);

	console.log(''); // Add spacing

	const region = await selectRegion();

	console.log(''); // Add spacing

	const service = await selectService();

	// Route to appropriate service screen
	switch (service) {
		case 'lambda':
			await showLambdaScreen(region);
			break;
		case 'sqs':
			await showSqsScreen(region);
			break;
	}
};

main().catch((err) => {
	// Handle Ctrl+C gracefully (Inquirer throws ExitPromptError)
	if (err.name === 'ExitPromptError' || err.message?.includes('force closed')) {
		console.log('\n\nGoodbye! 👋');
		process.exit(0);
	}

	console.error('Error:', err);
	process.exit(2);
});
