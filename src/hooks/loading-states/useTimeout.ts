import { useEffect, useRef, useCallback } from 'react';

interface TimeoutOptions {
	onTimeout: () => void;
	duration?: number;
	resetOnChange?: boolean;
}

interface TimeoutControls {
	set: () => void;
	clear: () => void;
	reset: () => void;
}

export function useTimeout({
	onTimeout,
	duration = 30000, // 30 seconds default
	resetOnChange = true,
}: TimeoutOptions): TimeoutControls {
	const timeoutRef = useRef<NodeJS.Timeout>();

	const clear = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	}, []);

	const set = useCallback(() => {
		clear();
		timeoutRef.current = setTimeout(onTimeout, duration);
	}, [clear, duration, onTimeout]);

	useEffect(() => {
		if (resetOnChange) {
			set();
		}
		return clear;
	}, [clear, set, resetOnChange]);

	return {
		set,
		clear,
		reset: set,
	};
}
