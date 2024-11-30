import { AuthUser } from "@/src/types/authUser.types";
import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { LogoutButton } from '@/src/components/auth/logout-button';

const renderDropdownMenuItems = (user: AuthUser) => {
	const commonItems = [
		<DropdownMenuItem key="profile" asChild>
			<Link href="/profile">Profile</Link>
		</DropdownMenuItem>,
		<DropdownMenuItem key="settings" asChild>
			<Link href="/settings">Settings</Link>
		</DropdownMenuItem>,
	];

	const roleSpecificItems = {
		admin: [/* ... admin items ... */],
		developer: [/* ... developer items ... */],
		client: [/* ... client items ... */],
	};

	return [
		...(roleSpecificItems[user.role] || []),
		...commonItems,
		<DropdownMenuSeparator key="separator" />,
		<LogoutButton key="logout">Sign out</LogoutButton>,
	];
};

const UserMenu = ({ user }: { user: AuthUser }) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
				<Avatar className="h-8 w-8 ring-2 ring-primary/20">
					<AvatarImage src={user.avatar_url || undefined} alt={user.email} />
					<AvatarFallback className="bg-secondary text-secondary-foreground">
						{user.email[0].toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent className="w-56" align="end" forceMount>
			{renderDropdownMenuItems(user)}
		</DropdownMenuContent>
	</DropdownMenu>
);

export default UserMenu;
