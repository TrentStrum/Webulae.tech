'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Document } from '@/src/types/document.types';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

interface UploadDocumentParams {
	file: File;
	category: string;
	projectId: string;
}

export function useDocuments(): UseQueryResult<Document[], Error> {
	return useQuery({
		queryKey: ['documents'],
		queryFn: async () => {
			const response = await apiClient.get<Document[]>('/documents');
			return response;
		},
		staleTime: 1000 * 60 * 5,
	});
}

export function useUploadDocument(): UseMutationResult<Document, Error, UploadDocumentParams> {
	const queryClient = useQueryClient();

	return useMutation<Document, Error, UploadDocumentParams>({
		mutationFn: async ({ file, category, projectId }) => {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('category', category);
			formData.append('projectId', projectId);

			return await apiClient.post<Document, FormData>('/documents/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['documents'] });
		},
	});
}

export function useProjectDocuments(projectId: string): UseQueryResult<Document[], Error> {
	return useQuery({
		queryKey: ['documents', 'project', projectId],
		queryFn: async () => {
			const response = await apiClient.get<Document[]>(`/projects/${projectId}/documents`);
			return response;
		},
		enabled: !!projectId,
	});
}
