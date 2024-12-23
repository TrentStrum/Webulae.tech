'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/src/components/ui/table';
import { supabase } from '@/src/lib/supabase/config';

interface UserActivityProps {
	organizationId: string;
}

interface ActivityEvent {
	id: string;
	event_type: string;
	page_url: string;
	created_at: string;
	users?: {
		full_name: string;
		email: string;
	};
}

export function UserActivity({ organizationId }: UserActivityProps) {
	const [activities, setActivities] = useState<ActivityEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchActivities() {
			try {
				const { data } = await supabase
					.from('analytics_events')
					.select(
						`
            *,
            users:user_id (
              full_name,
              email
            )
          `
					)
					.eq('organization_id', organizationId)
					.order('created_at', { ascending: false })
					.limit(10);

				setActivities(data || []);
			} catch (error) {
				console.error('Error fetching activities:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchActivities();
	}, [organizationId]);

	if (isLoading) {
		return <div>Loading activities...</div>;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent User Activity</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Action</TableHead>
							<TableHead>Page</TableHead>
							<TableHead>Time</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{activities.map((activity) => (
							<TableRow key={activity.id}>
								<TableCell>{activity.users?.full_name}</TableCell>
								<TableCell>{activity.event_type}</TableCell>
								<TableCell>{activity.page_url}</TableCell>
								<TableCell>{new Date(activity.created_at).toLocaleString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
