'use client';

import { useBlogPosts } from '@/src/hooks/react-query/useBlog';
import { BlogPostCard } from './BlogPostCard';

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
				{blogPosts.pages.flatMap((page) => page).map((post) => (
					<BlogPostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
