import { supabaseClient } from '@/src/lib/supabaseClient';
import { useInfiniteQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

interface UseArticlesParams {
	searchTerm: string;
	sortBy: string;
}

export const useArticles = ({ searchTerm, sortBy }: UseArticlesParams) => {
	const fetchArticles = async ({ pageParam = 0 }) => {
		let query = supabaseClient
			.from('blog_posts')
			.select(
				`
          id,
          title,
          slug,
          excerpt,
          published_at,
          profiles (
            username,
            full_name
          )
        `,
			)
			.not('published_at', 'is', null)
			.range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

		// Apply search filter
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

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
		useInfiniteQuery({
			queryKey: ['articles', searchTerm, sortBy],
			queryFn: fetchArticles,
			initialPageParam: 0,
			getNextPageParam: (lastPage, allPages) =>
				lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined,
		});

	return {
		articles: data?.pages.flat() || [],
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
	};
};
