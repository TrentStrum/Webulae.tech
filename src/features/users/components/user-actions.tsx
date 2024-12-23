import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

import type { User } from '@/src/types/user.types';

interface UserActionsProps {
	user: User;
}

export function UserActions({ user }: UserActionsProps): JSX.Element {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => console.warn(`Edit user ${user.id}`)}>Edit</DropdownMenuItem>
				<DropdownMenuItem onClick={() => console.warn(`Delete user ${user.id}`)} className="text-destructive">
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
