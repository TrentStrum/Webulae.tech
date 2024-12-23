export interface SearchResults {
	items: Array<{
		id: string;
		type: 'project' | 'document' | 'message' | 'user';
		title: string;
		description?: string;
		url: string;
		createdAt: string;
		updatedAt: string;
		metadata?: Record<string, unknown>;
	}>;
	total: number;
	page: number;
	perPage: number;
} 