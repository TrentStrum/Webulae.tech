'use client';

import { useBlogPosts } from '@/src/hooks/react-query/blog';

import { BlogPostCard } from './BlogPostCard';

import type { BlogPost, BlogResponse } from '@/src/types/blog.types';
import type { InfiniteData } from '@tanstack/react-query';



export default function BlogList() {
	const { data: blogPosts, isLoading, isError } = useBlogPosts({});

	if (isLoading) {
		return (
			<div className="container py-8">
				<p>Loading blog posts...</p>
			</div>
		);
	}

	if (isError || !blogPosts) {
		return (
			<div className="container py-8">
				<p>Error loading blog posts. Please try again later.</p>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Blog</h1>
			<div className="space-y-4">
				{(blogPosts as InfiniteData<BlogResponse>)?.pages?.flatMap((page) => {
					const posts: BlogPost[] = [];
					if (page.data.featured) posts.push(page.data.featured);
					Object.values(page.data.categories).forEach((categoryPosts) => {
						posts.push(...(categoryPosts as BlogPost[]));
					});
					return posts;
				}).map((post) => (
					<BlogPostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
