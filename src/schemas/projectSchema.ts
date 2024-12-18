import * as z from 'zod';

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';

export const projectSchema = z
	.object({
		name: z.string().min(1, 'Project name is required').max(255),
		description: z.string().min(1, 'Project description is required').max(2000),
		status: z.enum(['planning', 'in_progress', 'review', 'completed', 'on_hold']),
		dev_environment_url: z.string().url().optional().or(z.literal('')),
		staging_environment_url: z.string().url().optional().or(z.literal('')),
		start_date: z.string().optional(),
		target_completion_date: z.string().optional(),
	})
	.refine(
		(data) => {
			if (!data.target_completion_date || !data.start_date) return true;
			const targetDate = new Date(data.target_completion_date).setHours(0, 0, 0, 0);
			const startDate = new Date(data.start_date).setHours(0, 0, 0, 0);
			return targetDate >= startDate;
		},
		{
			message: 'Target completion date must be after start date',
			path: ['target_completion_date'],
		}
	);

export type ProjectFormData = z.infer<typeof projectSchema>;
