'use client';

import { useOrganization } from '@clerk/nextjs';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';

export function OrganizationProfile() {
	const { organization, isLoaded } = useOrganization();
	const [name, setName] = useState(organization?.name || '');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!organization) return;

		try {
			await organization.update({
				name,
			});
			// Add toast notification for success
		} catch (error) {
			console.error('Failed to update organization:', error);
			// Add toast notification for error
		}
	};

	if (!isLoaded) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Organization Profile</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium">
							Organization Name
						</label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-1"
						/>
					</div>
					<Button type="submit">Save Changes</Button>
				</form>
			</CardContent>
		</Card>
	);
}
