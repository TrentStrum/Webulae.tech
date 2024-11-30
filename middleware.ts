import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/src/types/database.types';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
	'/login',
	'/register',
	'/reset-password',
	'/auth',
	'/',
	'/blog',
	'/contact',
	'/about',
];

// Routes that require specific roles
const ROLE_ROUTES = {
	admin: ['/admin', '/admin/dashboard'],
	developer: ['/developer', '/developer/dashboard', '/projects'],
	client: ['/client', '/client/dashboard', '/projects'],
} as const;

// Add default redirects for each role
const DEFAULT_ROLE_REDIRECTS = {
	admin: '/admin/dashboard',
	developer: '/developer/dashboard',
	client: '/client/dashboard',
} as const;

export async function middleware(req: NextRequest) {
	// Create a response object that we can modify
	const res = NextResponse.next();

	// Initialize the Supabase client
	const supabase = createMiddlewareClient<Database>({ req, res });

	// Get the pathname
	const path = req.nextUrl.pathname;

	// Check if the route is public
	if (PUBLIC_ROUTES.some((route) => path.startsWith(route))) {
		return res;
	}

	// Check if path is for static files
	if (path.includes('_next') || path.includes('static') || path.includes('favicon.ico')) {
		return res;
	}

	// Refresh session if expired - required for Server Components
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Redirect to login if no session and trying to access protected route
	if (!session) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	// After successful authentication, redirect to role-specific dashboard
	if (path === '/login' && session) {
		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', session.user.id)
			.single();

		const userRole = profile?.role || 'client';
		const redirectPath = DEFAULT_ROLE_REDIRECTS[userRole as keyof typeof DEFAULT_ROLE_REDIRECTS];
		return NextResponse.redirect(new URL(redirectPath, req.url));
	}

	// If we have a session, check role-based access
	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	const userRole = profile?.role || 'client';

	// Check if user is trying to access a role-restricted route
	for (const [role, paths] of Object.entries(ROLE_ROUTES)) {
		if (paths.some((p) => path.startsWith(p))) {
			// If user's role doesn't match the required role, redirect to home
			if (userRole !== role) {
				return NextResponse.redirect(new URL('/', req.url));
			}
			break;
		}
	}

	// Add role to request headers for use in API routes
	res.headers.set('x-user-role', userRole);

	return res;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!_next/static|_next/image|favicon.ico|public/).*)',
	],
};
