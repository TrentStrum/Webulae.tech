import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { supabaseClient } from '@/src/lib/supabaseClient';
import { Project } from '@/src/types/project.types';
import { Message } from '@/src/types/message.types';

export const useProjects = () => {
	const queryClient = useQueryClient();

	const useGetProjects = () =>
		useQuery({
			queryKey: ['projects'],
			queryFn: async () => {
				const response = await apiClient.get<{ data: Project[] }>('/projects');
				return response.data;
			},
			staleTime: 5 * 60 * 1000, // Cache for 5 minutes
		});

	const useGetProjectById = (projectId: string) =>
		useQuery({
			queryKey: ['projects', projectId],
			queryFn: async () => {
				const response = await apiClient.get<Project>(`/projects/${projectId}`);
				return response;
			},
			enabled: !!projectId,
		});

	const useProjectMembers = (projectId?: string) =>
		useQuery({
			queryKey: ['project-members', projectId],
			queryFn: async () => {
				if (!projectId) throw new Error('Project ID is required');
				
				const { data, error } = await supabaseClient
					.from('project_members')
					.select(`
						user_id,
						role,
						profiles (
							username,
							full_name,
							role
						)
					`)
					.eq('project_id', projectId);

				if (error) throw error;
				return data;
			},
			enabled: !!projectId,
		});

	const useProjectMessages = (projectId: string) =>
		useQuery({
			queryKey: ['project-messages', projectId],
			queryFn: async () => {
				const response = await apiClient.get<{ data: Message[] }>(`/projects/${projectId}/messages`);
				return response.data;
			},
			enabled: !!projectId,
		});

	// Mutations
	const useAddProjectMember = () =>
		useMutation({
			mutationFn: async ({ projectId, userId, role }: { projectId: string; userId: string; role: string }) => {
				const { error } = await supabaseClient
					.from('project_members')
					.insert([{ project_id: projectId, user_id: userId, role }]);

				if (error) throw error;
			},
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({ queryKey: ['project-members', variables.projectId] });
			},
		});

	return {
		useGetProjects,
		useGetProjectById,
		useProjectMembers,
		useProjectMessages,
		useAddProjectMember,
	};
};
