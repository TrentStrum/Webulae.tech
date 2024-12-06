import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import { apiClient } from '@/src/lib/apiClient';

import type { Profile } from '@/src/types/user.types';

export const useProfile = () => {
	const [formData, setFormData] = useState<Partial<Profile>>({});
	const {
		data: profile,
		error,
		isLoading,
	} = useQuery<Profile, Error>({
		queryKey: ['profile'],
		queryFn: async () => {
			const data = await apiClient.get<Profile>('/api/users');
			return data;
		},
	});

	const queryClient = useQueryClient();
	
	const { mutateAsync: mutateProfile } = useMutation({
		mutationFn: async (updatedData: Partial<Profile>) => {
			const response = await apiClient.patch<Profile>('/api/users', updatedData);
			return response;
		},
		onSuccess: (newProfile) => {
			queryClient.setQueryData(['profile'], newProfile);
			setFormData({});  // Reset form after successful update
		},
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const hasChanges = () => {
		return Object.keys(formData).length > 0;
	};

	const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!hasChanges()) return;
		
		try {
			await mutateProfile(formData);
		} catch (error) {
			console.error('Failed to update profile:', error);
			throw error;
		}
	};

	return {
		profile,
		isLoading,
		error,
		handleInputChange,
		hasChanges,
		updateProfile,
	};
};
