import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient'; // Import your Axios client
import { Profile } from '@/src/types/profile.types';
import { useToast } from '../helpers/use-toast';

export const useProfile = () => {
	const { toast } = useToast();

	const {
		data: profile,
		error,
		isLoading,
	} = useQuery<Profile, Error>({
		queryKey: ['profile'],
		queryFn: async () => {
			const data = await apiClient.get<Profile>('/api/users'); // Call the API route
			return data;
		},
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		// Handle input changes if needed
	};

	const hasChanges = () => {
		// Implement logic to check for changes
		return false; // Placeholder
	};

	const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Implement profile update logic
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
