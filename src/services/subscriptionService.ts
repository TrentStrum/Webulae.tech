import { apiClient } from '@/src/lib/apiClient';

import type { Subscription } from '@/src/types/subscription.types';

export const subscriptionService = {
	getSubscriptionData: async (userId: string): Promise<Subscription> => {
		return apiClient.get<Subscription>(`/api/subscriptions/${userId}`);
	},

	handleCancelAutoRenew: async (userId: string) => {
		return apiClient.post(`/api/subscriptions/${userId}/cancel`);
	},

	handleUpdatePlan: async (userId: string, planId: string) => {
		return apiClient.post(`/api/subscriptions/${userId}/update`, { planId });
	},

	handleAddPaymentMethod: async (userId: string, paymentMethodId: string) => {
		return apiClient.post('/api/payment-methods', { userId, paymentMethodId });
	},

	handleDeletePaymentMethod: async (methodId: string) => {
		return apiClient.delete(`/api/payment-methods/${methodId}`);
	},
};
