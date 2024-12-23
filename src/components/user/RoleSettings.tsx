'use client';

import { useOrganization } from '@clerk/nextjs';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { usePermissions } from '@/src/hooks/auth/usePermissions';

export function RoleSettings(): JSX.Element {
	const { organization, membership } = useOrganization();
	const { can } = usePermissions();

	if (!organization || !membership) return <></>;

	const permissions = [
		{ name: 'User Management', permission: 'users:write' },
		{ name: 'Settings Management', permission: 'settings:write' },
		{ name: 'Analytics Access', permission: 'analytics:read' },
		{ name: 'Billing Management', permission: 'billing:write' },
	] as const;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Role & Permissions</CardTitle>
				<CardDescription>
					Your current role is: <Badge variant="outline">{membership.role}</Badge>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<h3 className="text-sm font-medium">Your Permissions:</h3>
					<ul className="space-y-2">
						{permissions.map((item) => (
							<li key={item.permission} className="flex items-center gap-2">
								<Badge variant={can(item.permission) ? 'default' : 'secondary'}>
									{can(item.permission) ? '✓' : '×'}
								</Badge>
								{item.name}
							</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
