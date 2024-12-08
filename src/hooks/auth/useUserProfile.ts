import { useEffect, useState } from 'react';

import { getUserProfile } from '../../services/authServices';

import type { AuthUser } from '@/src/types/authUser.types';

export function useUserProfile(userId: string | null): {
	profile: Pick<AuthUser, 'role' | 'avatar_url'> | null;
	isPending: boolean;
} {
	const [profile, setProfile] = useState<Pick<AuthUser, 'role' | 'avatar_url'> | null>(null);
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		if (!userId) {
			setProfile(null);
			setIsPending(false);
			return;
		}

		const fetchProfile = async (): Promise<void> => {
			try {
				const profileData = await getUserProfile(userId);
				setProfile(
					profileData
						? {
								role: profileData.role,
								avatar_url: profileData.avatar_url || undefined,
							}
						: null
				);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			} finally {
				setIsPending(false);
			}
		};

		fetchProfile();
	}, [userId]);

	return { profile, isPending };
}
