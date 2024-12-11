import { apiClient } from '@/src/lib/apiClient';

import type { Subscription } from '@/src/types/subscription.types';

export const subscriptionService = {
	getSubscriptionData: async (userId: string): Promise<Subscription> => {
		return apiClient.get<Subscription>(`/api/subscriptions/${userId}`);
	},

	handleCancelAutoRenew: async (userId: string): Promise<void> => {
		return apiClient.post(`/api/subscriptions/${userId}/cancel`);
	},

	handleUpdatePlan: async (userId: string, planId: string): Promise<void> => {
		return apiClient.post(`/api/subscriptions/${userId}/update`, { planId });
	},

	handleDeletePaymentMethod: async (methodId: string): Promise<void> => {
		return apiClient.delete(`/api/payment-methods/${methodId}`);
	},

	handleAddPaymentMethod: async (userId: string, paymentMethodId: string): Promise<void> => {
		return apiClient.post('/api/payment-methods', {
			userId,
			paymentMethodId
		});
	}
};
