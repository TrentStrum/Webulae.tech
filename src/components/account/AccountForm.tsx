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
import { Checkbox } from '@/src/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { PasswordInput } from '@/src/components/ui/password-input';

import type { Account } from '@/src/types/account.types';

const accountSchema = z.object({
	email_notifications: z.boolean(),
	project_updates: z.boolean(),
	marketing_emails: z.boolean(),
});

const passwordSchema = z
	.object({
		current_password: z.string().min(1, 'Current password is required'),
		new_password: z.string().min(8, 'Password must be at least 8 characters'),
		confirm_password: z.string(),
	})
	.refine((data) => data.new_password === data.confirm_password, {
		message: "Passwords don't match",
		path: ['confirm_password'],
	});

interface AccountFormProps {
	onSubmit: (data: Partial<Account>) => Promise<void>;
	onPasswordChange: (data: z.infer<typeof passwordSchema>) => Promise<void>;
	isSubmitting: boolean;
	isChangingPassword: boolean;
	defaultValues?: Partial<Account>;
}

export function AccountForm({ 
	onSubmit, 
	onPasswordChange,
	isSubmitting, 
	isChangingPassword,
	defaultValues 
}: AccountFormProps): JSX.Element {

	const preferencesForm = useForm<z.infer<typeof accountSchema>>({
		resolver: zodResolver(accountSchema),
		defaultValues: {
			email_notifications: defaultValues?.email_notifications || false,
			project_updates: defaultValues?.project_updates || false,
			marketing_emails: defaultValues?.marketing_emails || false,
		},
	});

	const passwordForm = useForm<z.infer<typeof passwordSchema>>({
		resolver: zodResolver(passwordSchema),
	});

	const handlePasswordChange = (value: string): number => {
		// Calculate password strength
		let strength = 0;
		if (value.length >= 8) strength += 25;
		if (value.match(/[A-Z]/)) strength += 25;
		if (value.match(/[0-9]/)) strength += 25;
		if (value.match(/[^A-Za-z0-9]/)) strength += 25;
		return strength;
	};

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>Email Preferences</CardTitle>
					<CardDescription>Manage your email notification settings</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...preferencesForm}>
						<form onSubmit={preferencesForm.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={preferencesForm.control}
								name="email_notifications"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Email Notifications</FormLabel>
											<FormDescription>
												Receive email notifications about your projects
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={preferencesForm.control}
								name="project_updates"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Project Updates</FormLabel>
											<FormDescription>
												Get notified when there are updates to your projects
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={preferencesForm.control}
								name="marketing_emails"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Marketing Emails</FormLabel>
											<FormDescription>
												Receive emails about new features and updates
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : 'Save Preferences'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>Update your account password</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...passwordForm}>
						<form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-6">
							<FormField
								control={passwordForm.control}
								name="current_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Password</FormLabel>
										<FormControl>
											<PasswordInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={passwordForm.control}
								name="new_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<PasswordInput 
												{...field} 
												onChange={(e) => {
													field.onChange(e);
													handlePasswordChange(e.target.value);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={passwordForm.control}
								name="confirm_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm New Password</FormLabel>
										<FormControl>
											<PasswordInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={isChangingPassword}>
								{isChangingPassword ? 'Changing Password...' : 'Change Password'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
} 