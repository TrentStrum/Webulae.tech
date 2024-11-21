import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/api/queryKeys';

export function useProjectMembers(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.projects.members(projectId),
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required');
      
      const { data, error } = await supabase
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
}

export function useAddProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId, role }: { projectId: string; userId: string; role: string }) => {
      const { error } = await supabase
        .from('project_members')
        .insert([{ project_id: projectId, user_id: userId, role }]);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.members(variables.projectId) });
    },
  });
}