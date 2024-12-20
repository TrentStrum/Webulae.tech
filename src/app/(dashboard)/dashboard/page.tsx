import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { InviteForm } from '@/src/components/invitations/InviteForm';

export default async function DashboardPage() {
	const { userId, orgId, orgRole } = await auth();
	const user = await currentUser();

	if (!userId || !orgId) {
		redirect('/select-organization');
	}

	return (
		<div className="space-y-6">
			<h1>Welcome, {user?.firstName}!</h1>

			{/* Only show invite form to admins/professionals */}
			{(orgRole === 'org:admin' || orgRole === 'org:developer') && (
				<div className="bg-white p-6 rounded-lg shadow">
					<InviteForm />
				</div>
			)}
		</div>
	);
}
