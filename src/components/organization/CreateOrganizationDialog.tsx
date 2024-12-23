'use client';

import { useOrganizationList } from '@clerk/nextjs';
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
import { useToast } from '@/src/hooks/helpers/use-toast';

const formSchema = z.object({
	name: z.string().min(2, 'Organization name must be at least 2 characters'),
});

interface CreateOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({ 
	open, 
	onOpenChange 
}: CreateOrganizationDialogProps): JSX.Element {
	const { createOrganization } = useOrganizationList();
	const { toast } = useToast();
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
		try {
			if (!createOrganization) {
				throw new Error('Organization creation not available');
			}
			await createOrganization({ name: values.name });
			toast({
				title: 'Organization created',
				description: 'Your new organization has been created successfully.',
			});
			onOpenChange(false);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create organization. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Organization</DialogTitle>
					<DialogDescription>
						Create a new organization to collaborate with your team.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter organization name" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Create Organization
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
} 