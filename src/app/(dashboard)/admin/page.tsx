import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { hasPermission } from '@/src/lib/auth/permissions';

export default async function AdminDashboard() {
	const { orgRole } = await auth();

	if (!hasPermission(orgRole ?? null, 'users:write')) {
		redirect('/dashboard');
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Admin Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Admin-specific widgets */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="font-semibold mb-4">User Management</h2>
					{/* User management content */}
				</div>

				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="font-semibold mb-4">Organization Settings</h2>
					{/* Settings content */}
				</div>

				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="font-semibold mb-4">Billing Overview</h2>
					{/* Billing content */}
				</div>
			</div>
		</div>
	);
}
