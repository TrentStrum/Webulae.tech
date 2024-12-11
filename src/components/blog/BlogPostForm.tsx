'use client';

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
import { Textarea } from '@/src/components/ui/textarea';
import { useCreateBlogPost } from '@/src/hooks/react-query/useBlog';

const formSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	shortDescription: z.string().min(1, 'Short description is required'),
	category: z.string().min(1, 'Category is required'),
	excerpt: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BlogPostForm() {
	const { mutate: createPost, isPending } = useCreateBlogPost();

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			content: '',
			shortDescription: '',
			category: '',
			excerpt: '',
		},
	});

	const onSubmit = (data: FormData) => {
		createPost(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="shortDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Short Description</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Brief description for featured posts" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<Input {...field} placeholder="e.g., Technology, Design, Development" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="excerpt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Excerpt (Optional)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Brief preview of the post content"
									className="h-20"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Textarea {...field} className="h-32" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isPending}>
					{isPending ? 'Creating...' : 'Create Post'}
				</Button>
			</form>
		</Form>
	);
}
