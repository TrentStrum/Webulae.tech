import { useUser, useOrganization } from '@clerk/nextjs';
import { createContext, useContext, useCallback } from 'react';

import { ROLE_PERMISSIONS, type Permission } from '@/src/lib/auth/roles';

interface AuthContextType {
	isLoading: boolean;
	user: ReturnType<typeof useUser>['user'];
	organization: ReturnType<typeof useOrganization>['organization'];
	hasPermission: (permission: Permission) => boolean;
	isOrgAdmin: boolean;
	isOrgMember: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const { user, isLoaded: userLoaded } = useUser();
	const { organization, isLoaded: orgLoaded } = useOrganization();

	const hasPermission = useCallback(
		(permission: Permission) => {
			const role = user?.publicMetadata.role as keyof typeof ROLE_PERMISSIONS;
			return role ? ROLE_PERMISSIONS[role].includes(permission as Permission) : false;
		},
		[user]
	);

	const isOrgAdmin = hasPermission('manage_users');
	const isOrgMember = !!organization?.id;

	return (
		<AuthContext.Provider
			value={{
				isLoading: !userLoaded || !orgLoaded,
				user: user ?? null,
				organization: organization ?? null,
				hasPermission,
				isOrgAdmin,
				isOrgMember,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};
