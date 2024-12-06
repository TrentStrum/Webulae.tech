import { useState, useCallback } from 'react';

interface RateLimitConfig {
	maxAttempts: number;
	timeWindow: number;
}

interface Attempt {
	timestamp: number;
}

export function useRateLimit(config: RateLimitConfig) {
	const [attempts, setAttempts] = useState<Attempt[]>([]);

	const checkRateLimit = useCallback(() => {
		const now = Date.now();
		const windowStart = now - config.timeWindow;

		// Clean up old attempts
		const recentAttempts = attempts.filter((attempt) => attempt.timestamp > windowStart);

		setAttempts(recentAttempts);

		// Check if we're over the limit
		if (recentAttempts.length >= config.maxAttempts) {
			const oldestAttempt = recentAttempts[0];
			const timeUntilReset = oldestAttempt.timestamp + config.timeWindow - now;
			return {
				allowed: false,
				timeUntilReset: Math.ceil(timeUntilReset / 1000),
			};
		}

		return { allowed: true, timeUntilReset: 0 };
	}, [attempts, config]);

	const recordAttempt = useCallback(() => {
		setAttempts((prev) => [...prev, { timestamp: Date.now() }]);
	}, []);

	return {
		checkRateLimit,
		recordAttempt,
	};
}
