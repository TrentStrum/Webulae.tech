import type { ProjectFormData } from '@/src/schemas/projectSchema';

export interface DataAccessInterface<T> {
	getAll?: () => Promise<T[]>;
	getById?: (id: string) => Promise<T | null>;
	create?: (data: Partial<T>) => Promise<T | null>;
	update?: (id: string, data: Partial<T>) => Promise<T | null>;
	delete?: (id: string) => Promise<void>;
}

export interface ProjectDataAccess {
	createProject(data: ProjectFormData): Promise<any>;
	// Add other project-related methods as needed
}
