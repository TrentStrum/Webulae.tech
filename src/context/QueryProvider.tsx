'use client';

import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './QueryClient';
import { ReactNode } from 'react';
import { ErrorBoundary } from '@/src/components/error-boundary';

export function QueryProvider({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary>
			<ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
		</ErrorBoundary>
	);
}