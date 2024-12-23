import type { Permission } from '@/src/lib/auth/roles';

export type NavItemType = {
	label: string;
	href: string;
	icon: React.ComponentType;
	permission?: Permission;
	children?: NavItemType[];
};
