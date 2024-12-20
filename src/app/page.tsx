import { auth } from '@clerk/nextjs/server';

import { Features } from '@/src/components/sections/features';
import { Hero } from '@/src/components/sections/hero';
import { Pricing } from '@/src/components/sections/pricing';
import { HeroSkeleton } from '@/src/components/skeletons/hero-skeleton';

import AdminDashboard from './admin/dashboard/page';
import ClientDashboard from './client/dashboard/page';
import DeveloperDashboard from './developer/dashboard/page';

export default async function Home() {
	const { userId, orgRole } = await auth();

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
