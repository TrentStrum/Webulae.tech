import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
	'/',
	'/about',
	'/blog(.*)',
	'/services',
	'/contact',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api/webhooks(.*)',
	'/api/blog(.*)',
	'/sso-callback',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isDeveloperRoute = createRouteMatcher(['/developer(.*)']);
const isClientRoute = createRouteMatcher(['/client(.*)']);
const isOrgSettingsRoute = createRouteMatcher(['/organization/settings(.*)']);

export default clerkMiddleware(async (auth, request) => {
	// Check public routes
	if (isPublicRoute(request)) {
		return NextResponse.next();
	}

	const { userId, redirectToSignIn, orgRole, orgId } = await auth();

	if (!userId) {
		return redirectToSignIn();
	}

	// Organization settings checks
	if (isOrgSettingsRoute(request)) {
		if (!orgId) {
			return NextResponse.redirect(new URL('/select-organization', request.url));
		}

		if (!(orgRole === 'org:admin' || orgRole === 'org:developer')) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	}

	// Role-based route checks
	if (isAdminRoute(request) && orgRole !== 'org:admin') {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (isDeveloperRoute(request) && !(orgRole === 'org:developer' || orgRole === 'org:admin')) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (isClientRoute(request) && !(orgRole === 'org:member' || orgRole === 'org:developer' || orgRole === 'org:admin')) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		// Add your matchers but exclude API routes
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
