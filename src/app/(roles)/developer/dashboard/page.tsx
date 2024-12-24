import { redirect } from 'next/navigation';

import { hasPermission } from '@/src/lib/permissions';

import type { Permission } from '@/src/lib/permissions';


export default async function DeveloperDashboardPage(): Promise<JSX.Element> {
	const orgRole = 'org:developer';

	if (!hasPermission(orgRole ?? null, 'developer:access' as Permission)) {
		redirect('/dashboard');
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-6">Developer Dashboard</h1>
			{/* Add developer-specific content here */}
		</div>
	);
} 