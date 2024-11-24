'use client';

import { useToast } from '@/src/hooks';
import { useProfile } from '@/src/hooks/react-query/useProfile';
import { useRouter } from 'next/navigation';
import ProfileForm from './components/ProfileForm';


export default function ProfilePage() {
	const { profile, isLoading, hasChanges, handleInputChange, updateProfile } = useProfile();
	const router = useRouter();
	const { toast } = useToast();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!profile) {
		toast({
			title: 'Error',
			description: 'No profile data available.',
			variant: 'destructive',
		});
		router.push('/login');
		return null;
	}

	return (
		<div className="container max-w-4xl py-8">
			<h1 className="text-3xl font-bold mb-8">Profile</h1>
			<ProfileForm
				profile={profile}
				hasChanges={hasChanges}
				onInputChange={handleInputChange}
				onSubmit={updateProfile}
			/>
		</div>
	);
}
