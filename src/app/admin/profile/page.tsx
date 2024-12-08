'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useAuth } from '@/src/hooks/useAuth';

export default function ProfilePage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	if (loading) {
		return (
			<div className="container py-8">
				<div className="animate-pulse space-y-4">
					<div className="h-8 w-1/3 bg-muted rounded" />
					<div className="h-32 bg-muted rounded" />
				</div>
			</div>
		);
	}

	if (!user) {
		router.push('/auth/login');
		return null;
	}

	return (
		<div className="container py-8">
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<p className="font-semibold">Email</p>
						<p className="text-muted-foreground">{user.email}</p>
					</div>
					<div>
						<p className="font-semibold">Role</p>
						<p className="capitalize text-muted-foreground">{user.role}</p>
					</div>
					<div className="pt-4">
						<Button variant="outline" onClick={() => router.push('/admin/profile/edit')}>
							Edit Profile
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
