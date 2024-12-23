'use client';

import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/src/components/ui/button';
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
	slug: z.string().min(2, 'Slug must be at least 2 characters'),
});

export function OrganizationSettings(): JSX.Element {
	const { organization, isLoaded } = useOrganization();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: organization?.name || '',
			slug: organization?.slug || '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
		if (!organization) return;

		try {
			await organization.update({
				name: values.name,
				slug: values.slug,
			});
			toast({
				title: 'Settings updated',
				description: 'Organization settings have been updated successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update organization settings.',
				variant: 'destructive',
			});
		}
	};

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Organization Settings</h3>
				<p className="text-sm text-muted-foreground">
					Manage your organization&apos;s basic information.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Organization Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Organization Slug</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Save Changes</Button>
				</form>
			</Form>
		</div>
	);
} 