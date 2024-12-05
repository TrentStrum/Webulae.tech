```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { supabase } from '@/src/lib/supabase';

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      // Clear Supabase session
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });

      // Clear React Query cache
      queryClient.clear();

      // Clear any OAuth tokens
      if (window.opener) {
        window.opener.postMessage({ type: 'logout' }, '*');
      }
    },
    onSuccess: () => {
      // Invalidate and remove all queries
      queryClient.removeQueries();
      
      toast({
        title: 'Logged out successfully',
        description: 'You have been securely logged out.',
      });

      // Redirect to login page
      router.push('/auth/login');
      router.refresh();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    },
  });
}
```