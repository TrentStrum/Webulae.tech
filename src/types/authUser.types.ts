export type AuthUser = {
	id: string;
	email: string;
	role: 'admin' | 'client' | 'developer';
	avatar_url?: string;
};
