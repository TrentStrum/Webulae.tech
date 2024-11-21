'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function NewBlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const slug = slugify(title, { lower: true, strict: true });

      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([
          {
            title,
            slug,
            content,
            excerpt,
            author_id: session.user.id,
          },
        ]);

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: 'Blog post created successfully.',
      });

      router.push('/blog/admin');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create blog post.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            A brief summary of the post that will appear in previews.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/blog/admin')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}