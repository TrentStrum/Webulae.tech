'use client';

import { useAuth, useOrganizationList, useOrganization } from '@clerk/nextjs';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from '@radix-ui/react-dropdown-menu';
import {
	Building,
	ChevronDown,
	LogOut,
	Plus,
	Mail,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { CreateOrganizationDialog } from '@/src/components/organization/CreateOrganizationDialog';
import { InviteMemberDialog } from '@/src/components/organization/InviteMemberDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { menuItems } from '@/src/config/menu.config';
import { usePermissions } from '@/src/lib/permissions';
import { cn } from '@/src/lib/utils';

import type { AuthUser } from '@/src/types/authUser.types';


type OrganizationMembership = {
	organization: {
		id: string;
		name: string;
		imageUrl: string;
	};
	role: string;
};

interface UserMenuProps {
	user: AuthUser;
}

export function UserMenu({ user }: UserMenuProps): JSX.Element {
	const { signOut } = useAuth();
	const { userId } = useAuth();
	const { can } = usePermissions();
	const { userMemberships, setActive } = useOrganizationList();
	const { organization } = useOrganization();
	const [showCreateOrg, setShowCreateOrg] = useState(false);
	const [showInvite, setShowInvite] = useState(false);
	const [open, setOpen] = useState(false);

	const getInitial = (): string => {
		if (!userId) return 'U';
		if (user?.firstName) return user.firstName[0].toUpperCase();
		if (user?.emailAddresses[0]?.emailAddress) {
			return user.emailAddresses[0].emailAddress[0].toUpperCase();
		}
		return 'U';
	};

	return (
		<>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
						<Avatar className="h-8 w-8 ring-2 ring-primary/20">
							<AvatarImage
								src={user?.imageUrl}
								alt={user?.fullName || 'User avatar'}
								className="rounded-full"
							/>
							<AvatarFallback className="bg-secondary text-secondary-foreground">
								{getInitial()}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end">
					<div className="flex items-center justify-start gap-2 p-2">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user?.emailAddresses?.[0]?.emailAddress}
							</p>
						</div>
					</div>
					<DropdownMenuSeparator />

					{/* Organization Management */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="w-full">
							<Building className="mr-2 h-4 w-4" />
							<span className="flex-1 text-left">Organization</span>
							<ChevronDown className="ml-2 h-4 w-4" />
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="w-56">
							<DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{userMemberships?.data?.map((membership: OrganizationMembership) => (
								<DropdownMenuItem
									key={membership.organization.id}
									onClick={() =>
										setActive?.({
											organization: membership.organization.id,
										})
									}
									className={cn(
										'cursor-pointer',
										membership.organization.id === organization?.id && 'bg-secondary'
									)}
								>
									<Avatar className="mr-2 h-4 w-4">
										<AvatarImage
											src={membership.organization.imageUrl}
											alt={membership.organization.name}
										/>
										<AvatarFallback>{membership.organization.name[0]}</AvatarFallback>
									</Avatar>
									{membership.organization.name}
									{membership.role && (
										<Badge variant="outline" className="ml-2">
											{membership.role.replace('org:', '').charAt(0).toUpperCase() +
												membership.role.replace('org:', '').slice(1)}
										</Badge>
									)}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setShowCreateOrg(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Create Organization
							</DropdownMenuItem>
							{organization && can('members:invite') && (
								<DropdownMenuItem onClick={() => setShowInvite(true)}>
									<Mail className="mr-2 h-4 w-4" />
									Invite Members
								</DropdownMenuItem>
							)}
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSeparator />

					{/* Role-specific Menu Items */}
					{menuItems.map((item) => (
						<DropdownMenuItem key={item.href} asChild>
							<Link href={item.href} className="flex items-center">
								<item.icon className="mr-2 h-4 w-4" />
								<span className="flex-1">{item.name}</span>
								{item.badge && (
									<Badge variant="secondary" className="ml-2">
										{item.badge}
									</Badge>
								)}
							</Link>
						</DropdownMenuItem>
					))}

					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive focus:text-destructive"
						onSelect={(e) => {
							e.preventDefault();
							void signOut();
						}}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CreateOrganizationDialog open={showCreateOrg} onOpenChange={setShowCreateOrg} />

			<InviteMemberDialog
				open={showInvite}
				onOpenChange={setShowInvite}
				organizationId={organization?.id}
			/>
		</>
	);
}
