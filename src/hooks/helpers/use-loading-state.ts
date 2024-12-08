import { useState, useCallback } from 'react';

interface LoadingState {
	isLoading: boolean;
	error: Error | null;
	setLoading: (loading: boolean) => void;
	setError: (error: Error | null) => void;
	startLoading: () => void;
	stopLoading: () => void;
	resetState: () => void;
}

export function useLoadingState(initialLoading = false): LoadingState {
	const [isLoading, setIsLoading] = useState(initialLoading);
	const [error, setError] = useState<Error | null>(null);

	const startLoading = useCallback((): void => {
		setIsLoading(true);
		setError(null);
	}, []);

	const stopLoading = useCallback((): void => {
		setIsLoading(false);
	}, []);

	const resetState = useCallback((): void => {
		setIsLoading(false);
		setError(null);
	}, []);

	return {
		isLoading,
		error,
		setLoading: setIsLoading,
		setError,
		startLoading,
		stopLoading,
		resetState,
	};
}
