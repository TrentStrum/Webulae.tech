'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
  };
  _count: {
    views: number;
    comments: number;
  };
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
    loadPosts();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      router.push('/');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
    }
  };

  const loadPosts = async () => {
    try {
      // Get posts with author info
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          published_at,
          created_at,
          profiles (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Get view and comment counts for each post
      const postsWithCounts = await Promise.all(
        (postsData || []).map(async (post) => {
          const [{ count: viewCount }, { count: commentCount }] = await Promise.all([
            supabase
              .from('blog_post_views')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id),
            supabase
              .from('blog_comments')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id),
          ]);

          return {
            ...post,
            _count: {
              views: viewCount || 0,
              comments: commentCount || 0,
            },
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (postId: string, currentStatus: string | null) => {
    try {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          published_at: currentStatus ? null : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

      if (updateError) throw updateError;

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            published_at: currentStatus ? null : new Date().toISOString(),
          };
        }
        return post;
      }));

      toast({
        title: 'Success',
        description: currentStatus 
          ? 'Post unpublished successfully.' 
          : 'Post published successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update publication status.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button asChild>
          <Link href="/blog/admin/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.profiles.full_name || post.profiles.username}</TableCell>
              <TableCell>
                <Badge variant={post.published_at ? "success" : "secondary"}>
                  {post.published_at ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>{post._count.views}</TableCell>
              <TableCell>{post._count.comments}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/blog/admin/edit/${post.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={post.published_at ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handlePublishToggle(post.id, post.published_at)}
                  >
                    {post.published_at ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/articles/${post.slug}`} target="_blank">
                      View
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}