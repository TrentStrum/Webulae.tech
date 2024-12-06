'use client';

import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { useBlogPost } from '@/src/hooks/react-query/useBlog';

export default function BlogPostPage() {
  const { slug } = useParams();
  const postSlug = Array.isArray(slug) ? slug[0] : slug;
  const { data: post, isLoading, error } = useBlogPost(postSlug);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-8 flex justify-center">
              <LoadingSpinner size="lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {error ? 'Error loading blog post.' : 'Blog post not found.'}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{post.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <span>By {post.full_name || post.username || 'Anonymous'}</span>
              <span>•</span>
              <time dateTime={post.published_at || ''}>
                {post.published_at &&
                  formatDistanceToNow(new Date(post.published_at), {
                    addSuffix: true,
                  })}
              </time>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {post.content}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}