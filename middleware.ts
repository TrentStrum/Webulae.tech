import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
	'/',
	'/blog',
	'/contact',
	'/about',
	'/auth/login',
	'/auth/register',
	'/api/webhooks/clerk',
	'/sign-in(.*)',
	'/sign-up(.*)',
]);

export default clerkMiddleware((auth, request) => {
	if (!isPublicRoute(request)) {
		const session = auth();
		if (!session) {
			throw new Error('Unauthorized');
		}
	}
});

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
};
