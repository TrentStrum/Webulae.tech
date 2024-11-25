'use client';

import { usePathname } from 'next/navigation';
import { useAuthState } from '../../hooks/auth/useAuthState';

// Public navigation items shown to non-authenticated users
const publicNavigation = [
	{ name: 'About', href: '/features/about' },
	{ name: 'Articles', href: '/features/articles' },
	{ name: 'Services', href: '/features/services' },
	{ name: 'Contact', href: '/features/contact' },
] as const;

// Navigation items for authenticated clients
const clientNavigation = [
	{ name: 'Projects', href: '/features/projects' },
	{ name: 'Articles', href: '/features/articles' },
	{ name: 'Messages', href: '/features/messages' },
] as const;

// Navigation items for developers
const developerNavigation = [
	{ name: 'Projects', href: '/features/projects' },
	{ name: 'Tasks', href: '/features/tasks' },
	{ name: 'Documentation', href: '/features/docs' },
] as const;

// Navigation items for admins
const adminNavigation = [
	{ name: 'Dashboard', href: '/features/admin' },
	{ name: 'Projects', href: '/features/admin/projects' },
	{ name: 'Users', href: '/features/admin/users' },
	{ name: 'Blog', href: '/features/blog/admin' },
] as const;

export function useNavigation() {
	const pathname = usePathname();
	const { user } = useAuthState();

	const getNavigationItems = () => {
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

	const isActive = (href: string) => {
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
