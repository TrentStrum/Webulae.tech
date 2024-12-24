import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
	afterAuth(auth, req) {
		const publicRoutes = [
			'/',
			'/about',
			'/blog(.*)',
			'/contact',
			'/sign-in(.*)',
			'/sign-up(.*)',
			'/organization/select',
			'/organization/create',
			'/api/webhooks(.*)',
			'/(landing)(.*)'
		];

		console.log('Middleware: Auth state -', {
			userId: auth.userId,
			orgId: auth.orgId,
			orgRole: auth.orgRole,
			path: req.nextUrl.pathname
		});

		// If authenticated and on root, dashboard, or projects, redirect based on role
		if (auth.userId && auth.orgId && auth.orgRole && 
			(req.nextUrl.pathname === '/' || 
			 req.nextUrl.pathname === '/dashboard' ||
			 req.nextUrl.pathname === '/projects')) {
			switch (auth.orgRole) {
				case 'org:admin':
					return NextResponse.redirect(new URL('/admin/dashboard', req.url));
				case 'org:developer':
					return NextResponse.redirect(new URL('/developer/dashboard', req.url));
				case 'org:member':
					return NextResponse.redirect(new URL('/client/dashboard', req.url));
				default:
					return NextResponse.redirect(new URL('/client/dashboard', req.url));
			}
		}

		// Handle public routes in (landing)
		if (req.nextUrl.pathname.startsWith('/(landing)')) {
			return NextResponse.next();
		}

		// If not authenticated, only allow public routes
		if (!auth.userId) {
			const isPublicRoute = publicRoutes.some(pattern => 
				req.nextUrl.pathname.match(new RegExp(`^${pattern}`))
			);
			
			if (!isPublicRoute) {
				return NextResponse.redirect(new URL('/sign-in', req.url));
			}
			return NextResponse.next();
		}

		// If authenticated but no org selected, redirect to org select
		if (auth.userId && !auth.orgId && 
			!req.nextUrl.pathname.startsWith('/organization')) {
			return NextResponse.redirect(new URL('/organization/select', req.url));
		}

		// Handle role-based routing and protection
		if (auth.userId && auth.orgId && auth.orgRole) {
			const path = req.nextUrl.pathname;

			// Protect admin routes
			if (path.startsWith('/admin') && auth.orgRole !== 'org:admin') {
				return NextResponse.redirect(new URL('/dashboard', req.url));
			}

			// Protect developer routes
			if (path.startsWith('/developer') && auth.orgRole !== 'org:developer') {
				return NextResponse.redirect(new URL('/dashboard', req.url));
			}

			// Protect blog management routes
			if (path.startsWith('/blog/manage') && auth.orgRole !== 'org:admin') {
				return NextResponse.redirect(new URL('/blog', req.url));
			}

			// Role-based dashboard routing
			if (path === '/dashboard') {
				const dashboardRoutes = {
					'org:admin': '/admin/dashboard',
					'org:developer': '/developer/dashboard',
					'org:member': '/client/dashboard'
				};
				const redirectUrl = dashboardRoutes[auth.orgRole as keyof typeof dashboardRoutes] || '/client/dashboard';
				return NextResponse.redirect(new URL(redirectUrl, req.url));
			}
		}

		return NextResponse.next();
	},

	publicRoutes: [
		'/',
		'/about',
		'/blog(.*)',
		'/contact',
		'/sign-in(.*)',
		'/sign-up(.*)',
		'/organization/select',
		'/organization/create',
		'/api/webhooks(.*)',
		'/(landing)(.*)'
	]
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
