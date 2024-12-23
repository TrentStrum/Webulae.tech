'use client';

import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/src/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/src/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/select';
import { useToast } from '@/src/hooks/helpers/use-toast';

const formSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	role: z.string(),
});

interface InviteMemberDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organizationId?: string;
}

export function InviteMemberDialog({ 
	open, 
	onOpenChange, 
}: InviteMemberDialogProps): JSX.Element {
	const { organization } = useOrganization();
	const { toast } = useToast();
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			role: 'basic_member',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
		if (!organization) return;

		try {
			await organization.inviteMember({ 
				emailAddress: values.email,
				role: values.role,
			});
			toast({
				title: 'Invitation sent',
				description: 'The invitation has been sent successfully.',
			});
			onOpenChange(false);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to send invitation. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite Team Member</DialogTitle>
					<DialogDescription>
						Invite a new member to join your organization.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input {...field} type="email" placeholder="Enter email address" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select 
										onValueChange={field.onChange} 
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="basic_member">Member</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Send Invitation
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
} 