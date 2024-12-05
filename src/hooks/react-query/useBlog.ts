'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import { BlogPost, BlogPostFormData } from '@/src/types/blog.types';

const ITEMS_PER_PAGE = 10;

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts_with_authors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Record view
      if (data?.id) {
        await supabase.from('blog_post_views').insert({
          post_id: data.id,
          viewer_id: (await supabase.auth.getSession()).data.session?.user?.id || null,
        });
      }

      return data as BlogPost;
    },
    enabled: !!slug,
  });
}

export function useBlogPosts({ searchTerm = '', sortBy = 'newest' }) {
  return useInfiniteQuery({
    queryKey: ['blog', 'posts', searchTerm, sortBy],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('blog_posts_with_authors')
        .select('*')
        .not('published_at', 'is', null);

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

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
      }

      const { data, error } = await query
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      return data as BlogPost[];
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      const { data: post, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...data,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          published_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
    },
  });
}