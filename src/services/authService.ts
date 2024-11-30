import { AuthDataAccess } from '@/src/dataAccess/authDataAccess';
import { AuthUser } from '@/src/types/authUser.types';

export const authService = {
	getSession: () => AuthDataAccess.getSession(),
	getUserProfile: (userId: string) => AuthDataAccess.getUserProfile(userId),
	login: (email: string, password: string) => AuthDataAccess.login(email, password),
	logout: () => AuthDataAccess.logout(),
	onAuthStateChange: (callback: (user: AuthUser | null) => void) =>
		AuthDataAccess.onAuthStateChange(callback),
};
