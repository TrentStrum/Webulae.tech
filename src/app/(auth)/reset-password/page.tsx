'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/src/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useResetPassword } from '@/src/hooks/react-query/auth/mutations';



const resetPasswordSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage(): JSX.Element {
	const { toast } = useToast();
	const { mutate: resetPassword, isPending } = useResetPassword();

	const form = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (data: ResetPasswordForm): Promise<void> => {
		try {
			await resetPassword(data, {
				onSuccess: () => {
					toast({
						title: 'Check your email',
						description: 'We sent you a password reset link.',
					});
				},
				onError: () => {
					toast({
						title: 'Error',
						description: 'Failed to send reset password email. Please try again.',
						variant: 'destructive',
					});
				},
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="container max-w-md py-8">
			<Card>
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>
						Enter your email address and we&apos;ll send you a link to reset your password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input 
												type="email" 
												placeholder="Enter your email" 
												{...field} 
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? 'Sending...' : 'Send Reset Link'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
} 