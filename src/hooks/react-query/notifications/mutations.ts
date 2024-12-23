import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryClient } from '@/src/config/query-client';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Notification } from '@/src/types/notification.types';

export function useMarkNotificationAsRead(): UseMutationResult<
	ApiResponse<Notification>,
	ApiError,
	string
> {
	return useApiMutation<Notification, string>(
		endpoints.notifications.base,
		{
			mutationFn: async (notificationId) => {
				const response = await apiClient.patch<ApiResponse<Notification>>(
					`${endpoints.notifications.base}/${notificationId}/read`
				);
				return response.data;
			},
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.notifications.all
				});
				queryClient.invalidateQueries({
					queryKey: queryKeys.notifications.unread
				});
			}
		}
	);
} 