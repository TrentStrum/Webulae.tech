'use client';

import { useAuth, useOrganization } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

import type {
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
	const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
	const { 
		organization, 
		membership,
		memberships,
		isLoaded: isOrgLoaded 
	} = useOrganization();

	const getNavigationItems = (): NavigationItem[] => {
		// Wait for both auth and org to load
		if (!isAuthLoaded || !isOrgLoaded) {
			return publicNavigation;
		}

		if (!isSignedIn) {
			return publicNavigation;
		}

		if (!memberships?.data) {
			return publicNavigation;
		}

		// Check if user has any organization memberships
		const membershipCount = memberships.data.length;

		// If user has memberships but no active organization
		if (membershipCount > 0 && !organization) {
			return publicNavigation;
		}

		// If user has no memberships at all
		if (membershipCount === 0) {
			return clientNavigation;
		}
		
		const role = membership?.role;

		switch (role) {
			case 'org:admin':
				return adminNavigation;
			case 'org:developer':
				return developerNavigation;
			case 'org:member':
				return clientNavigation;
			default:
				return clientNavigation;
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

export type AuthGuard = (isAuthenticated: boolean) => boolean;

export function useNavigationGuard(path: string, guard: AuthGuard): void {
	const { isSignedIn } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	if (pathname === path) {
		const canAccess = guard(!!isSignedIn);
		if (!canAccess) {
			router.push('/');
		}
	}
}
