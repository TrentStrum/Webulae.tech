import { useMutation } from '@tanstack/react-query';
import { getSupabaseClient } from '@/src/lib/supabase';

export const useResetPassword = () => {
	return useMutation({
		mutationFn: async (email: string) => {
			const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});

			if (error) throw error;
		},
	});
};
