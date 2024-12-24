'use client';

import { useEffect, useState } from 'react';

import { AnalyticsChart } from '@/src/components/analytics/charts/AnalyticsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AnalyticsService } from '@/src/lib/services/analytics-service';

interface OrganizationInsightsProps {
	organizationId: string;
}

interface Insight {
	id: string;
	insight_type: string;
	insight_data: Record<string, unknown>;
	value: number;
}

export function OrganizationInsights({ organizationId }: OrganizationInsightsProps) {
	const [insights, setInsights] = useState<Insight[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchInsights() {
			try {
				const startDate = new Date();
				startDate.setMonth(startDate.getMonth() - 1); // Last 30 days
				const endDate = new Date();

				const data = await AnalyticsService.getOrganizationInsights(
					organizationId,
					startDate,
					endDate
				);
				setInsights(data || []);
			} catch (error) {
				console.error('Error fetching insights:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchInsights();
	}, [organizationId]);

	if (isLoading) {
		return <div>Loading insights...</div>;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<AnalyticsChart
				title="User Growth"
				data={insights.filter((i) => i.insight_type === 'user_growth')}
				dataKey="value"
			/>

			<Card>
				<CardHeader>
					<CardTitle>Key Metrics</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2">
						{insights.map((insight) => (
							<li key={insight.id} className="flex justify-between">
								<span>{insight.insight_type}</span>
								<span className="font-medium">{JSON.stringify(insight.insight_data)}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
