import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { BlogPostFormData, BlogPost } from '@/src/types/blog.types';

const ITEMS_PER_PAGE = 10;

// Fetch a single blog post by ID
export const useBlogPost = (id: string, enabled: boolean = true) =>
	useQuery<BlogPost>({
		queryKey: ['blogPost', id],
		queryFn: async () => {
			return apiClient.get<BlogPost>(`/blog/${id}`);
		},
		enabled,
		staleTime: 1000 * 60 * 5,
	});

// Fetch all blog posts with infinite scrolling, search, and sorting
export const useBlogPosts = ({ searchTerm = '', sortBy = 'newest' }) => {
	const fetchBlogPosts = async ({ pageParam = 0 }) => {
		const response = await apiClient.get<BlogPost[]>(`/blog`, {
			params: {
				searchTerm,
				sortBy,
				offset: pageParam * ITEMS_PER_PAGE,
				limit: ITEMS_PER_PAGE,
			},
		});
		return response;
	};

	return useInfiniteQuery({
		queryKey: ['blogPosts', searchTerm, sortBy],
		queryFn: fetchBlogPosts,
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined,
	});
};

export const useAdminBlogPost = (id: string, enabled: boolean = true) =>
	useQuery<BlogPost>({
		queryKey: ['blogPost', id],
		queryFn: async () => {
			return apiClient.get<BlogPost>(`/admin/blog/edit/${id}`);
		},
		enabled,
		staleTime: 1000 * 60 * 5,
	});

export const useAdminBlogPosts = ({ searchTerm = '', sortBy = 'newest' }) => {
	const queryClient = useQueryClient();

	// Fetch blog posts
	const fetchBlogPosts = async ({ pageParam = 0 }) => {
		const response = await apiClient.get<BlogPost[]>(`/admin/blog`, {
			params: {
				searchTerm,
				sortBy,
				offset: pageParam * ITEMS_PER_PAGE,
				limit: ITEMS_PER_PAGE,
			},
		});
		return response;
	};

	const deleteBlogPost = useMutation({
		mutationFn: async (postId: string) => {
			await apiClient.delete(`/admin/blog/${postId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] }); // Refresh blog list after deletion
		},
	});

	return {
		blogPostsQuery: useInfiniteQuery({
			queryKey: ['adminBlogPosts', searchTerm, sortBy],
			queryFn: fetchBlogPosts,
			initialPageParam: 0,
			getNextPageParam: (lastPage, allPages) =>
				lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined,
		}),
		deleteBlogPost,
	};
};

// Create a new blog post
export const useCreateBlogPost = () => {
	const queryClient = useQueryClient();

	return useMutation<BlogPost, Error, BlogPostFormData>({
		mutationFn: async (data: BlogPostFormData) => {
			const slug = data.title.toLowerCase().replace(/ /g, '-');
			return apiClient.post<BlogPostFormData, BlogPost>('/admin/blog/new', { ...data, slug });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
		},
	});
};

// Update an existing blog post
export const useUpdateBlogPost = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation<BlogPost, Error, Partial<BlogPost>>({
		mutationFn: async (data: Partial<BlogPost>) => {
			try {
				const response = await apiClient.put<BlogPost>(`/admin/blog/edit/${id}`, data);
				if (!response) {
					throw new Error('No response from server');
				}
				return response;
			} catch (error: any) {
				console.error('API Error:', error);
				throw new Error(error.response?.data?.message || error.message || 'Failed to update blog post');
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
			queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
			queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] }); // Also invalidate admin posts
		},
	});
};

// Upload an image
export const useUploadImage = () =>
	useMutation<string, Error, File>({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append('file', file);

			const response = await apiClient.post<FormData, { url: string }>('/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			return response.url;
		},
	});
