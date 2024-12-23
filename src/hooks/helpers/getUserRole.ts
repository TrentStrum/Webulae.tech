// server/helpers/user.ts
import { auth } from '@clerk/nextjs/server';

import type { OrganizationCustomRoleKey } from '@clerk/types';

export async function getUserRole(): Promise<OrganizationCustomRoleKey | null> {
	const { orgRole } = await auth();
	return orgRole ?? 'org:member';
}   