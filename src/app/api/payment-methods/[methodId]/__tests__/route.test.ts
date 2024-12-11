import { createServerClient } from '@/src/lib/supabase/server';

import { DELETE } from '../route';

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn(),
}));

describe('Delete Payment Method Route Handler', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('DELETE /api/payment-methods/[methodId]', () => {
		it('should delete payment method successfully', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					delete: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							data: null,
							error: null,
						}),
					}),
				}),
			});

			const response = await DELETE(new Request('http://localhost:3000'), {
				params: { methodId: 'pm123' },
			});
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({ message: 'Payment method deleted successfully' });
		});

		it('should handle database errors', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					delete: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							error: new Error('Database error'),
						}),
					}),
				}),
			});

			const response = await DELETE(new Request('http://localhost:3000'), {
				params: { methodId: 'pm123' },
			});

			expect(response.status).toBe(500);
		});

		it('should validate payment method exists before deletion', async () => {
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

			const response = await DELETE(new Request('http://localhost:3000'), {
				params: { methodId: 'nonexistent' },
			});

			expect(response.status).toBe(404);
			expect(await response.json()).toEqual({
				error: 'Payment method not found',
			});
		});

		it('should prevent deleting default payment method', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({
								data: { is_default: true },
								error: null,
							}),
						}),
					}),
				}),
			});

			const response = await DELETE(new Request('http://localhost:3000'), {
				params: { methodId: 'pm123' },
			});

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Cannot delete default payment method',
			});
		});

		it('should handle authorization errors', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					delete: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							error: { code: '42501', message: 'Insufficient privileges' },
						}),
					}),
				}),
			});

			const response = await DELETE(new Request('http://localhost:3000'), {
				params: { methodId: 'pm123' },
			});

			expect(response.status).toBe(403);
			expect(await response.json()).toEqual({
				error: 'Not authorized to delete this payment method',
			});
		});
	});
});
