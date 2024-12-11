'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/client';

export function useAuthListener() {
  const router = useRouter();
  
  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        } else if (event === 'SIGNED_IN') {
          router.push('/dashboard');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);
} 