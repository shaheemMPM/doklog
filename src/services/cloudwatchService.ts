import {
	CloudWatchLogsClient,
	DescribeLogStreamsCommand,
} from '@aws-sdk/client-cloudwatch-logs';

export type LogStream = {
	name: string;
	lastEventTime: number;
	firstEventTime: number;
	lastIngestionTime: number;
	storedBytes?: number;
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
