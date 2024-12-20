import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ClientDashboard() {
	const { orgRole } = await auth();

	if (orgRole !== 'org:member') {
		redirect('/dashboard');
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Client Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Client-specific widgets */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="font-semibold mb-4">My Projects</h2>
					{/* Projects content */}
				</div>

				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="font-semibold mb-4">Support</h2>
					{/* Support content */}
				</div>
			</div>
		</div>
	);
}
