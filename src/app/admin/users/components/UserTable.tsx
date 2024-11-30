'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/src/components/ui/table";
import { User } from "@/src/types";
import { UserRow } from "./UserRow";

type Props = {
	users: User[];
	onResetPassword: (email: string) => Promise<void>;
	onToggleRole: (userId: string, currentRole: string) => Promise<void>;
	isMutating: string | null;
}

export function UserTable({ users, onResetPassword, onToggleRole, isMutating }: Props) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Username</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
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
