import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery, useApiPaginatedQuery } from '../base-queries';

import type { ApiResponse, PaginatedResponse, ApiError } from '@/src/types/api.types';
import type { Notification } from '@/src/types/notification.types';

export function useNotifications(): UseQueryResult<PaginatedResponse<Notification>, ApiError> {
	return useApiPaginatedQuery<Notification>(
		queryKeys.notifications.all,
		endpoints.notifications.base
	);
}

export function useUnreadNotifications(): UseQueryResult<ApiResponse<Notification[]>, ApiError> {
	return useApiQuery<Notification[]>(
		queryKeys.notifications.unread,
		endpoints.notifications.unread
	);
} 