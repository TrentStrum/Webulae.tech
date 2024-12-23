'use client';

import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/src/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/src/components/ui/form';
import { Switch } from '@/src/components/ui/switch';
import { useToast } from '@/src/hooks/helpers/use-toast';

const formSchema = z.object({
	billing: z.object({
		paymentSuccess: z.boolean(),
		paymentFailed: z.boolean(),
		subscriptionUpdates: z.boolean(),
		invoiceAvailable: z.boolean(),
	}),
	security: z.object({
		newLogin: z.boolean(),
		passwordChanged: z.boolean(),
		twoFactorEnabled: z.boolean(),
	}),
	team: z.object({
		memberJoined: z.boolean(),
		memberLeft: z.boolean(),
		roleChanged: z.boolean(),
	}),
});

type NotificationPreferences = z.infer<typeof formSchema>;

export function NotificationPreferences(): JSX.Element {
	const { organization } = useOrganization();
	const { toast } = useToast();

	const form = useForm<NotificationPreferences>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			billing: {
				paymentSuccess: true,
				paymentFailed: true,
				subscriptionUpdates: true,
				invoiceAvailable: true,
			},
			security: {
				newLogin: true,
				passwordChanged: true,
				twoFactorEnabled: true,
			},
			team: {
				memberJoined: true,
				memberLeft: true,
				roleChanged: true,
			},
		},
	});

	const onSubmit = async (data: NotificationPreferences): Promise<void> => {
		try {
			await fetch('/api/organizations/notification-preferences', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					organizationId: organization?.id,
					preferences: data,
				}),
			});

			toast({
				title: 'Preferences updated',
				description: 'Your notification preferences have been saved.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update notification preferences.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Notification Preferences</h3>
				<p className="text-sm text-muted-foreground">
					Choose which notifications you want to receive.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="space-y-6">
						<div>
							<h4 className="text-sm font-medium mb-4">Billing Notifications</h4>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="billing.paymentSuccess"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between space-y-0">
											<div>
												<FormLabel>Successful Payments</FormLabel>
												<FormDescription>
													Receive notifications when payments are processed successfully.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								{/* Add other billing notification fields */}
							</div>
						</div>

						<div>
							<h4 className="text-sm font-medium mb-4">Security Notifications</h4>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="security.newLogin"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between space-y-0">
											<div>
												<FormLabel>New Login</FormLabel>
												<FormDescription>
													Get notified when there&apos;s a new login to your account.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								{/* Add other security notification fields */}
							</div>
						</div>

						<div>
							<h4 className="text-sm font-medium mb-4">Team Notifications</h4>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="team.memberJoined"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between space-y-0">
											<div>
												<FormLabel>Member Joined</FormLabel>
												<FormDescription>
													Receive notifications when new members join the organization.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								{/* Add other team notification fields */}
							</div>
						</div>
					</div>

					<Button type="submit">Save Preferences</Button>
				</form>
			</Form>
		</div>
	);
} 