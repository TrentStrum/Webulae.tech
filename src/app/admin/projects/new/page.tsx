'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";
import { useToast } from "@/src/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { useRouter } from "next/router";
import { Input } from "@/src/components/ui/input";
import { Select } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabaseClient } from "@/src/lib/supabaseClient";



const projectSchema = z.object({
	name: z.string().min(1, 'Project name is required'),
	description: z.string().min(1, 'Project description is required'),
	status: z.enum(['planning', 'in_progress', 'review', 'completed', 'on_hold']),
	dev_environment_url: z.string().url().optional().or(z.literal('')),
	staging_environment_url: z.string().url().optional().or(z.literal('')),
	start_date: z.string().optional(),
	target_completion_date: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProject() {
	const [submitting, setSubmitting] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			status: 'planning',
		},
	});

	const onSubmit = async (data: ProjectFormData) => {
		setSubmitting(true);

		try {
			const { error: projectError } = await supabaseClient
				.from('projects')
				.insert([data])
				.select()
				.single();

			if (projectError) throw projectError;

			toast({
				title: 'Success',
				description: 'Project created successfully.',
			});

			router.push('/admin/projects');
		} catch (error) {
			console.error('Error creating project:', error);
			toast({
				title: 'Error',
				description: 'Failed to create project.',
				variant: 'destructive',
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="container max-w-3xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Create New Project</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">Project Name</Label>
							<Input
								id="name"
								{...register('name')}
								className={errors.name ? 'border-red-500' : ''}
							/>
							{errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								{...register('description')}
								rows={4}
								className={errors.description ? 'border-red-500' : ''}
							/>
							{errors.description && (
								<p className="text-sm text-red-500">{errors.description.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								defaultValue="planning"
								onValueChange={(value) => setValue('status', value as any)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="planning">Planning</SelectItem>
									<SelectItem value="in_progress">In Progress</SelectItem>
									<SelectItem value="review">Review</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="on_hold">On Hold</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="start_date">Start Date</Label>
								<Input id="start_date" type="date" {...register('start_date')} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="target_completion_date">Target Completion Date</Label>
								<Input
									id="target_completion_date"
									type="date"
									{...register('target_completion_date')}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dev_environment_url">Development Environment URL</Label>
							<Input
								id="dev_environment_url"
								type="url"
								{...register('dev_environment_url')}
								placeholder="https://"
								className={errors.dev_environment_url ? 'border-red-500' : ''}
							/>
							{errors.dev_environment_url && (
								<p className="text-sm text-red-500">{errors.dev_environment_url.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="staging_environment_url">Staging Environment URL</Label>
							<Input
								id="staging_environment_url"
								type="url"
								{...register('staging_environment_url')}
								placeholder="https://"
								className={errors.staging_environment_url ? 'border-red-500' : ''}
							/>
							{errors.staging_environment_url && (
								<p className="text-sm text-red-500">{errors.staging_environment_url.message}</p>
							)}
						</div>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
								disabled={submitting}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={submitting}>
								{submitting ? 'Creating...' : 'Create Project'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
