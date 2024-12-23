import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="p-4">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <pre className="mt-2 text-sm text-red-500">{error.message}</pre>
          <button
            onClick={resetErrorBoundary}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
} 