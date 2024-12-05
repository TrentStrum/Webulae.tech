```typescript
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useRouter } from 'next/navigation';

interface ErrorOptions {
  redirect?: string;
  showToast?: boolean;
  logError?: boolean;
}

type ErrorWithCode = {
  code?: string;
  status?: number;
  message: string;
};

export function useErrorHandler() {
  const { toast } = useToast();
  const router = useRouter();

  const handleError = (error: unknown, options: ErrorOptions = {}) => {
    const {
      redirect,
      showToast = true,
      logError = true,
    } = options;

    if (logError) {
      console.error('Error:', error);
    }

    const errorMessage = getErrorMessage(error);
    const errorCode = getErrorCode(error);

    if (showToast) {
      toast({
        title: getErrorTitle(errorCode),
        description: errorMessage,
        variant: 'destructive',
      });
    }

    if (redirect) {
      router.push(redirect);
    }

    // Handle specific error types
    switch (errorCode) {
      case 'UNAUTHORIZED':
      case 401:
        router.push('/auth/login');
        break;
      case 'FORBIDDEN':
      case 403:
        router.push('/');
        break;
      case 'NOT_FOUND':
      case 404:
        router.push('/404');
        break;
    }
  };

  return { handleError };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (isErrorWithCode(error)) return error.message;
  return 'An unexpected error occurred';
}

function getErrorCode(error: unknown): string | number | undefined {
  if (isErrorWithCode(error)) {
    return error.code || error.status;
  }
  return undefined;
}

function getErrorTitle(code: string | number | undefined): string {
  switch (code) {
    case 'UNAUTHORIZED':
    case 401:
      return 'Authentication Required';
    case 'FORBIDDEN':
    case 403:
      return 'Access Denied';
    case 'NOT_FOUND':
    case 404:
      return 'Not Found';
    case 'VALIDATION_ERROR':
      return 'Validation Error';
    default:
      return 'Error';
  }
}

function isErrorWithCode(error: unknown): error is ErrorWithCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || 'status' in error) &&
    'message' in error &&
    typeof error.message === 'string'
  );
}
```