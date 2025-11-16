import { search } from '@inquirer/prompts';
import type { LogStream } from '../services/cloudwatchService';

const formatTimestampRelative = (timestamp: number): string => {
	const now = new Date();
	const diffMs = now.getTime() - timestamp;
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return formatTimestampFull(timestamp);
};

const formatTimestampFull = (timestamp: number): string => {
	const date = new Date(timestamp);
	const day = date.getDate();
	const suffix = ['th', 'st', 'nd', 'rd'][
		day % 10 > 3 ? 0 : (day % 100) - (day % 10) !== 10 ? day % 10 : 0
	];
	const month = date.toLocaleString('en-US', { month: 'short' });
	const year = date.getFullYear();
	const time = date.toLocaleString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	// Get timezone abbreviation (e.g., "EST", "PST", "GMT")
	const timezone = date
		.toLocaleString('en-US', { timeZoneName: 'short' })
		.split(' ')
		.pop();

	return `${day}${suffix} ${month} ${year}, ${time} ${timezone}`;
};

const formatBytes = (bytes?: number): string => {
	if (!bytes) return '0 B';
	const kb = bytes / 1024;
	if (kb < 1) return `${bytes} B`;
	if (kb < 1024) return `${kb.toFixed(1)} KB`;
	return `${(kb / 1024).toFixed(1)} MB`;
};

export const selectLogStream = async (
	streams: LogStream[],
): Promise<string> => {
	const streamName = await search({
		message: 'Select a log stream:',
		source: async (input) => {
			const formatStream = (stream: LogStream) => ({
				name: `${formatTimestampRelative(stream.lastEventTime)} | ${stream.name} | ${formatBytes(stream.storedBytes)}`,
				value: stream.name,
				description: `Last event: ${formatTimestampFull(stream.lastEventTime)}`,
			});

			if (!input) {
				return streams.map(formatStream);
			}

			const searchTerm = input.toLowerCase();
			return streams
				.filter(
					(s) =>
						s.name.toLowerCase().includes(searchTerm) ||
						formatTimestampRelative(s.lastEventTime)
							.toLowerCase()
							.includes(searchTerm) ||
						formatTimestampFull(s.lastEventTime)
							.toLowerCase()
							.includes(searchTerm),
				)
				.map(formatStream);
		},
	});

	return streamName;
};
