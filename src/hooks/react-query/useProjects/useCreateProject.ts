'use client';

import { useMutation } from '@tanstack/react-query';

import type { ProjectDataAccess } from '@/src/contracts/DataAccess';
import type { ProjectFormData } from '@/src/schemas/projectSchema';

export function useCreateProject(dataAccess: ProjectDataAccess) {
  return useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return await dataAccess.createProject(data);
    }
  });
}