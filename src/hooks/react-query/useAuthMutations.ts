import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/src/services/authService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/hooks/helpers/use-toast';

export function useAuthMutations() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const login = useMutation({
		mutationFn: async ({ email, password }: { email: string; password: string }) => {
			await authService.login(email, password);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
			router.push('/dashboard');
		},
	});

	const logout = useMutation({
		mutationFn: async () => {
			await authService.logout();
		},
		onSuccess: () => {
			queryClient.setQueryData(['auth', 'user'], null);
			router.push('/login');
		},
	});

	return { login, logout };
}

export const useLoginMutation = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({ email, password }: { email: string; password: string }) => {
			await authService.login(email, password);
			const session = await authService.getSession();
			if (!session?.user) throw new Error('Login failed');
			
			const profile = await authService.getUserProfile(session.user.id);
			return profile;
		},
		onSuccess: async (user) => {
			if (!user) {
				toast({
					title: 'Error',
					description: 'Failed to get user profile',
					variant: 'destructive',
				});
				return;
			}

			queryClient.setQueryData(['auth', 'user'], user);
			
			// Give Supabase time to set the session
			await new Promise(resolve => setTimeout(resolve, 1000));

			toast({
				title: 'Success',
				description: 'Logged in successfully.',
			});

			if (user.role === 'admin') {
					router.push('/admin/dashboard');
			} else if (user.role === 'developer') {
					router.push('/developer/dashboard');
			} else {
					router.push('/projects');
			}

			onSuccess?.();
		},
		onError: (error: Error) => {
			toast({
				title: 'Error',
				description: error.message || 'Failed to login',
				variant: 'destructive',
			});
		}
	});
};

export const useRequireAdmin = () => {
	const router = useRouter();
	const { toast } = useToast();
	
	const checkAdminAccess = async () => {
		const session = await authService.getSession();
		if (!session) {
			router.push('/login');
			return false;
		}

		const profile = await authService.getUserProfile(session.user.id);

		if (!profile || profile.role !== 'admin') {
			router.push('/');
			toast({
				title: 'Access Denied',
				description: 'You do not have permission to access this page.',
				variant: 'destructive',
			});
			return false;
		}

		return true;
	};

	return { checkAdminAccess };
};
