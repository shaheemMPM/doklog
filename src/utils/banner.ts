import boxen from 'boxen';
import chalk from 'chalk';

export const displayBanner = () => {
	const title = chalk.yellow('CloudWatch Lens');
	const subtitle = chalk.gray('AWS logs, simplified');
	const content = `${title}\n${subtitle}`;

	const box = boxen(content, {
		padding: 1,
		borderColor: 'cyan',
		borderStyle: 'double',
		textAlignment: 'center',
	});

	console.log('');
	console.log(box);
	console.log('');
};
