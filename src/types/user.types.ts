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
	full_name: string;
	company_name?: string;
	phone_number?: string;
	address?: string;
	avatar?: File;
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
export type DatabaseProfile = {
	id: string;
	role: UserRole;
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

export interface User extends DatabaseProfile {
	role: UserRole;
	status: UserStatus;
	profile: UserProfile;
	preferences: UserPreferences;
	organizationId: string;
}

export enum UserRole {
	ADMIN = 'admin',
	CLIENT = 'client',
	DEVELOPER = 'developer'
}

export enum UserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	PENDING = 'pending'
}

export interface UserProfile {
	displayName: string;
	avatarUrl?: string;
	bio?: string;
	socialLinks?: Record<string, string>;
}

export interface UserPreferences {
	theme: 'light' | 'dark' | 'system';
	notifications: {
		email: boolean;
		push: boolean;
	};
	dashboard: {
		layout: 'grid' | 'list';
		defaultView: 'week' | 'month' | 'year';
	};
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
}
