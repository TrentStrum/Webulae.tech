'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { useToast } from '@/src/hooks';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { NotificationSetting } from './components/NotificationSettings';


export default function SettingsPage() {
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [marketingEmails, setMarketingEmails] = useState(false);
	const { toast } = useToast();

	const handleSaveSettings = () => {
		// Handle saving settings logic (e.g., call an API or save locally)
		toast({
			title: 'Settings saved',
			description: 'Your preferences have been updated successfully.',
		});
	};

	return (
		<div className="container max-w-4xl py-8">
			<h1 className="text-3xl font-bold mb-8">Settings</h1>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Notifications</CardTitle>
						<CardDescription>Configure how you receive notifications.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<NotificationSetting
							label="Email Notifications"
							description="Receive notifications about your account activity."
							checked={emailNotifications}
							onCheckedChange={setEmailNotifications}
						/>
						<NotificationSetting
							label="Marketing Emails"
							description="Receive emails about new features and updates."
							checked={marketingEmails}
							onCheckedChange={setMarketingEmails}
						/>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button onClick={handleSaveSettings}>Save Changes</Button>
				</div>
			</div>
		</div>
	);
}
