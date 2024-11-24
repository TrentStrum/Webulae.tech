import { useMutation } from '@tanstack/react-query';
import { supabaseClient } from '@/src/lib/supabaseClient';

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
			const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
			if (error) throw new Error(error.message);
		},
		onSuccess,
		onError,
	});
};
