import { useEffect, useState } from 'react';

import { getUserProfile } from '../../services/authServices';

import type { AuthUser } from '../../types/authUser.types';

export function useUserProfile(userId: string | null) {
	const [profile, setProfile] = useState<Pick<AuthUser, 'role' | 'avatar_url'> | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) {
			setProfile(null);
			setLoading(false);
			return;
		}

		const fetchProfile = async () => {
			try {
				const profile = await getUserProfile(userId);
				setProfile(profile);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId]);

	return { profile, loading };
}
