'use client';

import { useRouter } from 'next/navigation';

import { ProfileForm } from '@/src/components/profile/ProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useProfile, useUpdateProfile } from '@/src/hooks/react-query/auth/queries';

import type { Profile } from '@/src/types/auth.types';


export default function ClientProfilePage(): JSX.Element {
	const router = useRouter();
	const { toast } = useToast();
	const { data: profile, isLoading } = useProfile();
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

	if (isLoading) {
		return <div className="container py-8">Loading profile...</div>;
	}

	const handleSubmit = async (formData: Partial<Profile>): Promise<void> => {
		try {
			await updateProfile(formData, {
				onSuccess: () => {
					toast({
						title: 'Success',
						description: 'Profile updated successfully.',
					});
					router.refresh();
				},
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update profile.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileForm 
						onSubmit={handleSubmit} 
						isSubmitting={isUpdating} 
						defaultValues={profile?.data}
					/>
				</CardContent>
			</Card>
		</div>
	);
} 