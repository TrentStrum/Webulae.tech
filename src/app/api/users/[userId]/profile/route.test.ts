import { createServerClient } from '@/src/lib/supabase/server';

import { GET } from './route';

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn(),
}));

describe('Profile API Routes', () => {
	const mockProfile = {
		id: '123',
		role: 'user',
		avatar_url: 'http://example.com/avatar.jpg',
		email: 'test@example.com',
		username: 'testuser',
		full_name: 'Test User',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /api/users/[userId]/profile', () => {
		it('should return profile when found', async () => {
			// Mock Supabase response
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({
								data: mockProfile,
								error: null,
							}),
						}),
					}),
				}),
			});

			const response = await GET(new Request('http://localhost:3000'), {
				params: { userId: '123' },
			});
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual(mockProfile);
		});

		it('should return 404 when profile not found', async () => {
			// Mock Supabase response for not found
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
	});
});
