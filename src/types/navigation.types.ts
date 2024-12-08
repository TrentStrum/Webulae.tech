import type { AuthUser } from './authUser.types';

export type NavigationGuard = (user: AuthUser | null) => boolean;

export type NavigationItem = {
	name: string;
	href: string;
};

export type NavigationOptions = {
	navigationItems: NavigationItem[];
	isActive: (href: string) => boolean;
};
