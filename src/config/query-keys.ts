import type { AdminMembersParams } from "../types/api.types";
import type { ActivityParams } from '@/src/types/dashboard.types';

export const queryKeys = {
	projects: {
		all: ['projects'] as const,
		developer: ['projects', 'developer'] as const,
		detail: (id: string) => ['projects', id] as const,
		members: (projectId: string) => ['projects', projectId, 'members'] as const,
		list: (filters?: Record<string, unknown>) => ['projects', 'list', filters] as const,
		messages: (projectId: string) => ['projects', projectId, 'messages'] as const,
		documents: (projectId: string) => ['projects', projectId, 'documents'] as const,
		timeline: (projectId: string) => ['projects', projectId, 'timeline'] as const,
	},
	users: {
		all: ['users'] as const,
		me: ['users', 'me'] as const,
		detail: (id: string) => ['users', id] as const,
		profile: ['users', 'profile'] as const,
		preferences: ['users', 'preferences'] as const,
	},
	messages: {
		all: ['messages'] as const,
		byProject: (projectId: string) => ['messages', projectId] as const,
	},
	documents: {
		all: ['documents'] as const,
		byProject: (projectId: string) => ['documents', projectId] as const,
	},
	notifications: {
		all: ['notifications'] as const,
		unread: ['notifications', 'unread'] as const,
	},
	timeline: {
		all: ['timeline'] as const,
		byProject: (projectId: string) => ['timeline', projectId] as const,
	},
	blog: {
		all: ['blog'] as const,
		detail: (id: string) => ['blog', id] as const,
	},
	settings: {
		user: ['settings', 'user'] as const,
		project: (projectId: string) => ['settings', 'project', projectId] as const,
	},
	analytics: {
		project: (projectId: string) => ['analytics', 'project', projectId] as const,
		user: ['analytics', 'user'] as const,
	},
	search: {
		query: (term: string) => ['search', term] as const,
	},
	profile: {
		current: ['profile'] as const,
		detail: (userId: string) => ['profile', userId] as const,
	},
	scopeChanges: {
		all: ['scopeChanges'] as const,
		byProject: (projectId: string) => ['scopeChanges', projectId] as const,
	},
	subscription: {
		detail: (userId: string) => ['subscription', userId] as const,
		history: (subscriptionId: string) => ['subscription', subscriptionId, 'history'] as const,
		paymentMethods: ['subscription', 'payment-methods'] as const,
		current: ['subscription', 'current'] as const,
	},
	organizations: {
		all: ['organizations'] as const,
		detail: (id: string) => ['organizations', id] as const,
		members: (id: string) => ['organizations', id, 'members'] as const,
		settings: (id: string) => ['organizations', id, 'settings'] as const,
	},
	admin: {
		stats: ['admin', 'stats'] as const,
		members: (params?: AdminMembersParams) => 
			['admin', 'members', params] as const,
	},
	dashboard: {
		activity: (params?: ActivityParams) => 
			['dashboard', 'activity', params] as const,
		search: (query: string) => ['dashboard', 'search', query] as const,
	},
	auth: {
		account: ['auth', 'account'] as const,
		profile: ['auth', 'profile'] as const,
		session: ['auth', 'session'] as const,
	},
} as const;