'use client';

import { useEffect } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error to your error reporting service
    console.error('Error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background border rounded-lg p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="space-x-4">
          <Button onClick={() => router.push('/')}>Go Home</Button>
          <Button variant="outline" onClick={resetErrorBoundary}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}