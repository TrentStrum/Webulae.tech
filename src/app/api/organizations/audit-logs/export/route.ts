import { auth } from '@clerk/nextjs';
import { Parser } from 'json2csv';
import { NextResponse } from 'next/server';

import { supabase } from '@/src/lib/supabase/config';


export async function POST(req: Request): Promise<NextResponse> {
	const { userId, orgId } = auth();
	
	if (!userId || !orgId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { format, timeRange, eventTypes } = await req.json();

		// Calculate date range
		const now = new Date();
		let startDate = new Date(0); // Beginning of time

		switch (timeRange) {
			case '7d':
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case '30d':
				startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case '90d':
				startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
				break;
		}

		// Fetch logs
		const logs = await supabase.auditLog.findMany({
			where: {
				organizationId: orgId,
				createdAt: {
					gte: startDate,
				},
				...(eventTypes[0] !== 'all' && {
					event: {
						in: eventTypes,
					},
				}),
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Format the data
		if (format === 'json') {
			return new NextResponse(JSON.stringify(logs, null, 2), {
				headers: {
					'Content-Type': 'application/json',
					'Content-Disposition': `attachment; filename="audit-logs-${format(
						new Date(),
						'yyyy-MM-dd'
					)}.json"`,
				},
			});
		} else {
			const parser = new Parser({
				fields: ['event', 'description', 'actor', 'createdAt', 'metadata'],
			});
			const csv = parser.parse(logs);

			return new NextResponse(csv, {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': `attachment; filename="audit-logs-${format(
						new Date(),
						'yyyy-MM-dd'
					)}.csv"`,
				},
			});
		}
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to export audit logs' },
			{ status: 500 }
		);
	}
} 