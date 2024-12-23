import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { APIError } from './error-handler';

interface RateLimitInfo {
  limit: number;
  reset: number;
  remaining: number;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function rateLimit(identifier: string): Promise<void> {
  const { success, reset } = await limiter.limit(identifier) as RateLimitInfo & { success: boolean };

  if (!success) {
    throw new APIError(
      `Too many requests. Try again in ${reset} seconds.`, 
      429
    );
  }
} 