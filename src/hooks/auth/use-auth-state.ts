import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

interface AuthUser {
	id: string;
	role: string;
}

export function useAuthState(): { user: AuthUser | null; isPending: boolean } {
	const { user: clerkUser, isLoaded } = useUser();

	const { data: user, isLoading } = useQuery({
		queryKey: ['auth-user', clerkUser?.id],
		queryFn: async () => {
			if (!clerkUser?.id) return null;
			// Fetch user data from your backend
			return { id: clerkUser.id, role: 'user' };
		},
		enabled: !!clerkUser?.id && isLoaded,
	});

	return { user: user ?? null, isPending: !isLoaded || isLoading };
} 