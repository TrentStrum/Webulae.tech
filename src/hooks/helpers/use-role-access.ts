import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { apiClient } from '@/src/lib/apiClient';

interface UseRoleAccessProps {
	allowedRoles: string[]; // Roles allowed to access the page
	onAccessDenied?: () => void; // Optional callback for handling access denial
}

interface ProfileResponse {
	profile: {
		role: string;
	};
}

export const useRoleAccess = ({ allowedRoles, onAccessDenied }: UseRoleAccessProps): void => {
	const router = useRouter();

	useEffect(() => {
		const checkAccess = async (): Promise<void> => {
			try {
				const { profile } = await apiClient.get<ProfileResponse>('/auth/profile');

				if (!profile || !allowedRoles.includes(profile.role)) {
					onAccessDenied?.();
					router.push('/');
				}
			} catch {
				router.push('/auth/login');
			}
		};

		checkAccess();
	}, [allowedRoles, router, onAccessDenied]);
};
