import { useState } from 'react';

interface RateLimitConfig {
	limit: number;
	windowMs: number;
}

interface RateLimitAPI {
	increment: () => void;
	checkRateLimit: () => { allowed: boolean; timeUntilReset: number };
	reset: () => void;
}

export function useRateLimit(config: RateLimitConfig): RateLimitAPI {
	const [attempts, setAttempts] = useState<number>(0);
	const [windowStart, setWindowStart] = useState<number>(Date.now());

	const increment = (): void => {
		setAttempts((prev) => prev + 1);
	};

	const checkRateLimit = (): { allowed: boolean; timeUntilReset: number } => {
		const now = Date.now();
		const timeElapsed = now - windowStart;
		
		if (timeElapsed > config.windowMs) {
			setAttempts(0);
			setWindowStart(now);
			return { allowed: true, timeUntilReset: 0 };
		}

		return {
			allowed: attempts < config.limit,
			timeUntilReset: config.windowMs - timeElapsed
		};
	};

	const reset = (): void => {
		setAttempts(0);
		setWindowStart(Date.now());
	};

	return { increment, checkRateLimit, reset };
} 