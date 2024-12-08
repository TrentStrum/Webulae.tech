'use client';

import { useMutation } from '@tanstack/react-query';

import { ProjectDataAccess } from '@/src/dataAccess/projectDataAccess';

import type { Project } from '@/src/types';
import type { UseMutationResult } from '@tanstack/react-query';

type CreateProjectData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

export function useCreateProject(): UseMutationResult<Project, Error, CreateProjectData> {
	const dataAccess = new ProjectDataAccess();
	return useMutation({
		mutationFn: (data: CreateProjectData) => dataAccess.create(data),
	});
}
