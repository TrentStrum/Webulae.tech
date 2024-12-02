'use client';

import { Button } from "@/src/components/ui/button";
import { TableRow, TableCell } from "@/src/components/ui/table";
import { User } from "@/src/types";


type Props = {
	user: User;
	onResetPassword: (email: string) => Promise<void>;
	onToggleRole: (userId: string, currentRole: User['role']) => Promise<void>;
	isMutating: boolean;
}

export function UserRow({ user, onResetPassword, onToggleRole, isMutating }: Props) {
	return (
		<TableRow>
			<TableCell>{user.full_name || '-'}</TableCell>
			<TableCell>{user.email || '-'}</TableCell>
			<TableCell>{user.username || '-'}</TableCell>
			<TableCell className="capitalize">{user.role}</TableCell>
			<TableCell>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onToggleRole(user.id, user.role)}
						disabled={isMutating}
					>
						{isMutating ? 'Updating...' : 'Change Role'}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onResetPassword(user.email!)}
						disabled={!user.email || isMutating}
					>
						Reset Password
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}
