'use client';

import { useOrganization } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { EmailService } from '@/src/lib/services/email-service';
import { InvitationService } from '@/src/lib/services/invitation-service';

export function InviteForm() {
	const [email, setEmail] = useState('');
	const { organization } = useOrganization();

	const mutation = useMutation({
		mutationFn: async (email: string) => {
			if (!organization?.id) throw new Error('No organization selected');
			const invitation = await InvitationService.createInvitation(organization.id, email);
			
			// Send invitation email
			const inviteUrl = `${window.location.origin}/invite/${invitation.token}`;
			await EmailService.sendInvitation(email, inviteUrl, organization.name);
			
			return invitation;
		},
		onSuccess: () => {
			setEmail('');
			// You could add a toast notification here
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(email);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-700">
					Invite Client
				</label>
				<div className="mt-1 flex rounded-md shadow-sm">
					<input
						type="email"
						name="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						placeholder="client@example.com"
						required
					/>
					<button
						type="submit"
						disabled={mutation.isPending}
						className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{mutation.isPending ? 'Sending...' : 'Send Invitation'}
					</button>
				</div>
			</div>
		</form>
	);
}
