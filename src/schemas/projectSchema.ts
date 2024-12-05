import * as z from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255),
  description: z.string().min(1, 'Project description is required').max(2000),
  status: z.enum(['planning', 'in_progress', 'review', 'completed', 'on_hold']),
  dev_environment_url: z.string().url().optional().or(z.literal('')),
  staging_environment_url: z.string().url().optional().or(z.literal('')),
  start_date: z.string().optional(),
  target_completion_date: z.string().optional().refine(
    (date, ctx) => {
      if (!date || !ctx.parent.start_date) return true;
      return new Date(date) >= new Date(ctx.parent.start_date);
    },
    {
      message: 'Target completion date must be after start date',
    }
  ),
});

export type ProjectFormData = z.infer<typeof projectSchema>;