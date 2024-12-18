'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useAuthState } from '../../hooks/auth/useAuthState';

import type {
	NavigationGuard,
	NavigationOptions,
	NavigationItem,
} from '@/src/types/navigation.types';

// Public navigation items shown to non-authenticated users
const publicNavigation: NavigationItem[] = [
	{ name: 'About', href: '/about' },
	{ name: 'Blog', href: '/blog' },
	{ name: 'Services', href: '/services' },
	{ name: 'Contact', href: '/contact' },
];

// Navigation items for authenticated clients
const clientNavigation: NavigationItem[] = [
	{ name: 'Projects', href: '/projects' },
	{ name: 'Blog', href: '/blog' },
	{ name: 'Messages', href: '/messages' },
];

// Navigation items for developers
const developerNavigation: NavigationItem[] = [
	{ name: 'Projects', href: '/projects' },
	{ name: 'Tasks', href: '/tasks' },
	{ name: 'Documentation', href: '/docs' },
];

// Navigation items for admins
const adminNavigation: NavigationItem[] = [
	{ name: 'Dashboard', href: '/admin/dashboard' },
	{ name: 'Projects', href: '/admin/projects' },
	{ name: 'Users', href: '/admin/users' },
	{ name: 'Blog', href: '/admin/blog' },
];

export function useNavigation(): NavigationOptions {
	const pathname = usePathname();
	const { user } = useAuthState();

	const getNavigationItems = (): NavigationItem[] => {
		if (!user) return publicNavigation;

		switch (user.role) {
			case 'admin':
				return adminNavigation;
			case 'developer':
				return developerNavigation;
			case 'client':
				return clientNavigation;
			default:
				return publicNavigation;
		}
	};

	const isActive = (href: string): boolean => {
		// Exact match for home page
		if (href === '/') {
			return pathname === href;
		}

		// Special cases for admin routes
		if (href === '/admin') {
			// Only match exact /admin path, not sub-routes
			return pathname === '/admin';
		}

		if (href === '/admin/projects') {
			// Match exact /admin/projects or its sub-routes
			return pathname === '/admin/projects' || pathname.startsWith('/admin/projects/');
		}

		// For all other routes
		const pathParts = pathname.split('/').filter(Boolean);
		const hrefParts = href.split('/').filter(Boolean);

		// If href has more parts than the current path, it can't be active
		if (hrefParts.length > pathParts.length) {
			return false;
		}

		// Check if all href parts match the beginning of the path parts
		return hrefParts.every((part, i) => part === pathParts[i]);
	};

	return {
		navigationItems: getNavigationItems(),
		isActive,
	};
}

export function useNavigationGuard(path: string, guard: NavigationGuard): void {
	const { user } = useAuthState();
	const pathname = usePathname();
	const router = useRouter();

	// React Query will handle this automatically when the auth state changes
	if (pathname === path) {
		const canAccess = guard(user);
		if (!canAccess) {
			router.push('/');
		}
	}
}
