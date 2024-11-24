import { supabaseClient } from "../lib/supabaseClient";
import { DataAccessInterface } from "../contracts/DataAccess";


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

export type CreateProject = Partial<Project> & { name: string };

export class SupabaseProjectDataAccess implements DataAccessInterface<Project> {
	private table = 'projects' as const;

	async getById(id: string): Promise<Project> {
		const { data, error } = await supabaseClient.from(this.table).select('*').eq('id', id).single();
		if (error) throw new Error(error.message);
		return data as Project;
	}

	async getAll(): Promise<Project[]> {
		const { data, error } = await supabaseClient.from(this.table).select('*');
		if (error) throw new Error(error.message);
		return data as Project[];
	}

	async create(data: CreateProject & { projectId: string; userId: string }): Promise<Project> {
		const { data: created, error } = await supabaseClient.from(this.table).insert(data).single();
		if (error) throw new Error(error.message);
		if (!created || typeof created !== 'object') throw new Error("Created project data is null or undefined.");
		return { ...(created as object), projectId: data.projectId, userId: data.userId } as Project;
	}

	async update(id: string, data: Partial<Project>): Promise<Project> {
		const { data: updated, error } = await supabaseClient
			.from(this.table)
			.update(data)
			.eq('id', id)
			.single();
		if (error) throw new Error(error.message);
		if (!updated || typeof updated !== 'object') throw new Error("Updated project data is null or undefined.");
		return { ...(updated as object), projectId: data.projectId, userId: data.userId } as Project;
	}

	async delete(id: string): Promise<void> {
		const { error } = await supabaseClient.from(this.table).delete().eq('id', id);
		if (error) throw new Error(error.message);
	}
}
