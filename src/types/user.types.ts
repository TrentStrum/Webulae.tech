export type User = {
	id: string;
	email: string | null;
	role: 'client' | 'admin' | 'developer';
	username: string | null;
	full_name: string | null;
};
