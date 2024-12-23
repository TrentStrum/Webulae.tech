import { usePermissions } from '@/src/hooks/auth/usePermissions';

import type { Permission } from '@/src/types/permissions.types';
import type { ReactNode } from 'react';

interface PermissionGateProps {
  children: ReactNode;
  permission: Permission;
  fallback?: ReactNode;
}

export function PermissionGate({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGateProps): JSX.Element | null {
  const { can } = usePermissions();

  if (!can(permission)) {
    return fallback as JSX.Element | null;
  }

  return <>{children}</>;
} 