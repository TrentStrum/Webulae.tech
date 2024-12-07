'use client';

import Link from 'next/link';

import LogoutButton from '@/src/components/auth/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

import type { AuthUser } from '@/src/types/authUser.types';

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
		admin: [
			<DropdownMenuItem key="admin-dashboard" asChild>
				<Link href="/admin">Admin Dashboard</Link>
			</DropdownMenuItem>,
			<DropdownMenuItem key="users" asChild>
				<Link href="/admin/users">Manage Users</Link>
			</DropdownMenuItem>,
			<DropdownMenuItem key="admin-settings" asChild>
				<Link href="/admin/settings">System Settings</Link>
			</DropdownMenuItem>,
			<DropdownMenuSeparator key="admin-separator" />,
		],
		developer: [
			<DropdownMenuItem key="developer-dashboard" asChild>
				<Link href="/developer">Developer Dashboard</Link>
			</DropdownMenuItem>,
			<DropdownMenuItem key="developer-api-docs" asChild>
				<Link href="/developer/api">API Documentation</Link>
			</DropdownMenuItem>,
			<DropdownMenuItem key="developer-tools" asChild>
				<Link href="/developer/tools">Developer Tools</Link>
			</DropdownMenuItem>,
			<DropdownMenuItem key="developer-settings" asChild>
				<Link href="/developer/settings">Developer Settings</Link>
			</DropdownMenuItem>,
			<DropdownMenuSeparator key="developer-separator" />,
		],
		client: [
			<DropdownMenuItem key="client-dashboard" asChild>
				<Link href="/client">Client Dashboard</Link>
			</DropdownMenuItem>,
		],
	};

	return [
		...(roleSpecificItems[user.role] || []),
		...commonItems,
		<DropdownMenuSeparator key="separator" />,
		<DropdownMenuItem key="logout" onSelect={(e) => e.preventDefault()}>
			<LogoutButton />
		</DropdownMenuItem>,
	];
};

const UserMenu = ({ user }: { user: AuthUser }) => {
	// Get initial from email or username, fallback to 'U'
	const getInitial = () => {
		if (!user) return 'U';
		if (user.email && user.email.length > 0) {
			return user.email[0].toUpperCase();
		}
		if (user.username && user.username.length > 0) {
			return user.username[0].toUpperCase();
		}
		return 'U';
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
					<Avatar className="h-8 w-8 ring-2 ring-primary/20">
						<AvatarImage
							src={user.avatar_url || undefined}
							alt={user.email || user.username || ''}
						/>
						<AvatarFallback className="bg-secondary text-secondary-foreground">
							{getInitial()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				{renderDropdownMenuItems(user)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserMenu;
