'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string;
  profiles: {
    username: string;
    full_name: string;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const { data } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .order('published_at', { ascending: false })
        .is('published_at', 'not.null');

      setPosts(data || []);
      setLoading(false);
    }

    loadPosts();
  }, []);

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>By {post.profiles.full_name || post.profiles.username}</span>
                <span>•</span>
                <time dateTime={post.published_at}>
                  {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                </time>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}