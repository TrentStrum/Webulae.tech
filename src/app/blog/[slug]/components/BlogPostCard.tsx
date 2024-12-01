'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { BlogPost } from "@/src/types/blog.types";
import { formatDistanceToNow } from "date-fns";


type Props = {
	post: BlogPost;
}

export function BlogPostCard({ post }: Props) {
	return (
		<Card className="transition-shadow hover:shadow-lg">
			<CardHeader>
				<CardTitle>
					<a href={`/articles/${post.slug}`} className="hover:text-primary transition-colors">
						{post.title}
					</a>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground mb-4">{post.excerpt}</p>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>By {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}</span>
					<span>•</span>
					<time dateTime={post.published_at || undefined}>
						{post.published_at &&
							formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
					</time>
				</div>
			</CardContent>
		</Card>
	);
}
