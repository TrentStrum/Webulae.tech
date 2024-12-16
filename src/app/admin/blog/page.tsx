'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useBlogPosts, useDeleteBlogPost } from '@/src/hooks/react-query/useBlog';
import { useAuth } from '@/src/hooks/auth/useAuth';

export default function AdminBlogPage() {
	const router = useRouter();
	const { user, loading: authLoading } = useAuth();
	const { toast } = useToast();
	const { data: posts, isLoading } = useBlogPosts({});
	const { mutate: deleteBlogPost, isPending } = useDeleteBlogPost({
		onSuccess: () => {
			toast({
				title: 'Success',
				description: 'Blog post deleted successfully',
			});
		},
		onError: () => {
			toast({
				title: 'Error',
				description: 'Failed to delete blog post',
				variant: 'destructive',
			});
		},
	});

	useEffect(() => {
		if (!authLoading && (!user || user.role !== 'admin')) {
			router.push('/');
		}
	}, [user, authLoading, router]);

	if (authLoading || isLoading) {
		return (
			<div className="container py-8 flex justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (!user || user.role !== 'admin') {
		return null;
	}

	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Blog Posts</h1>
				<Button onClick={() => router.push('/admin/blog/new')}>Create New Post</Button>
			</div>

			<div className="grid gap-6">
				{posts?.pages?.flat().map((post) => (
					<Card key={post.id}>
						<CardHeader>
							<CardTitle>{post.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{post.excerpt || post.content?.substring(0, 150) + '...'}
							</p>
							<div className="flex justify-end gap-4">
								<Button
									variant="outline"
									onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
								>
									Edit
								</Button>
								<Button
									variant="destructive"
									onClick={() => deleteBlogPost(post.id)}
									disabled={isPending}
								>
									{isPending ? 'Deleting...' : 'Delete'}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
