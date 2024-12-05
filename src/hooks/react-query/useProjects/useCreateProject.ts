'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { supabase } from '@/src/lib/supabase';
import { ProjectFormData } from '@/src/schemas/projectSchema';

export function useCreateProject() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: createProject, isPending: isLoading } = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Not authenticated');
      }

      // Start a transaction
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Create project member entry
      const { error: memberError } = await supabase
        .from('project_members')
        .insert([{
          project_id: project.id,
          user_id: session.user.id,
          role: 'admin'
        }]);

      if (memberError) {
        // Rollback by deleting the project
        await supabase
          .from('projects')
          .delete()
          .eq('id', project.id);
        throw memberError;
      }

      return project;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Project created successfully.',
      });
      router.push('/admin/projects');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project.',
        variant: 'destructive',
      });
    },
  });

  return {
    createProject,
    isLoading,
  };
}