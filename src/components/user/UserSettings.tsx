'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';

export function UserSettings() {
	const { user } = useUser();
	const [firstName, setFirstName] = useState(user?.firstName ?? '');
	const [lastName, setLastName] = useState(user?.lastName ?? '');

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await user?.update({
				firstName,
				lastName,
			});
			toast.success('Profile updated successfully');
		} catch (error) {
			console.error('Error updating profile:', error);
			toast.error('Failed to update profile');
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleUpdateProfile} className="space-y-4">
					<div>
						<label htmlFor="firstName" className="block text-sm font-medium">
							First Name
						</label>
						<Input
							id="firstName"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							className="mt-1"
						/>
					</div>
					<div>
						<label htmlFor="lastName" className="block text-sm font-medium">
							Last Name
						</label>
						<Input
							id="lastName"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							className="mt-1"
						/>
					</div>
					<Button type="submit">Save Changes</Button>
				</form>
			</CardContent>
		</Card>
	);
}
