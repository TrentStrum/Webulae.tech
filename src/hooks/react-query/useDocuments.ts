import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Document } from '@/src/types/document.types';

interface UploadDocumentParams {
	file: File;
	category: string;
	projectId: string;
}

export const useDocuments = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['documents'],
		queryFn: async () => {
			try {
				const response = await apiClient.get<Document[]>('/documents');
				return response;
			} catch (error) {
				console.error('Error fetching documents:', error);
				throw error;
			}
		},
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
		retry: 3,
	});

	return { documents: data || [], isLoading, error };
};

export const useUploadDocument = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, error } = useMutation<
		Document,
		Error,
		UploadDocumentParams
	>({
		mutationFn: async ({ file, category, projectId }) => {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('category', category);
			formData.append('projectId', projectId);

			return await apiClient.post<FormData, Document>('/documents/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['documents'] });
		},
	});

	return { uploadDocument: mutateAsync, isUploading: isPending, error };
};

export const useProjectDocuments = (projectId: string) => {
	return useQuery({
		queryKey: ['documents', 'project', projectId],
		queryFn: async () => {
			const response = await apiClient.get<Document[]>(`/projects/${projectId}/documents`);
			return response;
		},
		enabled: !!projectId,
	});
};
