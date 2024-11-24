export type AuthUser = {
	id: string;
	email: string;
	role: 'client' | 'admin' | 'developer';
	avatar_url?: string | null;
};
