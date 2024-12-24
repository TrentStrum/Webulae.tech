import { auth } from '@clerk/nextjs/server';

import { Features } from '@/src/components/sections/features';
import { Hero } from '@/src/components/sections/hero';
import { Pricing } from '@/src/components/sections/pricing';

import AdminDashboardPage from './(roles)/admin/dashboard/page';
import ClientDashboardPage from './(roles)/client/dashboard/page';
import DeveloperDashboardPage from './(roles)/developer/dashboard/page';

export default async function Home() {
	const { userId, sessionClaims } = await auth();
	const orgRole = sessionClaims?.membership;

	// If user is authenticated and has a role, show their dashboard
	if (userId && orgRole) {
		switch (orgRole) {
			case 'org:admin':
				return <AdminDashboardPage />;
			case 'org:developer':
				return <DeveloperDashboardPage />;
			case 'org:member':
			default:
				return <ClientDashboardPage />;
		}
	}

	// For unauthenticated users or users without roles, show public landing page
	return (
		<main>
			<Hero />
			<Features />
			<Pricing />
		</main>
	);
}
