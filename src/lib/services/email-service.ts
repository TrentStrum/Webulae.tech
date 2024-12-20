import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
	static async sendInvitation(email: string, inviteUrl: string, organizationName: string): Promise<void> {
		try {
			await resend.emails.send({
				from: 'noreply@yourdomain.com',
				to: email,
				subject: `You've been invited to join ${organizationName}`,
				html: `
					<h1>You've been invited!</h1>
					<p>You've been invited to join ${organizationName}.</p>
					<p>Click the link below to accept the invitation:</p>
					<a href="${inviteUrl}">Accept Invitation</a>
				`,
			});
		} catch (error) {
			console.error('Failed to send invitation email:', error);
			throw error;
		}
	}
}
