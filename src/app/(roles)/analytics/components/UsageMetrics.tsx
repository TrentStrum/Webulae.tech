'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { supabase } from '@/src/lib/supabase/server';

import type { Metric } from '@/src/types/analytics.types';

interface UsageMetricsProps {
	organizationId: string;
}

export function UsageMetrics({ organizationId }: UsageMetricsProps) {
	const [metrics, setMetrics] = useState<Metric[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchMetrics() {
			try {
				const { data } = await supabase
					.from('usage_metrics')
					.select('*')
					.eq('organization_id', organizationId)
					.order('created_at', { ascending: false })
					.limit(10);

				setMetrics(data || []);
			} catch (error) {
				console.error('Error fetching metrics:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchMetrics();
	}, [organizationId]);

	if (isLoading) {
		return <div>Loading metrics...</div>;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>API Calls</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{metrics
							.filter((m) => m.metric_type === 'api_call')
							.reduce((acc, curr) => acc + curr.metric_value, 0)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Active Users</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{metrics
							.filter((m) => m.metric_type === 'active_users')
							.reduce((acc, curr) => acc + curr.metric_value, 0)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Storage Used</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{metrics
							.filter((m) => m.metric_type === 'storage')
							.reduce((acc, curr) => acc + curr.metric_value, 0)}{' '}
						MB
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
