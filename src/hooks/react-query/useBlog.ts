'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { supabase } from '@/src/lib/supabase';

import type { BlogPost, BlogPostFormData } from '@/src/types/blog.types';
import type {
	UseInfiniteQueryResult,
	UseQueryResult,
	UseMutationResult,
} from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

interface UseBlogPostsParams {
	searchTerm?: string;
	sortBy?: string;
}

interface BlogPostsResponse {
	pages: Array<{
		data: BlogPost[];
		nextCursor?: number;
	}>;
	pageParams: number[];
}

export function useBlogPosts({
	searchTerm,
	sortBy,
}: UseBlogPostsParams): UseInfiniteQueryResult<BlogPostsResponse> {
	return useInfiniteQuery({
		queryKey: ['blog-posts', searchTerm, sortBy] as const,
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			if (!supabase) throw new Error('Supabase client not initialized');
			let query = supabase
				.from('blog_posts')
				.select(
					`
					*,
					profiles (
						username,
						full_name
					)
				`
				)
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

			const { data, error } = await query.range(
				pageParam * ITEMS_PER_PAGE,
				(pageParam + 1) * ITEMS_PER_PAGE - 1
			);

			if (error) throw error;
			return {
				data: data as BlogPost[],
				nextCursor: data.length === ITEMS_PER_PAGE ? (pageParam as number) + 1 : undefined,
			};
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});
}

export function useBlogPost(slug: string): UseQueryResult<BlogPost> {
	return useQuery({
		queryKey: ['blog', 'post', slug],
		queryFn: async () => {
			if (!supabase) throw new Error('Supabase client not initialized');
			const { data, error } = await supabase
				.from('blog_posts')
				.select(
					`
					*,
					profiles (
						username,
						full_name
					)
				`
				)
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

export function useCreateBlogPost(): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BlogPostFormData) => {
			if (!supabase) throw new Error('Supabase client not initialized');
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session?.user?.id) throw new Error('User not authenticated');

			const { data: post, error } = await supabase
				.from('blog_posts')
				.insert([
					{
						...data,
						author_id: session.user.id,
						slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
						published_at: new Date().toISOString(),
					},
				])
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
