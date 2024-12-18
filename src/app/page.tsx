'use client';

import { useUser } from '@clerk/nextjs';

import { Features } from '@/src/components/sections/features';
import { Hero } from '@/src/components/sections/hero';
import { Pricing } from '@/src/components/sections/pricing';

import AdminDashboard from './admin/dashboard/page';
import ClientDashboard from './client/dashboard/page';
import DeveloperDashboard from './developer/dashboard/page';

export default function Home() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) return null;

	if (user?.publicMetadata?.role) {
		const role = user.publicMetadata.role as string;
		switch (role) {
			case 'admin':
				return <AdminDashboard />;
			case 'developer':
				return <DeveloperDashboard />;
			case 'client':
			default:
				return <ClientDashboard />;
		}
	}

	return (
		<main>
			<Hero />
			<Features />
			<Pricing />
		</main>
	);
}
