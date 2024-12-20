'use client';

import { Settings, Users, Home, BarChart, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { usePermissions } from '@/src/hooks/usePermissions';

export function DashboardNav() {
	const pathname = usePathname();
	const { can } = usePermissions();

	const navigation = [
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: Home,
			permission: 'view:dashboard' as const,
		},
		{
			name: 'Users',
			href: '/admin/users',
			icon: Users,
			permission: 'manage:users' as const,
		},
		{
			name: 'Reports',
			href: '/admin/reports',
			icon: BarChart,
			permission: 'view:reports' as const,
		},
		{
			name: 'Billing',
			href: '/organization/billing',
			icon: CreditCard,
			permission: 'manage:billing' as const,
		},
		{
			name: 'Settings',
			href: '/organization/settings',
			icon: Settings,
			permission: 'manage:settings' as const,
		},
	];

	const filteredNav = navigation.filter((item) => can(item.permission));

	return (
		<nav className="space-y-1">
			{filteredNav.map((item) => (
				<Link
					key={item.name}
					href={item.href}
					className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
						pathname === item.href
							? 'bg-gray-100 text-gray-900'
							: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
					}`}
				>
					<item.icon className="mr-3 h-5 w-5" />
					{item.name}
				</Link>
			))}
		</nav>
	);
}
