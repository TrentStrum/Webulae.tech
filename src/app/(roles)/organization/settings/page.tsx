'use client';

import { useOrganization } from '@clerk/nextjs';

import { MembersTable } from '@/src/app/(dashboard)/organization/settings/components/MembersTable';
import { OrganizationProfile } from '@/src/app/(dashboard)/organization/settings/components/OrganizationProfile';
import { ErrorBoundary } from '@/src/components/error-boundary/ErrorBoundary';
import { LoadingSpinner } from '@/src/components/loading/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';

import { RoleManagement } from './components/RoleManagement';

export default function OrganizationSettingsPage() {
	const { isLoaded } = useOrganization();

	if (!isLoaded) {
		return <LoadingSpinner />;
	}

	return (
		<ErrorBoundary
			fallback={<div>Something went wrong loading organization settings.</div>}
		>
			<div className="container mx-auto py-6">
				<h1 className="text-2xl font-bold mb-6">Organization Settings</h1>

				<Tabs defaultValue="profile">
					<TabsList>
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="members">Members</TabsTrigger>
						<TabsTrigger value="roles">Roles</TabsTrigger>
					</TabsList>

					<TabsContent value="profile">
						<OrganizationProfile />
					</TabsContent>

					<TabsContent value="members">
						<MembersTable />
					</TabsContent>

					<TabsContent value="roles">
						<RoleManagement />
					</TabsContent>
				</Tabs>
			</div>
		</ErrorBoundary>
	);
}
