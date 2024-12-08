export type AuthUser = {
	id: string;
	email: string | null;
	username?: string;
	avatar_url?: string;
	role: 'admin' | 'developer' | 'client';
};
