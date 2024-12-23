'use client';

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

interface ChartDataPoint {
	date: string;
	value: number;
	[key: string]: unknown;
}

interface AnalyticsChartProps {
	data: ChartDataPoint[];
	title: string;
	dataKey: string;
	xAxisKey?: string;
}

export function AnalyticsChart({ data, title, dataKey, xAxisKey = 'date' }: AnalyticsChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey={xAxisKey}
								tickFormatter={(value) => new Date(value).toLocaleDateString()}
							/>
							<YAxis />
							<Tooltip />
							<Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
