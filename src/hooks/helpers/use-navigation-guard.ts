'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/src/contexts/AuthContext';

import { useToast } from './use-toast';

interface NavigationGuardProps {
  allowedRoles?: string[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function useNavigationGuard({
  allowedRoles = [],
  requireAuth = true,
  redirectTo = '/auth/login',
}: NavigationGuardProps = {}) {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;

    const handleNavigation = async () => {
      // Not authenticated but authentication required
      if (!user && requireAuth) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access this page',
          variant: 'destructive',
        });
        router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Role-based access check
      if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive',
        });
        router.push('/');
        return;
      }
    };

    handleNavigation();
  }, [user, isLoading, router, pathname, redirectTo, requireAuth, allowedRoles, toast]);

  return { isLoading, user };
}