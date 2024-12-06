import { supabase } from '../lib/supabase';

import type { DataAccessInterface } from '../contracts/DataAccess';
import type { ProjectFormData } from '@/src/schemas/projectSchema';

export interface Project {
	id: string;
	name: string;
	description: string | null;
	dev_environment_url: string | null;
	staging_environment_url: string | null;
	start_date: string | null;
	target_completion_date: string | null;
	status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'review';
	created_at: string;
	updated_at: string;
	projectId: string;
	userId: string;
}

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

	async create(data: Partial<Project>): Promise<Project | null> {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		if (!data.name || !data.projectId || !data.userId) return null;

		const { data: created, error } = await supabase
			.from(this.table)
			.insert(data as Required<Pick<Project, 'name'>>)
			.single();

		if (error) throw new Error(error.message);
		if (!created) return null;

		return created as Project;
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

	async createProject(data: ProjectFormData) {
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const { data: project, error } = await supabase
			.from('projects')
			.insert([data])
			.select()
			.single();

		if (error) throw error;
		return project;
	}
}
