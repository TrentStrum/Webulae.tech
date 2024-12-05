'use client';

import { Hero } from '@/src/components/sections/hero';
import { Features } from '@/src/components/sections/features';
import { Pricing } from '@/src/components/sections/pricing';
import AdminDashboard from './admin/dashboard/page';
import DeveloperDashboard from './developer/dashboard/page';
import ClientDashboard from './client/dashboard/page';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Home() {
	const { data: session } = useAuth();

	if (session) {
		switch (session.role) {
			case 'admin':
				return (
					<main>
						<AdminDashboard />
					</main>
				);
			case 'developer':
				return (
					<main>
						<DeveloperDashboard />
					</main>
				);
			case 'client':
			default:
				return (
					<main>
						<ClientDashboard />
					</main>
				);
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
