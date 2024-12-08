'use client';

import { Features } from '@/src/components/sections/features';
import { Hero } from '@/src/components/sections/hero';
import { Pricing } from '@/src/components/sections/pricing';
import { useAuth } from '@/src/contexts/AuthContext';

import AdminDashboard from './admin/dashboard/page';
import ClientDashboard from './client/dashboard/page';
import DeveloperDashboard from './developer/dashboard/page';

export default function Home() {
	const { user } = useAuth();

	if (user) {
		switch (user.role) {
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
