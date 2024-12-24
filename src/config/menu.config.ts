import { BarChart, Mail, Settings, User, Users } from 'lucide-react';

import type { Permission } from '@/src/types/permissions.types';

export interface MenuItem {
	name: string;
	href: string;
	icon: React.ElementType;
	permission: Permission;
	badge?: string;
}

export const menuItems: MenuItem[] = [
	{
		name: 'Profile',
		href: '/profile',
		icon: User,
		permission: 'settings:read' as const,
	},
	{
		name: 'Settings',
		href: '/settings',
		icon: Settings,
		permission: 'settings:write' as const,
	},
	{
		name: 'User Management',
		href: '/admin/users',
		icon: Users,
		permission: 'users:write' as const,
		badge: 'Admin',
	},
	{
		name: 'Analytics',
		href: '/admin/analytics',
		icon: BarChart,
		permission: 'analytics:read' as const,
		badge: 'Pro',
	},
	{
		name: 'Invite Members',
		href: '/members/invite',
		icon: Mail,
		permission: 'members:invite',
	},
];
