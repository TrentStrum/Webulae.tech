import { Resend } from 'resend';

import { supabase } from '../supabase/config';

import { BillingNotificationEmail } from './templates/billing-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendBillingNotificationParams {
	to: string;
	organizationId: string;
	organizationName: string;
	eventType: 'payment.success' | 'payment.failed' | 'subscription.updated';
	details: {
		amount?: number;
		planName?: string;
		invoiceUrl?: string;
		date: Date;
	};
}

export async function sendBillingNotification({
	to,
	organizationId,
	organizationName,
	eventType,
	details,
}: SendBillingNotificationParams): Promise<void> {
	try {
		// Check notification preferences
		const { data: settings } = await supabase
			.from('organization_settings')
			.select('notification_preferences')
			.eq('organization_id', organizationId)
			.single();

		const preferences = settings?.notification_preferences?.billing;
		
		// Map event types to preference keys
		const preferenceMap = {
			'payment.success': 'paymentSuccess',
			'payment.failed': 'paymentFailed',
			'subscription.updated': 'subscriptionUpdates',
		} as const;

		// Check if notifications are enabled for this event type
		if (preferences?.[preferenceMap[eventType]] === false) {
			return;
		}

		await resend.emails.send({
			from: 'billing@yourdomain.com',
			to,
			subject: `Billing Notification - ${organizationName}`,
			react: BillingNotificationEmail({
				organizationName,
				eventType,
				details,
			}),
		});
	} catch (error) {
		console.error('Failed to send billing notification:', error);
		throw error;
	}
} 