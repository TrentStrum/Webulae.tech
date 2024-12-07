'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createClient } from '@/src/lib/supabase/client';

import type { Project } from '@/src/types/project.types';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

export function useProject(id: string): UseQueryResult<Project> {
	return useQuery({
		queryKey: ['project', id],
		queryFn: async () => {
			const supabase = createClient();
			if (!supabase) throw new Error('Supabase client not initialized');
			const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
			if (error) throw error;
			return data;
		},
	});
}

export function useDeleteProject(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const supabase = createClient();
			if (!supabase) throw new Error('Supabase client not initialized');
			const { error } = await supabase.from('projects').delete().eq('id', id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});
}
