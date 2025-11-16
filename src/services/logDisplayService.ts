import chalk from 'chalk';

type LogLevel =
	| 'START'
	| 'END'
	| 'REPORT'
	| 'ERROR'
	| 'WARN'
	| 'INFO'
	| 'DEBUG'
	| 'DEFAULT';

const detectLogLevel = (message: string): LogLevel => {
	const upperMessage = message.toUpperCase();

	if (upperMessage.startsWith('START REQUESTID:')) return 'START';
	if (upperMessage.startsWith('END REQUESTID:')) return 'END';
	if (upperMessage.startsWith('REPORT REQUESTID:')) return 'REPORT';

	if (upperMessage.includes('ERROR') || upperMessage.includes('EXCEPTION'))
		return 'ERROR';
	if (upperMessage.includes('WARN')) return 'WARN';
	if (upperMessage.includes('INFO')) return 'INFO';
	if (upperMessage.includes('DEBUG')) return 'DEBUG';

	return 'DEFAULT';
};

const colorizeMessage = (message: string, level: LogLevel): string => {
	switch (level) {
		case 'START':
		case 'END':
		case 'REPORT':
			return chalk.green(message);
		case 'ERROR':
			return chalk.red(message);
		case 'WARN':
			return chalk.yellow(message);
		case 'INFO':
			return chalk.cyan(message);
		case 'DEBUG':
			return chalk.gray(message);
		default:
			return message;
	}
};

const formatTimestamp = (timestamp: number): string => {
	const date = new Date(timestamp);
	return date.toLocaleString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});
};

const formatLogMessage = (message: string): string => {
	// Check if message has multiple lines (stack trace or multi-line error)
	const lines = message.split('\n');
	if (lines.length === 1) {
		return message;
	}

	// First line is the main message, rest are indented
	const [firstLine, ...restLines] = lines;
	const indentedRest = restLines
		.map((line) => `              ${line}`)
		.join('\n');

	return `${firstLine}\n${indentedRest}`;
};

export const displayLog = (timestamp: number, message: string): void => {
	const timeStr = formatTimestamp(timestamp);
	const level = detectLogLevel(message);
	const formattedMessage = formatLogMessage(message);
	const colorizedMessage = colorizeMessage(formattedMessage, level);

	console.log(`${chalk.gray(`[${timeStr}]`)} ${colorizedMessage}`);
};

export const displayLogSeparator = (): void => {
	console.log(chalk.gray(`\n${'─'.repeat(80)}\n`));
};
