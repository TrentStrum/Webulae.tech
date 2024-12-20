
export type ClerkUserRole = 'admin' | 'developer' | 'client';

export interface ClerkMetadata {
	role?: ClerkUserRole;
	// Add other metadata fields as needed
}

declare module '@clerk/types' {
	interface UserPublicMetadata extends ClerkMetadata {}
}

// Type for our mapped user
export interface AppUser {
	id: string;
	email: string;
	role: ClerkUserRole;
	fullName?: string;
	imageUrl?: string;
}

export interface ClerkUser {
	id: string;
	organizationId?: string;
	emailAddresses: Array<{ emailAddress: string }>;
	firstName: string | null;
	lastName: string | null;
}

export interface ClerkOrganization {
	id: string;
	name: string;
}
