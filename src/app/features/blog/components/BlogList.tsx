'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { apiClient } from '@/src/lib/apiClient';

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	published_at: string;
	author: {
		full_name: string | null;
		username: string | null;
	};
}

export default function BlogList() {
	const {
		data: blogPosts,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['blogPosts'],
		queryFn: async () => {
			const data = await apiClient.get<BlogPost[]>('/blog');
			return data;
		},
	});

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
				{blogPosts.map((post) => (
					<Card key={post.id}>
						<CardHeader>
							<CardTitle>
								<Link href={`/blog/${post.slug}`}>
									<a className="hover:underline">{post.title}</a>
								</Link>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{post.excerpt}</p>
							<div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
								<span>By {post.author.full_name || post.author.username || 'Anonymous'}</span>
								<Badge>
									{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
								</Badge>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
