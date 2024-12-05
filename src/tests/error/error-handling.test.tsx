import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorFallback } from '@/src/components/error/error-fallback';
import { useErrorHandler } from '@/src/hooks/helpers/use-error-handler';
import { ErrorMessage } from '@/src/components/forms/ErrorMessage';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Error Handling System', () => {
  describe('ErrorFallback Component', () => {
    it('displays error message and retry button', () => {
      const error = new Error('Test error message');
      const resetErrorBoundary = jest.fn();
      
      render(
        <ErrorFallback
          error={error}
          resetErrorBoundary={resetErrorBoundary}
        />
      );
      
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      
      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);
      expect(resetErrorBoundary).toHaveBeenCalled();
    });
  });

  describe('ErrorMessage Component', () => {
    it('renders with retry and dismiss options', () => {
      const onRetry = jest.fn();
      const onDismiss = jest.fn();
      
      render(
        <ErrorMessage
          title="Error Title"
          message="Error message"
          onRetry={onRetry}
          onDismiss={onDismiss}
        />
      );
      
      expect(screen.getByText('Error Title')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      
      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);
      expect(onRetry).toHaveBeenCalled();
      
      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('Error Handler Hook', () => {
    it('handles different error types appropriately', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      // Test 401 error
      result.current.handleError({ status: 401, message: 'Unauthorized' });
      expect(screen.getByText('Please log in to continue')).toBeInTheDocument();
      
      // Test 403 error
      result.current.handleError({ status: 403, message: 'Forbidden' });
      expect(screen.getByText('You do not have permission to perform this action')).toBeInTheDocument();
      
      // Test generic error
      result.current.handleError(new Error('Unknown error'));
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });
});