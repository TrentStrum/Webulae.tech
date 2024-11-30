export type AuthUser = {
	id: string;
	email: string;
	user_metadata?: {
		role?: string;
	};
	app_metadata?: {
		role?: string;
	};
	role: 'client' | 'admin' | 'developer';
	avatar_url?: string | null;
};
