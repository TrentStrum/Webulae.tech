export const endpoints = {
	projects: {
		base: '/projects',
		developer: '/projects/developer',
		detail: (id: string) => `/projects/${id}`,
		members: (projectId: string) => `/projects/${projectId}/members`,
		messages: (id: string) => `/projects/${id}/messages`,
		documents: (id: string) => `/projects/${id}/documents`,
		timeline: (id: string) => `/projects/${id}/timeline`,
		scopeChange: (id: string) => `/projects/${id}/scope-change`,
	},
	users: {
		base: '/users',
		detail: (id: string) => `/users/${id}`,
		profile: '/api/users/profile',
		preferences: '/api/users/preferences',
	},
	messages: {
		base: '/messages',
		byProject: (projectId: string) => `/messages/project/${projectId}`,
	},
	documents: {
		base: '/documents',
		byProject: (projectId: string) => `/documents/project/${projectId}`,
	},
	admin: {
		dashboard: '/admin/dashboard',
		stats: '/api/admin/stats',
		members: '/api/admin/members',
		roles: '/api/admin/roles',
	},
	notifications: {
		base: '/notifications',
		unread: '/notifications/unread',
	},
	timeline: {
		base: '/timeline',
		byProject: (projectId: string) => `/timeline/project/${projectId}`,
	},
	blog: {
		base: '/api/blog',
		detail: (id: string) => `/api/blog/${id}`,
	},
	settings: {
		base: '/settings',
		user: '/settings/user',
		project: (projectId: string) => `/settings/project/${projectId}`,
	},
	analytics: {
		base: '/analytics',
		project: (projectId: string) => `/analytics/project/${projectId}`,
		user: '/analytics/user',
		events: '/analytics/events',
	},
	search: {
		base: '/search',
	},
	profile: {
		current: '/profile',
		detail: (userId: string) => `/profile/${userId}`,
	},
	scopeChanges: {
		base: '/scope-changes',
		byProject: (projectId: string) => `/projects/${projectId}/scope-changes`,
	},
	subscription: {
		base: '/subscription',
		detail: (userId: string) => `/subscription/${userId}`,
		history: (subscriptionId: string) => `/subscription/${subscriptionId}/history`,
		paymentMethods: '/subscription/payment-methods',
		paymentMethod: (id: string) => `/subscription/payment-methods/${id}`,
		create: '/subscription/create',
		update: (id: string) => `/subscription/${id}/update`,
		current: '/subscription/current',
	},
	organizations: {
		base: '/organizations',
		detail: (id: string) => `/organizations/${id}`,
		settings: (id: string) => `/organizations/${id}/settings`,
		members: (id: string) => `/organizations/${id}/members`,
	},
	dashboard: {
		activity: '/dashboard/activity',
		search: '/dashboard/search',
	},
	auth: {
		account: '/auth/account',
		profile: '/auth/profile',
		password: '/auth/password',
		session: '/auth/session',
	},
} as const;