import type { ApiError } from '@/src/types/api.types';

export function isApiError(error: unknown): error is ApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		'message' in error &&
		'status' in error
	);
}

export function handleQueryError(error: unknown): ApiError {
	if (isApiError(error)) {
		return error;
	}

	// Handle unexpected errors
	console.error('Unexpected error:', error);
	return {
		code: 'UNKNOWN_ERROR',
		message: 'An unexpected error occurred',
		status: 500,
	};
}

export function useQueryErrorHandler(): { onError: (error: unknown) => void } {
	return {
		onError: (error: unknown) => {
			const apiError = handleQueryError(error);

			switch (apiError.code) {
				case 'UNAUTHORIZED':
					// Handle auth errors
					break;
				case 'FORBIDDEN':
					// Handle permission errors
					break;
				case 'NOT_FOUND':
					// Handle not found
					break;
				default:
					// Handle other errors
					break;
			}
		},
	};
}
