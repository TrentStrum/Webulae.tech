import { useMutation } from '@tanstack/react-query';
import { getSupabaseClient } from '@/src/lib/supabase';

interface LoginPayload {
	email: string;
	password: string;
}

export const useLogin = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => {
	return useMutation<void, Error, LoginPayload>({
		mutationFn: async ({ email, password }: LoginPayload) => {
			const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
			if (error) throw new Error(error.message);
		},
		onSuccess,
		onError,
	});
};
