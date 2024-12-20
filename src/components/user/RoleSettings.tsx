'use client';

import { useOrganization } from '@clerk/nextjs';

import { Card, CardHeader, CardContent, CardTitle } from '@/src/components/ui/card';
import { usePermissions } from '@/src/hooks/usePermissions';

export function RoleSettings() {
	const { organization } = useOrganization();
	const { role, can } = usePermissions();

	const roleCapabilities = {
		'org:admin': [
			'Manage organization settings',
			'Invite and remove members',
			'Access billing and subscription',
			'View all reports and analytics',
		],
		'org:developer': ['Access development tools', 'View team members', 'Access basic reports'],
		'org:member': ['Access basic dashboard', 'View own profile', 'Submit support requests'],
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Role & Permissions</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<h3 className="font-medium">Current Role</h3>
						<p className="text-sm text-gray-600">{role || 'No role assigned'}</p>
					</div>

					<div>
						<h3 className="font-medium mb-2">Your Capabilities</h3>
						<ul className="list-disc list-inside space-y-1">
							{roleCapabilities[role as keyof typeof roleCapabilities]?.map((capability) => (
								<li key={capability} className="text-sm text-gray-600">
									{capability}
								</li>
							))}
						</ul>
					</div>

					{can('manage:settings') && (
						<div className="mt-6">
							<h3 className="font-medium mb-2">Organization</h3>
							<p className="text-sm text-gray-600">
								{organization?.name} ({organization?.id})
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
