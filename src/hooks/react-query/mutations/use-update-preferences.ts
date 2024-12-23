import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { UseMutationResult } from '@tanstack/react-query';


interface UserPreferences {
	theme?: 'light' | 'dark' | 'system';
}

export const useUpdatePreferences = (): UseMutationResult<unknown, unknown, UserPreferences> =>
	useMutation({
		mutationFn: (preferences: UserPreferences) =>
			apiClient.patch('/users/preferences', { preferences }),
	});
