import { useCallback } from 'react';

import { useAuth } from '@/src/contexts/AuthContext';
import { cachePrefetch } from '@/src/lib/cache/queryCache';

export function usePrefetch() {
  const { data: user } = useAuth();

  const prefetchUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Prefetch critical user data in parallel
      await Promise.all([
        cachePrefetch.user(user.id),
        cachePrefetch.projects(user.id),
        cachePrefetch.subscriptions(user.id),
      ]);
    } catch (error) {
      console.error('Error prefetching user data:', error);
    }
  }, [user?.id]);

  return { prefetchUserData };
}