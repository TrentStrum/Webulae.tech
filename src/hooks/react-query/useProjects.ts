import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/src/types/project.types';
import { DataAccessInterface } from '@/src/contracts/DataAccess';

// Use Dependency Injection for the data access implementation
export const createProjectHooks = (dataAccess: DataAccessInterface<Project>) => {
	const useGetProjects = () =>
		useQuery({
			queryKey: ['projects'],
			queryFn: () => dataAccess.getAll(),
			staleTime: 5 * 60 * 1000, // Cache for 5 minutes
		});

	const useGetProjectById = (id: string) =>
		useQuery({
			queryKey: ['projects', id],
			queryFn: () => dataAccess.getById(id),
			enabled: !!id, // Fetch only if id is provided
		});

	const useCreateProject = () => {
		const queryClient = useQueryClient();

		return useMutation({
			mutationFn: (data: Partial<Project>) => dataAccess.create(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['projects'] });
			},
		});
	};

	const useUpdateProject = () => {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
				dataAccess.update(id, data),
			onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
		});
	};

	const useDeleteProject = () => {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: ({ id }: { id: string }) => dataAccess.delete(id),
			onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
		});
	};

	return {
		useGetProjects,
		useGetProjectById,
		useCreateProject,
		useUpdateProject,
		useDeleteProject,
	};
};
