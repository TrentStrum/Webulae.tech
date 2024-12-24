'use client';

import { OrganizationSwitcher } from '@/src/components/organizations/OrganizationSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { RoleSettings } from '@/src/components/user/RoleSettings';
import { UserSettings } from '@/src/components/user/UserSettings';

export default function ProfilePage() {
	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
			
			<div className="mb-6">
				<OrganizationSwitcher />
			</div>

			<Tabs defaultValue="profile">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="role">Role & Permissions</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<UserSettings />
				</TabsContent>

				<TabsContent value="role">
					<RoleSettings />
				</TabsContent>
			</Tabs>
		</div>
	);
}
