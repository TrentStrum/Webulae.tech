import { supabase } from '@/src/lib/supabase/server';

import type { DataAccessInterface } from '@/src/contracts/DataAccess';
import type { ProjectFormData } from '@/src/schemas/projectSchema';
import type { Project } from '@/src/types/project.types';

export class SupabaseProjectDataAccess implements DataAccessInterface<Project> {
	private table = 'projects' as const;

	async getById(id: string): Promise<Project> {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
		if (error) throw new Error(error.message);
		if (!data) throw new Error('Project data is null or undefined.');
		return data as Project;
	}

	async getAll(): Promise<Project[]> {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const { data, error } = await supabase.from(this.table).select('*');
		if (error) throw new Error(error.message);
		if (!data) throw new Error('Project data is null or undefined.');
		return data as Project[];
	}

	async create(data: Partial<Project>): Promise<Project> {
		const { data: project, error } = await supabase
			.from(this.table)
			.insert([data])
			.select()
			.single();

		if (error) throw new Error(error.message);
		if (!project) throw new Error('Failed to create project');
		return project as Project;
	}

	async update(id: string, data: Partial<Project>): Promise<Project> {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const { data: updated, error } = await supabase
			.from(this.table)
			.update(data)
			.eq('id', id)
			.single();
		if (error) throw new Error(error.message);
		if (!updated || typeof updated !== 'object')
			throw new Error('Updated project data is null or undefined.');
		return { ...(updated as object), projectId: data.projectId, userId: data.userId } as Project;
	}

	async delete(id: string): Promise<void> {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const { error } = await supabase.from(this.table).delete().eq('id', id);
		if (error) throw new Error(error.message);
	}

	async createProject(data: ProjectFormData): Promise<Project> {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const { data: project, error } = await supabase
			.from(this.table)
			.insert([data])
			.select()
			.single();

		if (error) throw error;
		return project as Project;
	}

	async getByKey(key: string, value: string, single = true): Promise<Project | Project[] | null> {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const query = supabase.from(this.table).select('*').eq(key, value);

		if (single) {
			const { data, error } = await query.single();
			if (error) throw new Error(error.message);
			return data as Project;
		}

		const { data, error } = await query;
		if (error) throw new Error(error.message);
		return data as Project[];
	}
}
