'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import slugify from 'slugify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { ImageUpload } from '@/components/image/image-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function BlogEditor() {
  const { action, id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (action === 'edit' && id) {
      loadPost();
    } else {
      setLoading(false);
    }
  }, [action, id]);

  const loadPost = async () => {
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
      setCoverImage(data.cover_image || null);
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
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = slugify(title, { lower: true, strict: true });
      const postData = {
        title,
        slug,
        content,
        excerpt,
        cover_image: coverImage,
        updated_at: new Date().toISOString(),
      };

      if (action === 'edit') {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (insertError) throw insertError;
      }

      toast({
        title: 'Success',
        description: `Blog post ${action === 'edit' ? 'updated' : 'created'} successfully.`,
      });

      router.push('/blog/admin');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} blog post.`,
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
        <h1 className="text-3xl font-bold">
          {action === 'edit' ? 'Edit' : 'Create'} Blog Post
        </h1>
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
          <Input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the post"
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <div className="flex items-center gap-4">
            <ImageUpload
              onUpload={async (file) => {
                const url = await handleImageUpload(file);
                setCoverImage(url);
                return url;
              }}
              aspectRatio={16 / 9}
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="h-20 w-36 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
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
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}