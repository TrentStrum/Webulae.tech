import { useUser } from '@clerk/nextjs';

import { ROLE_PERMISSIONS, type Permission, type Role } from '@/src/lib/auth/roles';

interface ProtectedProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

export function Protected({ children, permission, fallback = null }: ProtectedProps): React.ReactNode {
  const { user } = useUser();
  const role = user?.publicMetadata.role as Role;
  
  if (!role || !ROLE_PERMISSIONS[role]?.includes(permission)) {
    return fallback;
  }

  return children;
} 