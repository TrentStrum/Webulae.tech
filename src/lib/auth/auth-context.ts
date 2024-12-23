import type { Permission } from '../../types/permissions.types';
import type { Organization } from '@/src/types/organization.types';
import type { User } from '@clerk/nextjs/dist/types/server';

export interface AuthContextType {
	isLoading: boolean;
	user: User | null;
	organization: Organization | null;
	hasPermission: (permission: Permission) => boolean;
	isOrgAdmin: boolean;
	isOrgMember: boolean;
}
