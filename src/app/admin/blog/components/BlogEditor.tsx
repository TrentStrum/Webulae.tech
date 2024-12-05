```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { RichTextEditor } from '@/src/components/editor/RichTextEditor';
import { useAdminBlogPost, useCreateBlogPost, useUpdateBlogPost } from '@/src/hooks/react-query/useBlog';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { BlogPostForm } from './BlogPostForm';

interface BlogEditorProps {
  mode: 'create' | 'edit';
  postId?: string;
}

export default function BlogEditor({ mode, postId }: BlogEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: post, isLoading: isLoadingPost } = useAdminBlogPost(postId || '', mode === 'edit');
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost(postId || '');

  if (mode === 'edit' && !postId) {
    router.push('/admin/blog');
    return null;
  }

  if (mode === 'edit' && isLoadingPost) {
    return (
      <div className="container py-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Post' : 'Edit Post'}</CardTitle>
        </CardHeader>
        <BlogPostForm
          mode={mode}
          initialData={post}
          onSubmit={async (data) => {
            try {
              if (mode === 'create') {
                await createPost.mutateAsync(data);
                toast({
                  title: 'Success',
                  description: 'Post created successfully',
                });
              } else {
                await updatePost.mutateAsync(data);
                toast({
                  title: 'Success',
                  description: 'Post updated successfully',
                });
              }
              router.push('/admin/blog');
            } catch (error) {
              toast({
                title: 'Error',
                description: 'Failed to save post',
                variant: 'destructive',
              });
            }
          }}
          isLoading={createPost.isPending || updatePost.isPending}
        />
      </Card>
    </div>
  );
}
```