import { createServerClient } from '@/src/lib/supabase/server';

import { POST } from '../route';

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn(),
}));

describe('Payment Methods Route Handler', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /api/payment-methods', () => {
		it('should add payment method successfully', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					insert: jest.fn().mockReturnValue({
						data: null,
						error: null,
					}),
				}),
			});

			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({
						userId: 'user123',
						paymentMethodId: 'pm123',
					}),
				})
			);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({ message: 'Payment method added successfully' });
		});

		it('should require userId and paymentMethodId', async () => {
			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({}),
				})
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'User ID and payment method ID are required',
			});
		});

		it('should handle database errors', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					insert: jest.fn().mockReturnValue({
						error: new Error('Database error'),
					}),
				}),
			});

			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({
						userId: 'user123',
						paymentMethodId: 'pm123',
					}),
				})
			);

			expect(response.status).toBe(500);
		});

		it('should handle malformed request body', async () => {
			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: 'invalid-json',
				})
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Invalid request body',
			});
		});

		it('should validate payment method format', async () => {
			const response = await POST(
				new Request('http://localhost:3000', {
					method: 'POST',
					body: JSON.stringify({
						userId: 'user123',
						paymentMethodId: '', // Empty payment method ID
					}),
				})
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Invalid payment method ID',
			});
		});
	});
});
