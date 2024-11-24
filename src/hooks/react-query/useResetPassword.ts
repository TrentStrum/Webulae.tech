import { useMutation } from '@tanstack/react-query';
import { supabaseClient } from '@/src/lib/supabaseClient';

export const useResetPassword = () => {
	return useMutation({
		mutationFn: async (email: string) => {
			const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});

			if (error) throw error;
		},
	});
};
