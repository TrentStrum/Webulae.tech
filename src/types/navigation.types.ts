import type { UserResource } from '@clerk/types';

export type NavigationGuard = (user: UserResource | null | undefined) => boolean;

export interface NavigationItem {
	name: string;
	href: string;
}

export interface NavigationOptions {
	navigationItems: NavigationItem[];
	isActive: (href: string) => boolean;
}
