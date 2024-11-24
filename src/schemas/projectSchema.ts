import * as z from 'zod';

export const projectSchema = z.object({
	name: z.string().min(1, 'Project name is required'),
	description: z.string().min(1, 'Project description is required'),
	status: z.enum(['planning', 'in_progress', 'review', 'completed', 'on_hold']),
	dev_environment_url: z.string().url().optional().or(z.literal('')),
	staging_environment_url: z.string().url().optional().or(z.literal('')),
	start_date: z.string().optional(),
	target_completion_date: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
