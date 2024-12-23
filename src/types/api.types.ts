export interface ApiResponse<T> {
	data: T;
	pagination?: {
		page: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
	message?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		hasMore: boolean;
	};
}

export interface ApiError {
	message: string;
	code?: string;
	status?: number;
}

export interface AdminMembersParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
	[key: string]: unknown;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	search?: string;
	sort?: string;
	order?: 'asc' | 'desc';
	[key: string]: unknown;
} 