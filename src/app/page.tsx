import { auth } from '@clerk/nextjs/server';

import AdminDashboard from '@/src/app/(dashboard)/admin/page';
import ClientDashboard from '@/src/app/(dashboard)/client/page';
import DeveloperDashboard from '@/src/app/(dashboard)/developer/page';
import { Features } from '@/src/components/sections/features';
import { Hero } from '@/src/components/sections/hero';
import { Pricing } from '@/src/components/sections/pricing';

export default async function Home() {
	const { userId, sessionClaims } = await auth();
	const orgRole = sessionClaims?.membership;

	// If user is authenticated and has a role, show their dashboard
	if (userId && orgRole) {
		switch (orgRole) {
			case 'org:admin':
				return <AdminDashboard />;
			case 'org:developer':
				return <DeveloperDashboard />;
			case 'org:member':
			default:
				return <ClientDashboard />;
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
