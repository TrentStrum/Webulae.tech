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
	'/api/webhooks/clerk',
	'/api/blog(.*)',
	'/sso-callback',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isDeveloperRoute = createRouteMatcher(['/developer(.*)']);
const isClientRoute = createRouteMatcher(['/client(.*)']);


export default clerkMiddleware(async (auth, request) => {


	// Check public routes
	if (isPublicRoute(request)) {
		return NextResponse.next();
	}

	const { userId, redirectToSignIn, orgRole } = await auth();

	if (!userId) {
		return redirectToSignIn();
	}

	if (isAdminRoute(request) && orgRole !== 'org:admin') {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if ((isDeveloperRoute(request) && orgRole !== 'org:developer') || 'org:admin') {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if ((isClientRoute(request) && orgRole !== 'org:member') || 'org:developer' || 'org:admin') {
		return NextResponse.redirect(new URL('/', request.url));
	}
});

export const config = {
	matcher: [
		// Add your matchers but exclude API routes
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
