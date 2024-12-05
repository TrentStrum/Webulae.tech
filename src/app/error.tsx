'use client';

import { useEffect } from 'react';
import { SupabaseError } from '@/src/components/error/SupabaseError';
import { ErrorFallback } from '@/src/components/error/error-fallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  // Handle Supabase-specific errors
  if (error.message.includes('Supabase')) {
    return <SupabaseError error={error} resetErrorBoundary={reset} />;
  }

  // Default error fallback
  return <ErrorFallback error={error} resetErrorBoundary={reset} />;
}