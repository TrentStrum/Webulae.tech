'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { BlogPostSkeleton } from '@/src/components/skeletons/blog-page-skeleton';
import { useBlogPostWithViews } from '@/src/hooks/react-query/blog';

export default function BlogPostPage(): JSX.Element {
	const { slug } = useParams();
	
	const {
		data: post,
		isPending,
		error,
	} = useBlogPostWithViews(slug as string);

	if (isPending) {
		return <BlogPostSkeleton />;
	}

	if (error) {
		return (
			<div className="container py-8">
				<p className="text-center text-destructive">Failed to load blog post</p>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="container py-8">
				<p className="text-center text-muted-foreground">Blog post not found</p>
			</div>
		);
	}

	return (
		<article className="container py-8 max-w-4xl mx-auto">
			<header className="space-y-4 mb-8">
				<h1 className="text-4xl font-bold text-foreground">{post.title}</h1>
				<div className="flex items-center gap-4 text-muted-foreground">
					<span>{new Date(post.created_at).toLocaleDateString()}</span>
					<span>•</span>
					<span>{post.category}</span>
				</div>
			</header>

			{post.image && (
				<div className="mb-8 relative w-full h-[400px]">
					<Image 
						src={post.image} 
						alt={post.title}
						fill
						className="object-cover rounded-lg"
						priority
					/>
				</div>
			)}

			<div className="prose prose-lg max-w-none dark:prose-invert">
				{post.content}
			</div>
		</article>
	);
}
