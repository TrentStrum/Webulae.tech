import * as z from 'zod';

export const blogPostSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
	excerpt: z
		.string()
		.min(1, 'Excerpt is required')
		.max(300, 'Excerpt must be less than 300 characters'),
	content: z
		.string()
		.min(1, 'Content is required')
		.max(50000, 'Content must be less than 50,000 characters'),
	published: z.boolean().optional().default(false),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
