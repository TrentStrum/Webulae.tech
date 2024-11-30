import { BlogForm } from '@/src/components/admin/blog/BlogForm';
import { useBlogPost } from '@/src/hooks/react-query/useBlog';

export default async function AdminBlogEditPage({ params }: { params: { id: string } }) {
	const { data: post, isPending, isError } = useBlogPost(params.id);

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error fetching blog post</div>;

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
			<BlogForm action="edit" initialData={post} />
		</div>
	);
};
