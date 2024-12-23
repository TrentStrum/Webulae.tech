import * as z from 'zod';

export const preferencesSchema = z.object({
	theme: z.enum(['light', 'dark', 'system']),
	notifications: z.object({
		email: z.boolean(),
		push: z.boolean(),
	}),
	dashboard: z.object({
		layout: z.enum(['grid', 'list']),
		defaultView: z.enum(['week', 'month', 'year']),
	}),
});
