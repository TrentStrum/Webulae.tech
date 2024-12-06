import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

import type { BlogPost } from '@/src/types/blog.types';


interface BlogPostCardProps {
	post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Link href={`/blog/${post.slug}`} className="hover:underline">
						{post.title}
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">{post.excerpt}</p>
				<div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
					<span>By {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}</span>
					<Badge>
						{formatDistanceToNow(new Date(post.published_at || post.created_at), {
							addSuffix: true,
						})}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
