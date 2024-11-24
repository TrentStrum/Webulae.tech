import { useState, useEffect } from 'react';
import { supabaseClient } from '@/src/lib/supabaseClient';
import { useToast } from '../helpers/use-toast';
import { Profile } from '@/src/types/profile.types';

export const useProfile = () => {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const {
					data: { user },
				} = await supabaseClient.auth.getUser();

				if (!user) throw new Error('User not logged in');

				const { data, error } = await supabaseClient
					.from('profiles')
					.select('*')
					.eq('id', user.id)
					.single();

				if (error) throw error;

				setProfile(data);
				setOriginalProfile(data);
			} catch (error) {
				console.error('Error fetching profile:', error);
				toast({
					title: 'Error',
					description: 'Failed to load profile data.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();
	}, [toast]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
	};

	const hasChanges = () => {
		if (!profile || !originalProfile) return false;
		return (
			profile.full_name !== originalProfile.full_name ||
			profile.username !== originalProfile.username ||
			profile.bio !== originalProfile.bio ||
			profile.website !== originalProfile.website
		);
	};

	const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!profile || !hasChanges()) return;

		setIsSaving(true);

		try {
			const { error } = await supabaseClient
				.from('profiles')
				.update({
					full_name: profile.full_name,
					username: profile.username,
					bio: profile.bio,
					website: profile.website,
					updated_at: new Date().toISOString(),
				})
				.eq('id', profile.id);

			if (error) throw error;

			setOriginalProfile(profile);
			toast({
				title: 'Profile updated',
				description: 'Your profile has been updated successfully.',
			});
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to update profile.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return {
		profile,
		isLoading,
		isSaving,
		hasChanges,
		handleInputChange,
		updateProfile,
	};
};
