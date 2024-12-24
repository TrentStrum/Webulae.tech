import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
	const { userId, orgId } = auth();
	console.log('Admin Page: Initial render');
	console.log('Admin Page: Auth state:', { userId, orgId });

	if (!userId || !orgId) {
		console.log('Admin Page: Missing auth');
		redirect('/dashboard');
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Admin Dashboard</h1>
			{/* Admin content */}
		</div>
	);
}
