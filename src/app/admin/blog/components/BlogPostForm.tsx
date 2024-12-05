```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogPostFormData } from '@/src/types/blog.types';
import { blogPostSchema } from '@/src/schemas/blogSchema';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { RichTextEditor } from '@/src/components/editor/RichTextEditor';
import { LoadingButton } from '@/src/components/ui/loading-states/LoadingButton';
import { Card, CardContent } from '@/src/components/ui/card';

interface BlogPostFormProps {
  mode: 'create' | 'edit';
  initialData?: BlogPostFormData;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BlogPostForm({
  mode,
  initialData,
  onSubmit,
  isLoading
}: BlogPostFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData || {
      title: '',
      excerpt: '',
      content: '',
    }
  });

  const content = watch('content');

  const handleImageUpload = async (file: File): Promise<string> => {
    // Implement image upload logic here
    return URL.createObjectURL(file);
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register('title')}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            {...register('excerpt')}
            className={errors.excerpt ? 'border-destructive' : ''}
          />
          {errors.excerpt && (
            <p className="text-sm text-destructive">{errors.excerpt.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            content={content}
            onChange={(value) => setValue('content', value)}
            onImageUpload={handleImageUpload}
            className={errors.content ? 'border-destructive' : ''}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText={mode === 'create' ? 'Creating...' : 'Saving...'}
          >
            {mode === 'create' ? 'Create Post' : 'Save Changes'}
          </LoadingButton>
        </div>
      </form>
    </CardContent>
  );
}
```