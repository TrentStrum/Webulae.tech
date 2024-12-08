import { apiClient } from '../lib/apiClient';

import type { Project } from './supabaseProjectDataAccess';
import type { DataAccessInterface } from '../contracts/DataAccess';

export class ProjectDataAccess implements DataAccessInterface<Project> {
	private baseUrl = '/projects';

	async getByKey(key: string, value: string): Promise<Project | null> {
		return apiClient.get<Project>(`${this.baseUrl}?${key}=${value}`);
	}

	async getById(id: string): Promise<Project> {
		return apiClient.get<Project>(`${this.baseUrl}/${id}`);
	}

	async getAll(): Promise<Project[]> {
		return apiClient.get<Project[]>(this.baseUrl);
	}

	async create(data: Partial<Project>): Promise<Project> {
		return apiClient.post<Project>(this.baseUrl, data);
	}

	async update(id: string, data: Partial<Project>): Promise<Project> {
		return apiClient.put<Project>(`${this.baseUrl}/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		await apiClient.delete(`${this.baseUrl}/${id}`);
	}
}
