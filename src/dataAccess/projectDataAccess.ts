import { supabase } from '@/src/lib/supabase/config';

import { apiClient } from '../lib/apiClient';

import type { Project } from './supabaseProjectDataAccess';
import type { DataAccessInterface } from '../contracts/DataAccess';
import type { Result } from '../types/result.types';
import type { SupabaseClient } from '@supabase/supabase-js';


export class ProjectDataAccess implements DataAccessInterface<Project> {
	private baseUrl = '/projects';
	private client: SupabaseClient = supabase;

	async getByKey(key: string, value: string): Promise<Project | null> {
		const response = await apiClient.get<Project>(`${this.baseUrl}?${key}=${value}`);
		return response.data;
	}

	async getById(id: string): Promise<Result<Project>> {
		try {
			const { data, error } = await this.client
				.from('projects')
				.select('*')
				.eq('id', id)
				.single();

			if (error) return { ok: false, error };
			if (!data) return { ok: false, error: new Error('Project not found') };
			return { ok: true, data };
		} catch (error) {
			return { ok: false, error: error as Error };
		}
	}

	async getAll(): Promise<Project[]> {
		const response = await apiClient.get<Project[]>(this.baseUrl);
		return response.data;
	}

	async create(data: Partial<Project>): Promise<Project> {
		const response = await apiClient.post<Project>(this.baseUrl, data);
		return response.data;
	}

	async update(id: string, data: Partial<Project>): Promise<Project> {
		const response = await apiClient.put<Project>(`${this.baseUrl}/${id}`, data);
		return response.data;
	}

	async delete(id: string): Promise<void> {
		await apiClient.delete(`${this.baseUrl}/${id}`);
	}
}
