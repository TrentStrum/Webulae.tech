export interface Settings {
	id: string;
	theme: 'light' | 'dark' | 'system';
	notifications: {
		email: boolean;
		push: boolean;
		desktop: boolean;
	};
	language: string;
	timezone: string;
	updatedAt: string;
} 