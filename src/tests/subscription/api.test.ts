import { createMocks } from 'node-mocks-http';

import { POST as cancelSubscription } from '@/src/app/api/subscriptions/cancel/route';
import { POST as createSubscription } from '@/src/app/api/subscriptions/create/route';
import { POST as updateSubscription } from '@/src/app/api/subscriptions/update/route';
import { GET as getUsage } from '@/src/app/api/subscriptions/usage/route';
import { supabase } from '@/src/lib/supabase/server';

jest.mock('@/src/lib/supabase/server', () => ({
	supabase: {
		auth: {
			getSession: jest.fn(() => ({
				data: { session: { user: { id: 'test-user-id' } } },
			})),
		},
		from: jest.fn(() => ({
			select: jest.fn().mockReturnThis(),
			insert: jest.fn().mockReturnThis(),
			update: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			single: jest.fn().mockResolvedValue({ data: { stripe_customer_id: 'cus_123' } }),
		})),
	},
}));

jest.mock('stripe', () => {
	return jest.fn().mockImplementation(() => ({
		subscriptions: {
			create: jest.fn().mockResolvedValue({ id: 'sub_123' }),
			update: jest.fn().mockResolvedValue({ id: 'sub_123', status: 'active' }),
		},
		customers: {
			create: jest.fn().mockResolvedValue({ id: 'cus_123' }),
		},
	}));
});

describe('Subscription API Endpoints', () => {
	describe('POST /api/subscriptions/create', () => {
		it('creates a new subscription', async () => {
			const { req, res } = createMocks({
				method: 'POST',
				body: {
					planId: 'plan_123',
					paymentMethodId: 'pm_123',
				},
			});

			await createSubscription(req);

			expect(res._getStatusCode()).toBe(200);
			expect(JSON.parse(res._getData())).toEqual({
				subscriptionId: 'sub_123',
			});
		});

		it('handles unauthorized requests', async () => {
			const { req, res } = createMocks({
				method: 'POST',
			});

			jest
				.spyOn(supabase.auth, 'getSession')
				.mockResolvedValueOnce({ data: { session: null }, error: null });

			await createSubscription(req);

			expect(res._getStatusCode()).toBe(401);
		});
	});

	describe('POST /api/subscriptions/update', () => {
		it('updates an existing subscription', async () => {
			const { req, res } = createMocks({
				method: 'POST',
				body: {
					subscriptionId: 'sub_123',
					planId: 'plan_456',
				},
			});

			await updateSubscription(req);

			expect(res._getStatusCode()).toBe(200);
			expect(JSON.parse(res._getData())).toEqual({
				subscriptionId: 'sub_123',
				status: 'active',
			});
		});
	});

	describe('POST /api/subscriptions/cancel', () => {
		it('cancels a subscription', async () => {
			const { req, res } = createMocks({
				method: 'POST',
				body: {
					subscriptionId: 'sub_123',
					atPeriodEnd: true,
				},
			});

			await cancelSubscription(req);

			expect(res._getStatusCode()).toBe(200);
			expect(JSON.parse(res._getData())).toEqual({
				success: true,
			});
		});
	});

	describe('GET /api/subscriptions/usage', () => {
		it('returns usage statistics', async () => {
			const { res } = createMocks({
				method: 'GET',
			});

			await getUsage();

			expect(res._getStatusCode()).toBe(200);
			const data = JSON.parse(res._getData());
			expect(data).toHaveProperty('projects');
			expect(data).toHaveProperty('storage');
			expect(data).toHaveProperty('api');
		});
	});
});
