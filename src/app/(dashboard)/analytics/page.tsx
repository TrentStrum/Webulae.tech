'use client';

import { useOrganization } from '@clerk/nextjs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

import { CustomReports } from '@/src/app/(dashboard)/analytics/components/CustomReports';
import { OrganizationInsights } from '@/src/app/(dashboard)/analytics/components/OrganizationInsights';
import { UsageMetrics } from '@/src/app/(dashboard)/analytics/components/UsageMetrics';
import { UserActivity } from '@/src/app/(dashboard)/analytics/components/UserActivity';


export default function AnalyticsDashboard() {
	const { organization } = useOrganization();

	if (!organization) {
		return <div>Please select an organization</div>;
	}

	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

			<Tabs defaultValue="usage">
				<TabsList>
					<TabsTrigger value="usage">Usage Metrics</TabsTrigger>
					<TabsTrigger value="activity">User Activity</TabsTrigger>
					<TabsTrigger value="insights">Organization Insights</TabsTrigger>
					<TabsTrigger value="reports">Custom Reports</TabsTrigger>
				</TabsList>

				<TabsContent value="usage">
					<UsageMetrics organizationId={organization.id} />
				</TabsContent>

				<TabsContent value="activity">
					<UserActivity organizationId={organization.id} />
				</TabsContent>

				<TabsContent value="insights">
					<OrganizationInsights organizationId={organization.id} />
				</TabsContent>

				<TabsContent value="reports">
					<CustomReports organizationId={organization.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
