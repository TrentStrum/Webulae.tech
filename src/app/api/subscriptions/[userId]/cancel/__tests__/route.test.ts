import { createServerClient } from '@/src/lib/supabase/server';
import { POST } from '../route';

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn()
}));

describe('Cancel Subscription Route Handler', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /api/subscriptions/[userId]/cancel', () => {
		it('should cancel subscription successfully', async () => {
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
				new Request('http://localhost:3000'),
				{ params: { userId: 'user123' } }
			);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({ message: 'Subscription cancelled successfully' });
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
				new Request('http://localhost:3000'),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(500);
		});

		it('should validate subscription exists before canceling', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({
								data: null,
								error: null
							})
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000'),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(404);
			expect(await response.json()).toEqual({ 
				error: 'No active subscription found' 
			});
		});

		it('should prevent canceling already canceled subscription', async () => {
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
				new Request('http://localhost:3000'),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({ 
				error: 'Subscription is already canceled' 
			});
		});

		it('should handle transaction rollback', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					update: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							error: { code: '40001', message: 'Transaction rollback' }
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000'),
				{ params: { userId: 'user123' } }
			);

			expect(response.status).toBe(500);
			expect(await response.json()).toEqual({ 
				error: 'Failed to cancel subscription. Please try again.' 
			});
		});
	});
}); 