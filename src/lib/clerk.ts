import type { DatabaseProfile } from '@/src/types/user.types';
import type { User } from '@clerk/nextjs';

type UserRole = 'admin' | 'developer' | 'client';

export const mapClerkUser = (user: NonNullable<User>): DatabaseProfile => ({
	id: user.id,
	email: user.primaryEmailAddress?.emailAddress || '',
	username: user.username,
	role: (user.publicMetadata.role as UserRole) || 'client',
	profile_image: user.imageUrl || null,
	avatar_url: user.imageUrl || null,
	full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
	bio: null,
	website: null,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	last_sign_in_at: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
});
