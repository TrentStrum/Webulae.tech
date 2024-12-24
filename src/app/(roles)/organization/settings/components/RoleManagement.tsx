'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export function RoleManagement() {
	const roles = [
		{
			name: 'Admin',
			key: 'org:admin',
			description: 'Full access to all organization settings and member management',
		},
		{
			name: 'Developer',
			key: 'org:developer',
			description: 'Access to development tools and limited organization settings',
		},
		{
			name: 'Client',
			key: 'org:member',
			description: 'Basic access to organization resources',
		},
	];

	return (
		<div className="space-y-6">
			{roles.map((role) => (
				<Card key={role.key}>
					<CardHeader>
						<CardTitle>{role.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">{role.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
