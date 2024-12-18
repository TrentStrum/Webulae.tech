// Base user properties
export type BaseUser = {
	id: string;
	email: string;
	role: 'admin' | 'client' | 'developer';
	username: string | null;
	last_sign_in_at: string | null;
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
	username?: string;
	user_metadata?: {
		role?: string;
	};
	app_metadata?: {
		role?: string;
	};
};

// Export a type alias for the most commonly used user type
export type User = DatabaseProfile;

export type DatabaseProfile = {
	id: string;
	role: 'admin' | 'client' | 'developer';
	email: string;
	username: string | null;
	full_name: string | null;
	bio: string | null;
	website: string | null;
	last_sign_in_at: string | null;
	avatar_url: string | null;
	profile_image: string | null;
	created_at: string;
	updated_at: string;
};
