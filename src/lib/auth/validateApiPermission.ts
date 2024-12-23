import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { hasPermission } from './permissions';

import type { Permission } from './permissions';

export async function validateApiPermission(permission: Permission): Promise<Response | null> {
  const { userId, orgId, orgRole } = auth();

  if (!userId || !orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!orgRole) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!hasPermission(orgRole, permission)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return null; // No error, proceed with request
} 