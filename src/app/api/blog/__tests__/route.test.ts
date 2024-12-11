import { createRouteClient } from '@/src/lib/supabase/server';

import { GET, POST } from '../route';

jest.mock('@/src/lib/supabase/server', () => ({
	createRouteClient: jest.fn(),
}));

describe('Blog Route Handlers', () => {
	const mockBlogPosts = [
		{
			id: 'post1',
			title: 'First Post',
			content: 'Content 1',
			author_id: 'author1',
			slug: 'first-post',
			created_at: new Date().toISOString(),
			profiles: {
				username: 'testuser',
				full_name: 'Test User',
			},
		},
		{
			id: 'post2',
			title: 'Second Post',
			content: 'Content 2',
			author_id: 'author1',
			slug: 'second-post',
			created_at: new Date().toISOString(),
			profiles: {
				username: 'testuser',
				full_name: 'Test User',
			},
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /api/blog', () => {
		it('should return all blog posts', async () => {
			(createRouteClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						order: jest.fn().mockResolvedValue({
							data: mockBlogPosts,
							error: null,
						}),
					}),
				}),
			});

			const response = await GET(new Request('http://localhost:3000/api/blog'));
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual(mockBlogPosts);
		});

		it('should handle sorting', async () => {
			const mockSupabaseQuery = {
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						order: jest.fn().mockResolvedValue({
							data: mockBlogPosts,
							error: null,
						}),
					}),
				}),
			};

			(createRouteClient as jest.Mock).mockReturnValue(mockSupabaseQuery);

			await GET(new Request('http://localhost:3000/api/blog?sortBy=oldest'));

			expect(mockSupabaseQuery.from).toHaveBeenCalledWith('blog_posts');
			// Verify order was called with correct params
			expect(mockSupabaseQuery.from().select().order).toHaveBeenCalledWith('created_at', {
				ascending: true,
			});
		});

		it('should handle database errors', async () => {
			(createRouteClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						order: jest.fn().mockResolvedValue({
							data: null,
							error: new Error('Database error'),
						}),
					}),
				}),
			});

			const response = await GET(new Request('http://localhost:3000/api/blog'));
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data).toEqual({ error: 'Failed to fetch posts' });
		});
	});

	describe('POST /api/blog', () => {
		it('should create a new blog post', async () => {
			(createRouteClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					insert: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue({
							data: mockBlogPosts[0],
							error: null,
						}),
					}),
				}),
			});

			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'First Post',
						content: 'Content 1',
					}),
				})
			);

			expect(response.status).toBe(201);
		});

		it('should validate required fields', async () => {
			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						// Missing required fields
						title: '',
						content: '',
					}),
				})
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Title and content are required',
			});
		});

		it('should handle duplicate slugs', async () => {
			(createRouteClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					insert: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue({
							error: { code: '23505', message: 'Duplicate slug' },
						}),
					}),
				}),
			});

			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'First Post',
						content: 'Content 1',
					}),
				})
			);

			expect(response.status).toBe(409);
			expect(await response.json()).toEqual({
				error: 'A post with this title already exists',
			});
		});

		it('should validate content length', async () => {
			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'First Post',
						content: 'a'.repeat(100001), // Exceeds max length
					}),
				})
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Content exceeds maximum length',
			});
		});

		it('should sanitize HTML content', async () => {
			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'First Post',
						content: '<script>alert("xss")</script>Content 1',
					}),
				})
			);

			const data = await response.json();
			expect(data.content).not.toContain('<script>');
		});
	});
});
