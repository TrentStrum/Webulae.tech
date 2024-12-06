'use client';

import {
	useQuery,
	useMutation,
	useQueryClient,
	useInfiniteQuery,
	UseInfiniteQueryResult,
	UseQueryResult,
	UseMutationResult,
	InfiniteData,
} from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import type { BlogPost, BlogPostFormData } from '@/src/types/blog.types';

const ITEMS_PER_PAGE = 10;

export function useBlogPost(slug: string): UseQueryResult<BlogPost> {
	return useQuery({
		queryKey: ['blog', 'post', slug],
		queryFn: async () => {
			if (!supabase) throw new Error('Supabase client not initialized');
			const { data, error } = await supabase
				.from('blog_posts')
				.select(`
					*,
					profiles (
						username,
						full_name
					)
				`)
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

export function useBlogPosts(params: {
	searchTerm: string;
	sortBy: string;
}): UseInfiniteQueryResult<InfiniteData<BlogPost[], number>, Error> {
	return useInfiniteQuery({
		queryKey: ['blog', 'posts', params.searchTerm, params.sortBy] as const,
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			if (!supabase) throw new Error('Supabase client not initialized');
			let query = supabase
				.from('blog_posts')
				.select(`
					*,
					profiles (
						username,
						full_name
					)
				`)
				.not('published_at', 'is', null);

			if (params.searchTerm) {
				query = query.or(`title.ilike.%${params.searchTerm}%,content.ilike.%${params.searchTerm}%`);
			}

			switch (params.sortBy) {
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

			const { data, error } = await query.range(
				pageParam * ITEMS_PER_PAGE,
				(pageParam + 1) * ITEMS_PER_PAGE - 1
			);

			if (error) throw error;
			return data as BlogPost[];
		},
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined,
	});
}

export function useCreateBlogPost(): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BlogPostFormData) => {
			if (!supabase) throw new Error('Supabase client not initialized');
			const { data: { session } } = await supabase.auth.getSession();
			if (!session?.user?.id) throw new Error('User not authenticated');

			const { data: post, error } = await supabase
				.from('blog_posts')
				.insert([{
					...data,
					author_id: session.user.id,
					slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
					published_at: new Date().toISOString(),
				}])
				.select()
				.single();

			if (error) throw error;
			return post as BlogPost;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
		},
	});
}
