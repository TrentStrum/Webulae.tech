'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useToast } from '@/src/hooks/helpers/use-toast';

export const useLogout = (): { 
	logout: () => Promise<void>; 
	isLoading: boolean; 
} => {
	const { signOut } = useAuth();
	const router = useRouter();
	const { toast } = useToast();

	const { mutateAsync, isPending } = useMutation({
			mutationFn: async () => {
				await signOut();
			},
			onSuccess: () => {
				toast({
					title: 'Logged out successfully',
				});
				router.push('/sign-in');
			},
		});

	return {
		logout: () => mutateAsync(),
		isLoading: isPending,
	};
};
