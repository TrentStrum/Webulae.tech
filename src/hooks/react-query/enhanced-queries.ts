import { useQueryClient } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { useQueryErrorHandler } from '@/src/lib/query/error-handlers';

import { useApiMutation } from './base-queries';
import { useInfiniteMembersList } from './infinite-helpers';
import { createOptimisticUpdater } from './optimistic-helpers';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Member } from '@/src/types/member.types';
import type { AddMemberData } from '@/src/types/organization.types';

type MutationContext = {
	previousMembers?: ApiResponse<Member[]>;
};

type OrganizationMembersResult = {
	data: Member[];
	hasNextPage?: boolean;
	fetchNextPage: () => Promise<void>;
	isFetchingNextPage: boolean;
	addMember: (data: AddMemberData) => void;
	isAddingMember: boolean;
};

export function useOrganizationMembers(orgId: string): OrganizationMembersResult {
	const queryClient = useQueryClient();
	const errorHandler = useQueryErrorHandler();
	const query = useInfiniteMembersList(orgId);
	const optimistic = createOptimisticUpdater(queryClient, queryKeys.organizations.members(orgId));

	const addMember = useApiMutation<Member, AddMemberData, MutationContext>(
		endpoints.organizations.members(orgId),
		{
			onMutate: async (newMember): Promise<MutationContext> => {
				
				await queryClient.cancelQueries({
					queryKey: queryKeys.organizations.members(orgId),
				});
				const previousMembers = queryClient.getQueryData<ApiResponse<Member[]>>(
					queryKeys.organizations.members(orgId)
				);
				
				optimistic.optimistic.addItem({
					id: 'temp-id',
					...newMember,
					status: 'pending',
				});
				
				return { previousMembers };
			},
			onError: (error: ApiError, _: AddMemberData, context: MutationContext) => {
				queryClient.setQueryData(queryKeys.organizations.members(orgId), context?.previousMembers);
				errorHandler.onError(error);
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.organizations.members(orgId),
				});
			},
		}
	);

	return {
		data: query.data?.pages.flatMap(page => page.data) ?? [],
		hasNextPage: query.hasNextPage,
		fetchNextPage: query.fetchNextPage,
		isFetchingNextPage: query.isFetchingNextPage,
		addMember: addMember.mutate,
		isAddingMember: addMember.isPending,
	};
}
