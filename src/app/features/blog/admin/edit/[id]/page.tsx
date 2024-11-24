'use client';

import { useParams } from 'next/navigation';


export default function EditPostPage() {
	const { id } = useParams();
	const postId = Array.isArray(id) ? id[0] : id;

	if (!postId) {
		return (
			<div className="container py-8 text-center">
				<h1 className="text-2xl font-bold">Post ID not found</h1>
				<p className="text-muted-foreground mt-2">Please check the URL and try again.</p>
			</div>
		);
	}

	return <BlogEditor onSubmit={() => {}} isLoading={false} />;
}
