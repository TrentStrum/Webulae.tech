import { HomeIcon, ListIcon, PlusIcon, SettingsIcon, ShieldIcon, UsersIcon , FolderIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { NavItem } from '@/src/components/navigation/nav-item';
import { useAuth } from '@/src/contexts/auth-context';

import type { Permission } from '@/src/lib/auth/roles';
import type { NavItemType } from '@/src/types/nav-item.types';

const NAV_ITEMS: NavItemType[] = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: HomeIcon,
	},
	{
		label: 'Projects',
		href: '/projects',
		icon: FolderIcon,
		children: [
			{
				label: 'All Projects',
				href: '/projects',
				icon: ListIcon,
			},
			{
				label: 'Create Project',
				href: '/projects/new',
				icon: PlusIcon,
				permission: 'manage_projects' as Permission,
			},
		],
	},
	{
		label: 'Admin',
		href: '/admin',
		icon: ShieldIcon,
		permission: 'manage_users',
		children: [
			{
				label: 'Members',
				href: '/admin/members',
				icon: UsersIcon,
			},
			{
				label: 'Settings',
				href: '/admin/settings',
				icon: SettingsIcon,
			},
		],
	},
];

export function NavMenu() {
	const { hasPermission } = useAuth();
	const pathname = usePathname();

	const filterNavItems = (items: NavItemType[]): NavItemType[] => {
		return items.filter((item) => {
			if (item.permission && !hasPermission(item.permission)) {
				return false;
			}

			if (item.children) {
				const filteredChildren = filterNavItems(item.children);
				return filteredChildren.length > 0;
			}

			return true;
		});
	};

	const filteredItems = filterNavItems(NAV_ITEMS);

	return (
		<nav className="space-y-1">
			{filteredItems.map((item) => (
				<NavItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
			))}
		</nav>
	);
}
