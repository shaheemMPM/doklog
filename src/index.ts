import { displayBanner } from './utils/banner';
import { selectRegion } from './prompts/regionSelector';
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

	console.log('\nYou have reached the second screen');
	console.log(`Selected region: ${region}`);
};

main().catch((err) => {
	console.error('Error:', err);
	process.exit(2);
});
