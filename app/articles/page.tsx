'use client';

import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface Article {
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

const ITEMS_PER_PAGE = 10;

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const fetchArticles = async ({ pageParam = 0 }) => {
    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        published_at,
        profiles (
          username,
          full_name
        )
      `)
      .not('published_at', 'is', null)
      .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

    // Apply search filter if exists
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        query = query.order('published_at', { ascending: true });
        break;
      case 'a-z':
        query = query.order('title', { ascending: true });
        break;
      case 'z-a':
        query = query.order('title', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('published_at', { ascending: false });
        break;
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['articles', searchTerm, sortBy],
    queryFn: fetchArticles,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === ITEMS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Debounced search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      refetch();
    }, 500);
  };

  const articles = data?.pages.flat() || [];

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Articles</h1>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="a-z">Title A-Z</SelectItem>
                    <SelectItem value="z-a">Title Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-4"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No articles found.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-6">
              {articles.map((article) => (
                <Card key={article.id} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <a 
                        href={`/articles/${article.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>By {article.profiles.full_name || article.profiles.username}</span>
                      <span>•</span>
                      <time dateTime={article.published_at}>
                        {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div 
              id="scroll-sentinel" 
              className="h-4 mt-6"
            />
            
            {isFetchingNextPage && (
              <div className="text-center py-4">
                Loading more articles...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}