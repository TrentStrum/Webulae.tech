'use client';

import { formatDistanceToNow } from 'date-fns';
import { CalendarDays, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { cn } from '@/src/utils/utils';

import type { BlogPost } from '@/src/types/blog.types';

interface BlogPostCardProps {
	post: BlogPost;
	variant?: 'featured' | 'regular';
	className?: string;
}

export function BlogPostCard({
	post,
	variant = 'regular',
	className,
}: BlogPostCardProps): JSX.Element {
	if (variant === 'featured') {
		return (
			<Link href={`/articles/${post.slug}`}>
				<Card className={cn('overflow-hidden group', className)}>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="relative aspect-video overflow-hidden">
							{post.coverImage ? (
								<Image
									src={post.coverImage}
									alt={post.title}
									fill
									className="object-cover transition-transform group-hover:scale-105"
								/>
							) : (
								<div className="w-full h-full bg-muted" />
							)}
						</div>
						<div className="p-6">
							{post.category && (
								<Badge variant="secondary" className="mb-4">
									#{post.category}
								</Badge>
							)}
							<CardHeader className="p-0">
								<CardTitle className="text-3xl font-bold group-hover:text-primary transition-colors">
									{post.title}
								</CardTitle>
								<p className="text-lg text-muted-foreground mt-2">
									{post.shortDescription || post.excerpt}
								</p>
							</CardHeader>
							<CardContent className="p-0 mt-6">
								<p className="text-muted-foreground line-clamp-3">{post.content}</p>
								<div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<User className="h-4 w-4" />
										<span>{post.author?.full_name || post.author?.username || 'Anonymous'}</span>
									</div>
									{post.published_at && (
										<div className="flex items-center gap-2">
											<CalendarDays className="h-4 w-4" />
											<time dateTime={post.published_at}>
												{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
											</time>
										</div>
									)}
								</div>
							</CardContent>
						</div>
					</div>
				</Card>
			</Link>
		);
	}

	return (
		<Link href={`/articles/${post.slug}`}>
			<Card className={cn('group hover:shadow-lg transition-all', className)}>
				<div className="relative aspect-[16/9] overflow-hidden">
					{post.coverImage ? (
						<Image
							src={post.coverImage}
							alt={post.title}
							fill
							className="object-cover transition-transform group-hover:scale-105"
						/>
					) : (
						<div className="w-full h-full bg-muted" />
					)}
					{post.category && <Badge className="absolute top-4 left-4">{post.category}</Badge>}
				</div>
				<CardHeader>
					<CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<User className="h-4 w-4" />
							<span>{post.author?.full_name || post.author?.username || 'Anonymous'}</span>
						</div>
						{post.published_at && (
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<time dateTime={post.published_at}>
									{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
								</time>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
