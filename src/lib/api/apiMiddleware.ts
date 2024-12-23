import { auth } from '@clerk/nextjs';

import { rateLimit } from './rate-limit';

import type { NextRequest } from 'next/server';

export interface APIMiddlewareOptions {
	rateLimit?: boolean;
	cache?: {
		maxAge: number;
		staleWhileRevalidate?: number;
	};
}

export async function apiMiddleware(
	req: NextRequest, 
	options: APIMiddlewareOptions = {}
): Promise<{ userId: string | null; orgId: string | null }> {
	const { rateLimit: shouldRateLimit = true, cache } = options;

	// Rate limiting
	if (shouldRateLimit) {
		const ip = req.ip ?? '127.0.0.1';
		await rateLimit(`${req.method}_${req.nextUrl.pathname}_${ip}`);
	}

	// Cache control headers
	if (cache) {
		const { maxAge, staleWhileRevalidate = 0 } = cache;
		const cacheHeader = `max-age=${maxAge}${
			staleWhileRevalidate ? `, stale-while-revalidate=${staleWhileRevalidate}` : ''
		}`;
		req.headers.set('Cache-Control', cacheHeader);
	}

	// Auth is already handled by the main middleware
	const { userId, orgId } = auth();
	return { userId: userId ?? null, orgId: orgId ?? null };
}
