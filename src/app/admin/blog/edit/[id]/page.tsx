'use client';

import BlogEditor from '../../components/BlogEditor';

interface Props {
  params: {
    id: string;
  }
}

export default function EditBlogPost({ params }: Props) {
  return <BlogEditor mode="edit" postId={params.id} />;
}