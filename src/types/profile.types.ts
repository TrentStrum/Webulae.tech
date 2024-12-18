export type Profile = {
	id: string;
	role: 'admin' | 'client' | 'developer';
	username?: string;
	fullName?: string;
};
