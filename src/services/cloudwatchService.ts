import {
	CloudWatchLogsClient,
	DescribeLogStreamsCommand,
	GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';

export type LogStream = {
	name: string;
	lastEventTime: number;
	firstEventTime: number;
	lastIngestionTime: number;
	storedBytes?: number;
};

export type LogEvent = {
	timestamp: number;
	message: string;
};

export const listLogStreams = async (
	region: string,
	logGroupName: string,
	limit = 50,
): Promise<LogStream[]> => {
	const client = new CloudWatchLogsClient({ region });

	const streams: LogStream[] = [];
	let nextToken: string | undefined;

	do {
		const command = new DescribeLogStreamsCommand({
			logGroupName,
			orderBy: 'LastEventTime',
			descending: true,
			limit: Math.min(limit - streams.length, 50),
			nextToken,
		});

		const response = await client.send(command);

		if (response.logStreams) {
			for (const stream of response.logStreams) {
				if (stream.logStreamName) {
					streams.push({
						name: stream.logStreamName,
						lastEventTime: stream.lastEventTimestamp ?? 0,
						firstEventTime: stream.firstEventTimestamp ?? 0,
						lastIngestionTime: stream.lastIngestionTime ?? 0,
						storedBytes: stream.storedBytes,
					});
				}
			}
		}

		nextToken = response.nextToken;

		// Stop if we've reached the limit
		if (streams.length >= limit) {
			break;
		}
	} while (nextToken);

	return streams;
};

export const getLogEvents = async (
	region: string,
	logGroupName: string,
	logStreamName: string,
): Promise<LogEvent[]> => {
	const client = new CloudWatchLogsClient({ region });

	const events: LogEvent[] = [];
	let nextToken: string | undefined;
	let hasMore = true;

	while (hasMore) {
		const command = new GetLogEventsCommand({
			logGroupName,
			logStreamName,
			startFromHead: true,
			nextToken,
		});

		const response = await client.send(command);

		if (response.events) {
			for (const event of response.events) {
				if (event.timestamp && event.message) {
					events.push({
						timestamp: event.timestamp,
						message: event.message,
					});
				}
			}
		}

		// Check if there are more events
		const newToken = response.nextForwardToken;
		if (!newToken || newToken === nextToken) {
			hasMore = false;
		} else {
			nextToken = newToken;
		}
	}

	return events;
};
