'use client';

import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useUsers } from '@/src/hooks/react-query/useUsers';

export default function UserDetailPage(): JSX.Element {
	const { id } = useParams();
	const { data: users, isLoading } = useUsers();
	const user = users?.find((u) => u.id === id);

	if (isLoading) {
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
		return (
			<div className="container py-8">
				<h1 className="text-3xl font-bold mb-8">User not found</h1>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">User Details</h1>
			<Card>
				<CardHeader>
					<CardTitle>{user.full_name || user.username || user.email}</CardTitle>
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
					<div>
						<p className="font-semibold">Username</p>
						<p className="text-muted-foreground">{user.username || '-'}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
