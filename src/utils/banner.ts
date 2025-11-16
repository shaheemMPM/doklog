import boxen from 'boxen';
import chalk from 'chalk';

export const displayBanner = () => {
	const title = chalk.yellow('doklog');
	const subtitle = chalk.gray('AWS logs, simplified');
	const dokops = chalk.cyan('Part of Dokops toolkit');
	const content = `${title}\n${subtitle}\n${dokops}`;

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
