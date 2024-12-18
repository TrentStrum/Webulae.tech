import { createServerClient } from '@/src/lib/supabase/server';

import { GET } from '../route';

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn(),
}));

describe('Subscription Route Handlers', () => {
	const mockSubscription = {
		id: '123',
		user_id: 'user123',
		plan_id: 'plan123',
		payment_methods: [
			{
				id: 'pm123',
				is_default: true,
			},
		],
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /api/subscriptions/[userId]', () => {
		it('should return subscription when found', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({
								data: mockSubscription,
								error: null,
							}),
						}),
					}),
				}),
			});

			const response = await GET(new Request('http://localhost:3000'), {
				params: { userId: 'user123' },
			});
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual(mockSubscription);
		});

		it('should return 404 when subscription not found', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({
								data: null,
								error: null,
							}),
						}),
					}),
				}),
			});

			const response = await GET(new Request('http://localhost:3000'), {
				params: { userId: 'nonexistent' },
			});

			expect(response.status).toBe(404);
		});

		it('should handle Supabase client initialization failure', async () => {
			(createServerClient as jest.Mock).mockReturnValue(null);

			const response = await GET(new Request('http://localhost:3000'), {
				params: { userId: 'user123' },
			});

			expect(response.status).toBe(500);
			expect(await response.json()).toEqual({
				error: 'Could not initialize Supabase client',
			});
		});

		it('should handle malformed database response', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({
								data: { invalid: 'data' }, // Malformed data
								error: null,
							}),
						}),
					}),
				}),
			});

			const response = await GET(new Request('http://localhost:3000'), {
				params: { userId: 'user123' },
			});

			expect(response.status).toBe(500);
		});
	});
});
