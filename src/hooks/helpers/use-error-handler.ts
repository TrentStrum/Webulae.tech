import { useRouter } from 'next/navigation';

import { useToast } from './use-toast';

type ErrorWithMessage = {
	message: string;
	status?: number;
	code?: string;
};

export function useErrorHandler(): { handleError: (error: unknown) => void } {
	const { toast } = useToast();
	const router = useRouter();

	const handleError = (error: unknown): void => {
		console.error('Error caught by handler:', error);

		const errorMessage = getErrorMessage(error);
		const statusCode = getErrorStatus(error);

		// Handle specific error cases
		switch (statusCode) {
			case 401:
				toast({
					title: 'Authentication Error',
					description: 'Please log in to continue',
					variant: 'destructive',
				});
				router.push('/auth/login');
				break;

			case 403:
				toast({
					title: 'Access Denied',
					description: 'You do not have permission to perform this action',
					variant: 'destructive',
				});
				router.push('/');
				break;

			case 404:
				toast({
					title: 'Not Found',
					description: errorMessage || 'The requested resource was not found',
					variant: 'destructive',
				});
				break;

			default:
				toast({
					title: 'Error',
					description: errorMessage || 'An unexpected error occurred',
					variant: 'destructive',
				});
		}
	};

	return { handleError };
}

// Helper functions to safely extract error information
function getErrorMessage(error: unknown): string {
	if (typeof error === 'string') return error;
	if (isErrorWithMessage(error)) return error.message;
	return 'An unexpected error occurred';
}

function getErrorStatus(error: unknown): number | undefined {
	if (isErrorWithMessage(error) && 'status' in error) {
		return Number(error.status);
	}
	return undefined;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as Record<string, unknown>).message === 'string'
	);
}
