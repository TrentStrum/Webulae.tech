import { Protected } from '@/src/components/auth/protected';
import { DataGrid } from '@/src/components/data-grid';
import { Button } from '@/src/components/ui/button';
import { useModal } from '@/src/components/ui/modal-manager';
import { useInviteUser } from '@/src/hooks/react-query/mutations/use-invite-user';
import { useUsers } from '@/src/hooks/react-query/users';

import { UserActions } from './user-actions';

import type { User } from '@/src/types/user.types';

const USER_COLUMNS = [
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		id: 'actions',
		cell: ({ row }: { row: { original: User } }) => <UserActions user={row.original} />,
	},
];

export function UserManagement(): JSX.Element {
	const { data: users, isLoading } = useUsers();
	const { showModal } = useModal();
	const inviteUser = useInviteUser();

	const handleInviteUser = (): void => {
		showModal('invite', {
			onSubmit: async (data: { email: string; role: string }): Promise<void> => {
				await inviteUser.mutateAsync(data);
			},
		});
	};

	return (
		<Protected permission="manage_users">
			<div className="space-y-4">
				<div className="flex justify-between">
					<h2 className="text-2xl font-bold">Users</h2>
					<Button onClick={handleInviteUser}>Invite User</Button>
				</div>
			
				<DataGrid
					data={users?.data}
					columns={USER_COLUMNS}
					isLoading={isLoading}
					actions={[
						{
							label: 'Delete Selected',
							permission: 'manage_users',
							onClick: (selected) => {
								showModal('delete', {
									items: selected,
									type: 'users',
								});
							},
						},
					]}
				/>
			</div>
		</Protected>
	);
}
