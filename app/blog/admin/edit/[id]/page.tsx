'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import slugify from 'slugify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function EditBlogPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt || '');
        setPublishedAt(data.published_at);
      } catch (error) {
        console.error('Error loading post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog post.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPost();
    }
  }, [id, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = slugify(title, { lower: true, strict: true });

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title,
          slug,
          content,
          excerpt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Blog post updated successfully.',
      });

      router.push('/blog/admin');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update blog post.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          published_at: publishedAt ? null : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setPublishedAt(prev => prev ? null : new Date().toISOString());

      toast({
        title: 'Success',
        description: publishedAt 
          ? 'Blog post unpublished successfully.' 
          : 'Blog post published successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update publication status.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-full"></div>
          <div className="h-32 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <Button
          onClick={handlePublish}
          variant={publishedAt ? "destructive" : "default"}
          disabled={saving}
        >
          {publishedAt ? 'Unpublish' : 'Publish'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
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
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}