import { displayBanner } from './utils/banner';

const main = async () => {
	displayBanner();
};

main().catch((err) => {
	console.error('Error:', err);
	process.exit(2);
});
