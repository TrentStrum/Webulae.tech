import { apiClient } from '@/src/lib/apiClient';
import { BlogFormData, BlogPost } from '@/src/types/blog.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


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

// Fetch all blog posts
export const useBlogPosts = () =>
	useQuery<BlogPost[]>({
		queryKey: ['blogPosts'],
		queryFn: async () => {
			return apiClient.get<BlogPost[]>('/blog');
		},
		staleTime: 1000 * 60 * 5,
	});

// Create a new blog post
export const useCreateBlogPost = () => {
	const queryClient = useQueryClient();

	return useMutation<BlogPost, Error, BlogFormData>({
		mutationFn: async (data: BlogFormData) => {
			const slug = data.title.toLowerCase().replace(/ /g, '-');
			return apiClient.post<BlogFormData, BlogPost>('/blog', {
				...data,
				slug,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
		},
	});
};

// Update an existing blog post
export const useUpdateBlogPost = () => {
	const queryClient = useQueryClient();

	return useMutation<BlogPost, Error, Partial<BlogPost>>({
		mutationFn: async (data: Partial<BlogPost>) => {
			return apiClient.put<BlogPost>(`/blog/${data.id}`, data);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id] });
			queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
		},
	});
};

// Upload an image
export const useUploadImage = () =>
	useMutation<string, Error, File>({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append('file', file);

			const response = await apiClient.post<{ url: string }>('/upload');
			return response.url;
		},
	});
