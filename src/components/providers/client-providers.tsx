'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }): JSX.Element {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 3,
						retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
						refetchOnWindowFocus: false,
						staleTime: 1000 * 60 * 5, // 5 minutes
						onError: (error) => {
							console.error('Query error:', error);
						},
					},
					mutations: {
						retry: 2,
						retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
						onError: (error) => {
							console.error('Mutation error:', error);
						},
					},
				},
			})
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
