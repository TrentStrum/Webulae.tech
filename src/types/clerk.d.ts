import type { UserPublicMetadata as ClerkUserPublicMetadata } from '@clerk/types';

declare module '@clerk/types' {
	interface UserPublicMetadata extends ClerkUserPublicMetadata {
		preferences?: UserPreferences;
	}
}
