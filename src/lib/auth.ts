import type { DatabaseProfile } from '@/src/types/user.types';
import type { UserResource } from '@clerk/types';

type UserRole = 'admin' | 'developer' | 'client';

export const mapClerkUser = (user: UserResource): DatabaseProfile => ({
	id: user.id,
	email: user.primaryEmailAddress?.emailAddress || '',
	username: user.username || '',
	role: (user.publicMetadata.role as UserRole) || 'client',
	profile_image: user.imageUrl,
	avatar_url: user.imageUrl,
	full_name: `${user.firstName} ${user.lastName}`.trim(),
	bio: '',
	website: '',
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	last_sign_in_at: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
});
