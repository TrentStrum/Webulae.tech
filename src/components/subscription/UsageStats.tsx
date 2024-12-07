'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';

interface UsageStatsProps {
	used: number;
	limit: number;
	type: string;
}

export function UsageStats({ used, limit, type }: UsageStatsProps) {
	const percentage = Math.min((used / limit) * 100, 100);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{type} Usage</CardTitle>
				<span className="text-sm text-muted-foreground">
					{used} / {limit}
				</span>
			</CardHeader>
			<CardContent>
				<Progress
					value={percentage}
					className="h-2"
					indicatorClassName={
						percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : ''
					}
				/>
				{percentage > 90 && (
					<p className="text-sm text-red-500 mt-2">
						Approaching limit. Consider upgrading your plan.
					</p>
				)}
			</CardContent>
		</Card>
	);
}
