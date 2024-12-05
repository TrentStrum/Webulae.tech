export const queryKeys = {
	projects: {
		all: ['projects'] as const,
		detail: (id: string) => ['projects', id] as const,
		members: (id: string) => ['projects', id, 'members'] as const,
		timeline: (id: string) => ['projects', id, 'timeline'] as const,
		updates: (id: string) => ['projects', id, 'updates'] as const,
		documents: (id: string) => ['projects', id, 'documents'] as const,
		messages: (id: string) => ['projects', id, 'messages'] as const,
		invoices: (id: string) => ['projects', id, 'invoices'] as const,
	},
	users: {
		all: ['users'] as const,
		detail: (id: string) => ['users', id] as const,
		profile: ['profile'] as const,
	},
	blog: {
		all: ['blog'] as const,
		detail: (id: string) => ['blog', id] as const,
		comments: (id: string) => ['blog', id, 'comments'] as const,
	},
};
