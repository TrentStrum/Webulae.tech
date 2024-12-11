import { createServerClient } from '@/src/lib/supabase/server';
import { POST } from '../route';

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn()
}));

describe('Update Subscription Route Handler', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /api/subscriptions/[userId]/update', () => {
		it('should update subscription successfully', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					update: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							data: null,
							error: null
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({ planId: 'new-plan-123' })
				}),
				{ params: { userId: 'user123' } }
			);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({ message: 'Subscription updated successfully' });
		});

		it('should require planId', async () => {
			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({})
				}),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({ error: 'Plan ID is required' });
		});

		it('should handle database errors', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					update: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							error: new Error('Database error')
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({ planId: 'new-plan-123' })
				}),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(500);
		});

		it('should validate plan ID format', async () => {
			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({
						planId: '   ' // Invalid plan ID (whitespace)
					})
				}),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({ 
				error: 'Invalid plan ID format' 
			});
		});

		it('should handle concurrent update attempts', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					update: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							error: { code: '23P01', message: 'Concurrent update detected' }
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({ planId: 'new-plan-123' })
				}),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(409); // Conflict
			expect(await response.json()).toEqual({ 
				error: 'Subscription is being modified by another request' 
			});
		});

		it('should validate subscription status before update', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({
								data: { status: 'canceled' },
								error: null
							})
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({ planId: 'new-plan-123' })
				}),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({ 
				error: 'Cannot update canceled subscription' 
			});
		});
	});
}); 