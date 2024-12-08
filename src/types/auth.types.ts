import type { AuthUser } from './user.types';

export interface AuthState<T = AuthUser> {
	user: T | null;
	isAuthenticated: boolean;
	isPending: boolean;
}
