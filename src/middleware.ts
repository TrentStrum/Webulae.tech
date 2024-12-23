import { authMiddleware } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export default authMiddleware({
	async afterAuth(auth, req: NextRequest) {
		// Allow public access to blog API
		if (req.nextUrl.pathname.startsWith('/api/blog')) {
			return; // Allow the request to proceed
		}

		// Handle other private API routes
		if (!auth.userId && req.nextUrl.pathname.startsWith('/api')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check organization access
		if (auth.userId && req.nextUrl.pathname.startsWith('/api/organizations')) {
			const orgId = req.nextUrl.pathname.split('/')[3];
			const memberships = await clerkClient.organizations.getOrganizationMembershipList({
				organizationId: orgId,
			});

			if (!memberships.filter(m => m.publicUserData?.userId === auth.userId).length) {
				return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
			}
		}

		// Check permissions for protected routes
		if (auth.userId && req.nextUrl.pathname.startsWith('/api/admin')) {
			const user = await clerkClient.users.getUser(auth.userId);
			const role = user.publicMetadata.role as string;

			if (!role || !['admin'].includes(role)) {
				return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
			}
		}
	},
	publicRoutes: [
		"/", 
		"/api/webhooks(.*)",
		"/api/blog(.*)",
		"/blog(.*)",
	],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
