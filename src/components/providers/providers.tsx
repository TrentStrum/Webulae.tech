'use client';

import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 3,
						retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
						refetchOnWindowFocus: false,
						staleTime: 1000 * 60 * 5,
					},
					mutations: {
						retry: 2,
						retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
					},
				},
			})
	);

	return (
		<ClerkProvider 
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
			routerPush={(to) => router.push(to)} 
			routerReplace={(to) => router.replace(to)}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ClerkProvider>
	);
}
