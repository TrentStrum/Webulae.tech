import type { Project } from '../dataAccess/supabaseProjectDataAccess';
import type { ProjectFormData } from '@/src/schemas/projectSchema';

export interface DataAccessInterface<T> {
	getByKey(key: string, value: string, single?: boolean): Promise<T | T[] | null>;
	getAll(): Promise<T[]>;
	create(data: Partial<T>): Promise<T>;
	update(id: string, data: Partial<T>): Promise<T>;
	delete(id: string): Promise<void>;
}

export interface ProjectDataAccess {
	createProject(data: ProjectFormData): Promise<Project>;
	// Add other project-related methods as needed
}
