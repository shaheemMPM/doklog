// src/index.ts
import {
	CloudWatchLogsClient,
	DescribeLogStreamsCommand,
	GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import minimist from 'minimist';
import dotenv from 'dotenv';

dotenv.config();

type LogEvent = {
	timestamp: number;
	message: string;
	ingestionTime?: number;
};

function fmtTime(ms: number) {
	return new Date(ms).toISOString();
}

async function getLatestLogStreamNames(
	client: CloudWatchLogsClient,
	logGroupName: string,
	limit = 10
) {
	const cmd = new DescribeLogStreamsCommand({
		logGroupName,
		orderBy: 'LastEventTime',
		descending: true,
		limit,
	});
	const res = await client.send(cmd);
	return (res.logStreams || []).map((ls) => ({
		name: ls.logStreamName ?? '',
		lastEventTime: ls.lastEventTimestamp ?? 0,
	}));
}

async function getLogEventsForStream(
	client: CloudWatchLogsClient,
	logGroupName: string,
	logStreamName: string
) {
	// Get all events in the stream (paginated if needed)
	const events: LogEvent[] = [];
	let nextToken: string | undefined;
	// We'll call get-log-events loop until no nextForwardToken change
	do {
		const cmd = new GetLogEventsCommand({
			logGroupName,
			logStreamName,
			nextToken,
			startFromHead: true,
		});
		const res = await client.send(cmd);
		if (res.events) {
			for (const e of res.events) {
				events.push({
					timestamp: e.timestamp ?? 0,
					message: e.message ?? '',
					ingestionTime: e.ingestionTime,
				});
			}
		}
		// nextForwardToken is the token to get more events in the forward direction.
		// Break if token unchanged.
		const newToken = res.nextForwardToken;
		if (!newToken || newToken === nextToken) break;
		nextToken = newToken;
	} while (true);

	return events;
}

async function main() {
	const argv = minimist(process.argv.slice(2), {
		string: ['function', 'log-group', 'region'],
		boolean: ['merge', 'json'],
		alias: {
			f: 'function',
			g: 'log-group',
			r: 'region',
			l: 'limit',
			m: 'merge',
			j: 'json',
		},
		default: { limit: 10, merge: false, json: false },
	});

	const region =
		argv.region ||
		process.env.AWS_REGION ||
		process.env.AWS_DEFAULT_REGION ||
		'us-east-1';
	const funcName = argv.function;
	const logGroup =
		argv['log-group'] || (funcName ? `/aws/lambda/${funcName}` : undefined);
	const limit = Number(argv.limit) || 10;
	const merge = Boolean(argv.merge);
	const outJson = Boolean(argv.json);

	if (!logGroup) {
		console.error(
			'Error: provide --function <name> OR --log-group <group>. Example: --function myLambda'
		);
		process.exit(1);
	}

	const client = new CloudWatchLogsClient({ region });

	console.error(`Region: ${region}`);
	console.error(`Log group: ${logGroup}`);
	console.error(`Fetching ${limit} latest log stream(s)...`);

	const streams = await getLatestLogStreamNames(client, logGroup, limit);

	if (streams.length === 0) {
		console.error('No log streams found.');
		return;
	}

	if (!merge) {
		// Print per-invocation grouped logs
		for (const s of streams) {
			console.log(
				`\n==== Stream: ${s.name} (lastEvent: ${fmtTime(
					s.lastEventTime
				)}) ====\n`
			);
			const events = await getLogEventsForStream(client, logGroup, s.name);
			for (const e of events) {
				if (outJson) {
					console.log(
						JSON.stringify({
							ts: e.timestamp,
							t: fmtTime(e.timestamp),
							message: e.message,
						})
					);
				} else {
					console.log(`[${fmtTime(e.timestamp)}] ${e.message}`);
				}
			}
		}
	} else {
		// Merge all events across streams and sort by timestamp
		const allEvents: Array<{
			stream: string;
			timestamp: number;
			message: string;
		}> = [];
		await Promise.all(
			streams.map(async (s) => {
				const events = await getLogEventsForStream(client, logGroup, s.name);
				for (const e of events) {
					allEvents.push({
						stream: s.name,
						timestamp: e.timestamp,
						message: e.message,
					});
				}
			})
		);

		allEvents.sort((a, b) => a.timestamp - b.timestamp);

		for (const e of allEvents) {
			if (outJson) {
				console.log(
					JSON.stringify({
						stream: e.stream,
						ts: e.timestamp,
						t: fmtTime(e.timestamp),
						message: e.message,
					})
				);
			} else {
				console.log(`[${fmtTime(e.timestamp)}] (${e.stream}) ${e.message}`);
			}
		}
	}
}

main().catch((err) => {
	console.error('Error:', err);
	process.exit(2);
});
