export interface AdminStats {
	totalUsers: number;
	activeUsers: number;
	totalOrganizations: number;
	activeSubscriptions: number;
	revenue: {
		monthly: number;
		annual: number;
		total: number;
	};
}

export interface Member {
	id: string;
	email: string;
	name?: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinedAt: string;
	lastActive?: string;
}
