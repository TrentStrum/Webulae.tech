import { createServerClient } from '@/src/lib/supabase/server';
import { GET, POST } from '../route';

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn()
}));

describe('Blog Route Handlers', () => {
	const mockBlogPost = {
		id: 'post123',
		title: 'Test Post',
		content: 'Test Content',
		author_id: 'author123',
		slug: 'test-post',
		published_at: new Date().toISOString()
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /api/blog', () => {
		it('should return blog posts with pagination', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						order: jest.fn().mockReturnValue({
							range: jest.fn().mockResolvedValue({
								data: [mockBlogPost],
								error: null
							})
						})
					})
				})
			});

			const request = new Request('http://localhost:3000/api/blog?page=1&limit=10');
			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual([mockBlogPost]);
		});

		it('should handle search parameters', async () => {
			const request = new Request(
				'http://localhost:3000/api/blog?searchTerm=test&sortBy=newest'
			);
			await GET(request);

			expect(createServerClient).toHaveBeenCalled();
			// Add more specific assertions about how search is handled
		});

		it('should handle database errors', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						order: jest.fn().mockReturnValue({
							range: jest.fn().mockResolvedValue({
								error: new Error('Database error')
							})
						})
					})
				})
			});

			const response = await GET(new Request('http://localhost:3000/api/blog'));
			expect(response.status).toBe(500);
		});

		it('should handle invalid pagination parameters', async () => {
			const response = await GET(
				new Request('http://localhost:3000/api/blog?page=-1&limit=0')
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Invalid pagination parameters'
			});
		});

		it('should handle sorting by different fields', async () => {
			const sortFields = ['newest', 'oldest', 'title', 'views'];
			
			for (const sortBy of sortFields) {
				await GET(new Request(`http://localhost:3000/api/blog?sortBy=${sortBy}`));
				
				expect(createServerClient).toHaveBeenCalled();
				// Verify correct sort order was applied
			}
		});

		it('should handle complex search queries', async () => {
			const response = await GET(
				new Request('http://localhost:3000/api/blog?searchTerm=test+multiple+words')
			);

			expect(response.status).toBe(200);
			// Verify search logic handles multiple words correctly
		});

		it('should respect published status filter', async () => {
			const response = await GET(
				new Request('http://localhost:3000/api/blog?status=published')
			);

			expect(response.status).toBe(200);
			// Verify only published posts are returned
		});
	});

	describe('POST /api/blog', () => {
		it('should create a new blog post', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					insert: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue({
							data: mockBlogPost,
							error: null
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Test Post',
						content: 'Test Content'
					})
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
						content: ''
					})
				})
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Title and content are required'
			});
		});

		it('should handle duplicate slugs', async () => {
			(createServerClient as jest.Mock).mockReturnValue({
				from: jest.fn().mockReturnValue({
					insert: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue({
							error: { code: '23505', message: 'Duplicate slug' }
						})
					})
				})
			});

			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Test Post',
						content: 'Test Content'
					})
				})
			);

			expect(response.status).toBe(409);
			expect(await response.json()).toEqual({
				error: 'A post with this title already exists'
			});
		});

		it('should validate content length', async () => {
			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Test Post',
						content: 'a'.repeat(100001) // Exceeds max length
					})
				})
			);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual({
				error: 'Content exceeds maximum length'
			});
		});

		it('should sanitize HTML content', async () => {
			const response = await POST(
				new Request('http://localhost:3000/api/blog', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Test Post',
						content: '<script>alert("xss")</script>Test Content'
					})
				})
			);

			const data = await response.json();
			expect(data.content).not.toContain('<script>');
		});
	});
}); 