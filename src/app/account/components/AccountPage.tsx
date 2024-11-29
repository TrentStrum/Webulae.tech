import { useEffect, useState } from 'react';
import { supabaseClient } from '@/src/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCurrentUser } from '@/src/hooks/react-query/useUsers';

export default function Account() {
	const { data: user, isLoading } = useCurrentUser();

	if (isLoading) return null;
	if (!user) return null;

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8">Account Settings</h1>
			<div className="grid gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Profile Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium">Email</label>
								<p className="mt-1">{user.email}</p>
							</div>
							<div>
								<label className="text-sm font-medium">Last Sign In</label>
								<p className="mt-1">
									{user.last_sign_in_at 
										? new Date(user.last_sign_in_at).toLocaleString() 
										: 'Never'}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
