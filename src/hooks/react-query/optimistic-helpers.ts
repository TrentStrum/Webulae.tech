import type { ApiResponse } from '@/src/types/api.types';
import type { QueryClient } from '@tanstack/react-query';

export function createOptimisticUpdater<T>(
	queryClient: QueryClient,
	queryKey: readonly unknown[]
): {
	optimistic: {
		updateItem: (newData: T) => void;
		updateList: (updater: (items: T[]) => T[]) => void;
		addItem: (newItem: T) => void;
		removeItem: (predicate: (item: T) => boolean) => void;
	};
} {
	return {
		optimistic: {
			updateItem: (newData: T) => {
				queryClient.setQueryData<ApiResponse<T>>(queryKey, (old) => {
					if (!old) return { data: newData };
					return { ...old, data: newData };
				});
			},
			updateList: (updater: (items: T[]) => T[]) => {
				queryClient.setQueryData<ApiResponse<T[]>>(queryKey, (old) => {
					if (!old) return { data: [] };
					return { ...old, data: updater(old.data) };
				});
			},
			addItem: (newItem: T) => {
				queryClient.setQueryData<ApiResponse<T[]>>(queryKey, (old) => {
					if (!old) return { data: [newItem] };
					return { ...old, data: [newItem, ...old.data] };
				});
			},
			removeItem: (predicate: (item: T) => boolean) => {
				queryClient.setQueryData<ApiResponse<T[]>>(queryKey, (old) => {
					if (!old) return { data: [] };
					return {
						...old,
						data: old.data.filter((item) => !predicate(item)),
					};
				});
			},
		},
	};
}
