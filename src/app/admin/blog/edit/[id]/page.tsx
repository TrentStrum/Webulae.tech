'use client';

import { BlogForm } from '@/src/components/admin/blog/BlogForm';

interface Props {
  params: {
    id: string;
  }
}

export default function EditBlogPost({ params }: Props) {
	return <BlogForm action="edit" postId={params.id} />;
}
