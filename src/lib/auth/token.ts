import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
	sub: string;
	exp: number;
	role: string;
}

export const tokenUtils = {
	getToken: () => localStorage.getItem('authToken'),

	setToken: (token: string) => {
		localStorage.setItem('authToken', token);
		localStorage.setItem('tokenTimestamp', Date.now().toString());
	},

	removeToken: () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('tokenTimestamp');
	},

	isTokenExpired: (token: string): boolean => {
		try {
			const decoded = jwtDecode<TokenPayload>(token);
			return decoded.exp * 1000 < Date.now();
		} catch {
			return true;
		}
	},

	getTokenPayload: (token: string): TokenPayload | null => {
		try {
			return jwtDecode<TokenPayload>(token);
		} catch {
			return null;
		}
	},

	refreshIfNeeded: async (): Promise<boolean> => {
		const token = localStorage.getItem('authToken');
		const timestamp = localStorage.getItem('tokenTimestamp');

		if (!token || !timestamp) return false;

		// Check if token is older than 25 minutes
		const timeDiff = Date.now() - parseInt(timestamp);
		if (timeDiff > 25 * 60 * 1000) {
			try {
				// Implement refresh token logic here
				return true;
			} catch {
				return false;
			}
		}
		return true;
	},
};
