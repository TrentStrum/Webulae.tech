import { apiClient } from '@/src/lib/apiClient';
import { subscriptionService } from './subscriptionService';

jest.mock('@/src/lib/apiClient');

describe('subscriptionService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getSubscriptionData', () => {
		it('should fetch subscription data successfully', async () => {
			const mockSubscription = {
				id: 'sub123',
				userId: 'user123',
				planId: 'plan123'
			};

			(apiClient.get as jest.Mock).mockResolvedValue(mockSubscription);

			const result = await subscriptionService.getSubscriptionData('user123');
			expect(result).toEqual(mockSubscription);
			expect(apiClient.get).toHaveBeenCalledWith('/api/subscriptions/user123');
		});

		it('should handle API errors', async () => {
			(apiClient.get as jest.Mock).mockRejectedValue(new Error('API Error'));

			await expect(subscriptionService.getSubscriptionData('user123'))
				.rejects
				.toThrow('API Error');
		});

		it('should handle rate limiting', async () => {
			(apiClient.get as jest.Mock).mockRejectedValue({
				response: { status: 429, data: { error: 'Too many requests' } }
			});

			await expect(subscriptionService.getSubscriptionData('user123'))
				.rejects
				.toMatchObject({ response: { status: 429 } });
		});

		it('should handle server errors', async () => {
			(apiClient.get as jest.Mock).mockRejectedValue({
				response: { status: 500, data: { error: 'Internal server error' } }
			});

			await expect(subscriptionService.getSubscriptionData('user123'))
				.rejects
				.toMatchObject({ response: { status: 500 } });
		});
	});

	describe('handleCancelAutoRenew', () => {
		it('should cancel subscription successfully', async () => {
			(apiClient.post as jest.Mock).mockResolvedValue({ success: true });

			await subscriptionService.handleCancelAutoRenew('user123');
			expect(apiClient.post).toHaveBeenCalledWith('/api/subscriptions/user123/cancel');
		});

		it('should handle network errors', async () => {
			(apiClient.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

			await expect(subscriptionService.handleCancelAutoRenew('user123'))
				.rejects
				.toThrow('Network Error');
		});

		it('should handle invalid user ID', async () => {
			(apiClient.post as jest.Mock).mockRejectedValue({
				response: { status: 404, data: { error: 'User not found' } }
			});

			await expect(subscriptionService.handleCancelAutoRenew('invalid-user'))
				.rejects
				.toMatchObject({ response: { status: 404 } });
		});
	});

	describe('handleUpdatePlan', () => {
		it('should update plan successfully', async () => {
			(apiClient.post as jest.Mock).mockResolvedValue({ success: true });

			await subscriptionService.handleUpdatePlan('user123', 'new-plan-123');
			expect(apiClient.post).toHaveBeenCalledWith(
				'/api/subscriptions/user123/update',
				{ planId: 'new-plan-123' }
			);
		});

		it('should validate plan ID format', async () => {
			(apiClient.post as jest.Mock).mockRejectedValue({
				response: { status: 400, data: { error: 'Invalid plan ID format' } }
			});

			await expect(subscriptionService.handleUpdatePlan('user123', '   '))
				.rejects
				.toMatchObject({ response: { status: 400 } });
		});

		it('should handle unauthorized access', async () => {
			(apiClient.post as jest.Mock).mockRejectedValue({
				response: { status: 403, data: { error: 'Unauthorized' } }
			});

			await expect(subscriptionService.handleUpdatePlan('wrong-user', 'plan123'))
				.rejects
				.toMatchObject({ response: { status: 403 } });
		});

		it('should handle concurrent modification', async () => {
			(apiClient.post as jest.Mock).mockRejectedValue({
				response: { status: 409, data: { error: 'Subscription modified by another request' } }
			});

			await expect(subscriptionService.handleUpdatePlan('user123', 'plan123'))
				.rejects
				.toMatchObject({ response: { status: 409 } });
		});
	});

	describe('handlePaymentMethods', () => {
		it('should add payment method successfully', async () => {
			(apiClient.post as jest.Mock).mockResolvedValue({ success: true });

			await subscriptionService.handleAddPaymentMethod('user123', 'pm123');
			expect(apiClient.post).toHaveBeenCalledWith('/api/payment-methods', {
				userId: 'user123',
				paymentMethodId: 'pm123'
			});
		});

		it('should delete payment method successfully', async () => {
			(apiClient.delete as jest.Mock).mockResolvedValue({ success: true });

			await subscriptionService.handleDeletePaymentMethod('pm123');
			expect(apiClient.delete).toHaveBeenCalledWith('/api/payment-methods/pm123');
		});

		it('should validate payment method format', async () => {
			(apiClient.post as jest.Mock).mockRejectedValue({
				response: { status: 400, data: { error: 'Invalid payment method format' } }
			});

			await expect(subscriptionService.handleAddPaymentMethod('user123', 'invalid'))
				.rejects
				.toMatchObject({ response: { status: 400 } });
		});

		it('should handle deletion of nonexistent payment method', async () => {
			(apiClient.delete as jest.Mock).mockRejectedValue({
				response: { status: 404, data: { error: 'Payment method not found' } }
			});

			await expect(subscriptionService.handleDeletePaymentMethod('nonexistent'))
				.rejects
				.toMatchObject({ response: { status: 404 } });
		});
	});
}); 