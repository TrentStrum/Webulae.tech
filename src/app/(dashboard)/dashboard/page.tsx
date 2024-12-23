import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { InviteForm } from '@/src/components/invitations/InviteForm';
import { hasPermission } from '@/src/lib/auth/permissions';


export default async function DashboardPage() {
	const { userId, orgId, orgRole } = await auth();

	if (!userId || !orgId) {
		redirect('/select-organization');
	}

	const canInviteUsers = hasPermission(orgRole, 'users:write');

	return (
		<div className="space-y-6">
			<h1>Dashboard</h1>

			{canInviteUsers && (
				<div className="bg-white p-6 rounded-lg shadow">
					<InviteForm />
				</div>
			)}
		</div>
	);
}
