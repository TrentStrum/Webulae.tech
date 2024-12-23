import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components';
import { format } from 'date-fns';

interface BillingEmailProps {
	organizationName: string;
	eventType: 'payment.success' | 'payment.failed' | 'subscription.updated';
	details: {
		amount?: number;
		planName?: string;
		invoiceUrl?: string;
		date: Date;
	};
}

export function BillingNotificationEmail({
	organizationName,
	eventType,
	details,
}: BillingEmailProps): JSX.Element {
	const subject = {
		'payment.success': 'Payment Successful',
		'payment.failed': 'Payment Failed',
		'subscription.updated': 'Subscription Updated',
	}[eventType];

	const message = {
		'payment.success': `Payment of $${details.amount} was successfully processed`,
		'payment.failed': `Payment of $${details.amount} failed to process`,
		'subscription.updated': `Subscription has been updated to ${details.planName}`,
	}[eventType];

	return (
		<Html>
			<Head />
			<Preview>{subject} - {organizationName}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>{subject}</Heading>
					<Section style={section}>
						<Text style={text}>
							Hello,
						</Text>
						<Text style={text}>
							This is a notification regarding billing for {organizationName}.
						</Text>
						<Text style={text}>
							{message}
						</Text>
						<Text style={text}>
							Date: {format(details.date, 'PPP')}
						</Text>
						{details.invoiceUrl && (
							<Text style={text}>
								View invoice: <Link href={details.invoiceUrl}>Click here</Link>
							</Text>
						)}
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: '#ffffff',
	fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: '0 auto',
	padding: '20px 0 48px',
	maxWidth: '560px',
};

const section = {
	padding: '24px',
	border: 'solid 1px #dedede',
	borderRadius: '5px',
	textAlign: 'left' as const,
};

const h1 = {
	fontSize: '24px',
	fontWeight: '600',
	lineHeight: '1.3',
	margin: '16px 0',
};

const text = {
	margin: '8px 0',
	color: '#484848',
	fontSize: '16px',
	lineHeight: '24px',
}; 