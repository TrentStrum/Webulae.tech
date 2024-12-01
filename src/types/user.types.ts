// Base user properties
export type BaseUser = {
	id: string;
	email: string | null;
	role: 'client' | 'admin' | 'developer';
	username: string | null;
	full_name: string | null;
};

// Extended profile information
export type Profile = BaseUser & {
	bio: string | null;
	website: string | null;
	avatar_url: string | null;
	created_at?: string;
	updated_at: string;
};

// Auth-specific properties
export type AuthUser = BaseUser & {
	user_metadata?: {
		role?: string;
	};
	app_metadata?: {
		role?: string;
	};
};

// Export a type alias for the most commonly used user type
export type User = Profile;
