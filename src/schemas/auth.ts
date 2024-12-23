import * as z from 'zod';

export const passwordSchema = z.object({
	current_password: z.string().min(8),
	new_password: z.string().min(8),
	confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
	message: "Passwords don't match",
	path: ["confirm_password"],
});
