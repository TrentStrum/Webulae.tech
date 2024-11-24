import { useEffect, useState } from 'react';
import { getSession, getUserProfile, onAuthStateChange } from '../../services/authServices';
import { AuthUser } from '../../types/authUser.types';


export function useAuthState() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				// Fetch session
				const session = await getSession();

				if (session?.user) {
					const profile = await getUserProfile(session.user.id);
					if (profile) {
						setUser({
							id: session.user.id,
							email: session.user.email!,
							role: profile.role,
							avatar_url: profile.avatar_url,
						});
					}
				}
			} catch (error) {
				console.error('Error initializing auth state:', error);
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();

		// Listen to auth state changes
		const { data: subscription } = onAuthStateChange((session) => {
			if (session?.user) {
				getUserProfile(session.user.id).then((profile) => {
					if (profile) {
						setUser({
							id: session.user.id,
							email: session.user.email!,
							role: profile.role,
							avatar_url: profile.avatar_url,
						});
					}
				});
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		// Cleanup subscription on unmount
		return () => {
			subscription.subscription.unsubscribe();
			setUser(null);
			setLoading(false);
		};
	}, []);

	return { user, loading };
}
