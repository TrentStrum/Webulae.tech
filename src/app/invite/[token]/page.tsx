import { SignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { InvitationService } from '@/src/lib/services/invitation-service';

export default async function InvitePage({ params: { token } }: { params: { token: string } }) {
	try {
		const invitation = await InvitationService.verifyInvitation(token);

		return (
			<div className="flex min-h-screen items-center justify-center">
				<SignUp
					afterSignUpUrl={`/api/invitations/accept?token=${token}`}
					initialValues={{ emailAddress: invitation.email }}
				/>
			</div>
		);
	} catch (error) {
		redirect('/invalid-invitation');
	}
}
