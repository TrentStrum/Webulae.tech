'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useBlogPosts, useDeleteBlogPost } from '@/src/hooks/react-query/useBlog';

import type { BlogPost } from '@/src/types/blog.types';

export default function AdminBlogManagement() {
	const blogPostsQuery = useBlogPosts({});
	const deleteBlogPost = useDeleteBlogPost();
	const router = useRouter();
	const { toast } = useToast();

	const handleDelete = async (id: string) => {
		try {
			await deleteBlogPost.mutateAsync(id);
			toast({
				title: 'Success',
				description: 'Blog post deleted successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete the blog post.',
				variant: 'destructive',
			});
		}
	};

	const handleEdit = (id: string) => {
		router.push(`/admin/blog/edit/${id}`); // Navigate to an edit page
	};

	if (blogPostsQuery.isLoading) {
		return <p>Loading blog posts...</p>;
	}

	if (blogPostsQuery.isError) {
		return <p>Error loading blog posts.</p>;
	}

	const blogPosts = blogPostsQuery.data?.pages.flatMap((page) => page.data) || [];

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Manage Blog Posts</h1>
			<div className="grid gap-6">
				{blogPosts.map((post: BlogPost) => (
					<Card key={post.id}>
						<CardHeader>
							<CardTitle>{post.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>{post.excerpt || post.content?.substring(0, 100) + '...'}</p>
							<div className="flex justify-end space-x-4 mt-4">
								<Button variant="default" onClick={() => handleEdit(post.id)}>
									Edit
								</Button>
								<Button
									variant="destructive"
									onClick={() => handleDelete(post.id)}
									disabled={deleteBlogPost.isPending}
								>
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			{blogPostsQuery.hasNextPage && (
				<div className="flex justify-center mt-6">
					<Button onClick={() => blogPostsQuery.fetchNextPage()}>Load More</Button>
				</div>
			)}
		</div>
	);
}
