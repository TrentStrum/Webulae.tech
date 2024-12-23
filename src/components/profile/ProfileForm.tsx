'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/src/components/ui/button';
import { FileUploadInfo } from '@/src/components/ui/file-upload-info';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Progress } from '@/src/components/ui/progress';

import type { Profile } from '@/src/types/user.types';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const profileSchema = z.object({
	full_name: z.string().min(2, 'Name must be at least 2 characters'),
	company_name: z.string().optional(),
	phone_number: z.string().optional(),
	address: z.string().optional(),
	avatar: z
		.custom<FileList>()
		.optional()
		.refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
		.refine(
			(files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		),
});

interface ProfileFormProps {
	onSubmit: (data: Partial<Profile>) => Promise<void>;
	isSubmitting: boolean;
	defaultValues?: Partial<Profile>;
}

export function ProfileForm({ onSubmit, isSubmitting, defaultValues }: ProfileFormProps): JSX.Element {
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			full_name: defaultValues?.full_name || '',
			company_name: defaultValues?.company_name || '',
			phone_number: defaultValues?.phone_number || '',
			address: defaultValues?.address || '',
		},
	});

	const handleSubmit = async (data: z.infer<typeof profileSchema>): Promise<void> => {
		const formData = new FormData();
		
		// Handle regular fields
		Object.entries(data).forEach(([key, value]) => {
			if (value && key !== 'avatar') {
				formData.append(key, value as string);
			}
		});

		// Handle file upload with progress
		if (data.avatar instanceof FileList && data.avatar.length > 0) {
			setIsUploading(true);
			setUploadProgress(0);
			
			// Simulate upload progress (replace with actual upload logic)
			const file = data.avatar[0];
			formData.append('avatar', file);

			try {
				await onSubmit(formData as unknown as Partial<Profile>);
			} finally {
				setIsUploading(false);
				setUploadProgress(0);
			}
		} else {
			await onSubmit(formData as unknown as Partial<Profile>);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<FormField
						control={form.control}
						name="avatar"
						render={({ field: { onChange, ...field } }) => (
							<FormItem>
								<FormLabel>Profile Picture</FormLabel>
								<FormControl>
									<div className="space-y-4">
										<div className="flex items-center gap-4">
											{defaultValues?.avatar_url && (
												<Image
													src={defaultValues.avatar_url}
													alt="Profile"
													width={64}
													height={64}
													className="rounded-full"
												/>
											)}
											<Input
												type="file"
												accept={ACCEPTED_IMAGE_TYPES.join(',')}
												onChange={(e) => {
													onChange(e.target.files);
													setUploadProgress(0);
												}}
												className="hidden"
												id="avatar-upload"
												{...field}
												value={undefined}
											/>
											<Button 
												type="button" 
												variant="outline" 
												onClick={() => document.getElementById('avatar-upload')?.click()}
												disabled={isUploading}
											>
												<Upload className="w-4 h-4 mr-2" />
												{isUploading ? 'Uploading...' : 'Upload'}
											</Button>
										</div>
										<FileUploadInfo
											file={field.value as FileList}
											maxSize={MAX_FILE_SIZE}
											acceptedTypes={ACCEPTED_IMAGE_TYPES}
										/>
										{isUploading && (
											<div className="space-y-2">
												<Progress value={uploadProgress} />
												<p className="text-sm text-muted-foreground">
													Uploading... {uploadProgress}%
												</p>
											</div>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

				<FormField
					control={form.control}
					name="full_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="company_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="phone_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input {...field} type="tel" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Saving...' : 'Save Changes'}
				</Button>
			</form>
		</Form>
	);
} 