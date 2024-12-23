export interface Member {
	id: string;
	email: string;
	name?: string;
	role: string;
	status: 'pending' | 'active' | 'inactive';
	joinedAt?: string;
	updatedAt?: string;
}
