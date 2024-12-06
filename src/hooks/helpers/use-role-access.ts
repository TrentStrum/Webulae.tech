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

export const useRoleAccess = ({ allowedRoles, onAccessDenied }: UseRoleAccessProps) => {
	const router = useRouter();

	useEffect(() => {
		const checkAccess = async () => {
			try {
				const { profile } = await apiClient.get<ProfileResponse>('/auth/profile'); // Fetch the user profile

				if (!profile || !allowedRoles.includes(profile.role)) {
					onAccessDenied?.();
					router.push('/'); // Redirect to home if access is denied
				}
			} catch {
				router.push('/auth/login'); // Redirect to login if there's an error
			}
		};

		checkAccess();
	}, [allowedRoles, router, onAccessDenied]);
};
