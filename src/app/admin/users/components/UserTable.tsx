'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/src/components/ui/table';
import { User } from '@/src/types';
import { UserRow } from './UserRow';
import { useUsers } from '@/src/hooks/react-query/useUsers';

type Props = {
	onResetPassword: (userEmail: string) => Promise<void>;
	onToggleRole: (userId: string, currentRole: User['role']) => Promise<void>;
	isMutating: string | null;
};

export function UserTable({ onResetPassword, onToggleRole, isMutating }: Props) {
	const { data: usersData, isLoading, error } = useUsers();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!usersData) return <div>No users found</div>;

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-1/6 text-center">Name</TableHead>
						<TableHead className="w-1/6 text-center">Email</TableHead>
						<TableHead className="w-1/6 text-center">Username</TableHead>
						<TableHead className="w-1/6 text-center">Role</TableHead>
						<TableHead className="w-1/6 text-center">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{usersData.map((user: User) => (
						<UserRow
							key={user.id}
							user={user}
							onResetPassword={onResetPassword}
							onToggleRole={onToggleRole}
							isMutating={isMutating === user.id}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
