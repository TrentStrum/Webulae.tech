import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Calendar } from '@/src/components/ui/calendar';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/select';
import { apiClient } from '@/src/lib/api/apiClient';

import type { Metric } from '@/src/types/analytics.types';


interface CustomReportsProps {
	organizationId: string;
}

type ReportType = 'daily' | 'weekly' | 'monthly';
type MetricType = 'api_call' | 'active_users' | 'storage';

export function CustomReports({ organizationId }: CustomReportsProps): JSX.Element {
	const [selectedMetric, setSelectedMetric] = useState<MetricType>('api_call');
	const [reportType, setReportType] = useState<ReportType>('daily');
	const [date, setDate] = useState<Date>(new Date());

	const { data: metrics = [], isLoading, refetch } = useQuery({
		queryKey: ['metrics', organizationId, selectedMetric, reportType, date],
		queryFn: async () => {
			const response = await apiClient.get<Metric[]>('/metrics', {
				params: {
					organization_id: organizationId,
					metric_type: selectedMetric,
					start_date: getStartDate(date, reportType).toISOString(),
					end_date: date.toISOString(),
				},
			});
			return response.data;
		},
		enabled: !!organizationId,
	});

	const getStartDate = (endDate: Date, type: ReportType): Date => {
		const result = new Date(endDate);
		switch (type) {
			case 'daily':
				result.setDate(result.getDate() - 1);
				break;
			case 'weekly':
				result.setDate(result.getDate() - 7);
				break;
			case 'monthly':
				result.setMonth(result.getMonth() - 1);
				break;
		}
		return result;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Custom Reports</CardTitle>
				<CardDescription>
					Generate custom reports based on your metrics
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Select
						value={selectedMetric}
						onValueChange={(value: MetricType) => setSelectedMetric(value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select metric" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="api_call">API Calls</SelectItem>
							<SelectItem value="active_users">Active Users</SelectItem>
							<SelectItem value="storage">Storage Usage</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={reportType}
						onValueChange={(value: ReportType) => setReportType(value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Report type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="daily">Daily</SelectItem>
							<SelectItem value="weekly">Weekly</SelectItem>
							<SelectItem value="monthly">Monthly</SelectItem>
						</SelectContent>
					</Select>

					<Calendar
						mode="single"
						selected={date}
						onSelect={(newDate) => newDate && setDate(newDate)}
						className="rounded-md border"
					/>
				</div>

				<Button 
					onClick={() => refetch()} 
					disabled={isLoading}
					className="w-full"
				>
					{isLoading ? 'Loading...' : 'Generate Report'}
				</Button>

				{metrics.length > 0 && (
					<div className="mt-4">
						<h3 className="text-lg font-semibold mb-2">Results</h3>
						<div className="space-y-2">
							{metrics.map((metric) => (
								<div
									key={metric.created_at}
									className="flex justify-between p-2 border rounded"
								>
									<span>
										{new Date(metric.created_at).toLocaleDateString()}
									</span>
									<span>{metric.metric_value}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
} 