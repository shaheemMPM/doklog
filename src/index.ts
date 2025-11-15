import { displayBanner } from './utils/banner';
import { selectRegion } from './prompts/regionSelector';

const main = async () => {
	displayBanner();

	const region = await selectRegion();

	console.log('\nYou have reached the second screen');
	console.log(`Selected region: ${region}`);
};

main().catch((err) => {
	console.error('Error:', err);
	process.exit(2);
});
