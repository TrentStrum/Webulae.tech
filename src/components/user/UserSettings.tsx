'use client';

import { useAuth , UserProfile } from '@clerk/nextjs';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export function UserSettings(): JSX.Element {
	const { userId } = useAuth();

	if (!userId) return <></>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Settings</CardTitle>
			</CardHeader>
			<CardContent>
				<UserProfile
					appearance={{
						elements: {
							rootBox: 'w-full',
							card: 'border-0 shadow-none',
						},
					}}
				/>
			</CardContent>
		</Card>
	);
}
