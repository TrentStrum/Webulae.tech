import { QueryClient } from '@tanstack/react-query';

// Cache configuration
const CACHE_TIME = 1000 * 60 * 5; // 5 minutes
const STALE_TIME = 1000 * 30; // 30 seconds

// Create and configure query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Cache prefetching utilities
export const cachePrefetch = {
  user: async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
      staleTime: CACHE_TIME,
    });
  },

  projects: async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['projects', userId],
      queryFn: () => fetch(`/api/users/${userId}/projects`).then(res => res.json()),
      staleTime: CACHE_TIME,
    });
  },

  subscriptions: async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['subscriptions', userId],
      queryFn: () => fetch(`/api/users/${userId}/subscriptions`).then(res => res.json()),
      staleTime: CACHE_TIME,
    });
  },
};