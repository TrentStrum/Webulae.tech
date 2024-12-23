'use client';

import { PermissionGate } from '@/src/components/auth/PermissionGate';
import { SettingsForm } from '@/src/components/settings/SettingsForm';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/src/components/ui/card';


export default function SettingsPage() {
	return (
		<div className="container max-w-4xl py-8">
			<h1 className="text-3xl font-bold mb-8">Settings</h1>

			<div className="space-y-6">
				{/* Read-only settings */}
				<PermissionGate permission="settings:read">
					<Card>
						<CardHeader>
							<CardTitle>Organization Settings</CardTitle>
							<CardDescription>View your organization settings.</CardDescription>
						</CardHeader>
						<CardContent>
							{/* Organization settings display */}
						</CardContent>
					</Card>
				</PermissionGate>

				{/* Editable settings */}
				<PermissionGate 
					permission="settings:write"
					fallback={<p className="text-muted-foreground">You don&apos;t have permission to edit settings</p>}
				>
					<Card>
						<CardHeader>
							<CardTitle>Notifications</CardTitle>
							<CardDescription>Configure how you receive notifications.</CardDescription>
						</CardHeader>
						<CardContent>
							<SettingsForm />
						</CardContent>
					</Card>
				</PermissionGate>
			</div>
		</div>
	);
}
