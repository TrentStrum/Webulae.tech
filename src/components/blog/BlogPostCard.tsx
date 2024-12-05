'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { BlogPost } from '@/src/types/blog.types';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle className="hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>By {post.full_name || post.username || 'Anonymous'}</span>
            <span>•</span>
            <time dateTime={post.published_at || undefined}>
              {post.published_at &&
                formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
            </time>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}