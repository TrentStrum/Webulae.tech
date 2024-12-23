import { z } from 'zod';

export const organizationSettingsSchema = z.object({
	name: z.string().min(2).max(50),
	settings: z.object({
		timezone: z.string(),
		features: z.array(z.object({
			name: z.string(),
			enabled: z.boolean(),
		})),
		theme: z.object({
			primary: z.string(),
			logo: z.string().url(),
		}),
	}),
}); 