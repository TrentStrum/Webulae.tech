'use client';

import { useOrganization } from '@clerk/nextjs';
import { MoreHorizontal, Shield, UserMinus } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/select';
import { useToast } from '@/src/hooks/helpers/use-toast';

const roles = [
	{ value: 'admin', label: 'Admin' },
	{ value: 'basic_member', label: 'Member' },
] as const;

export function MemberRoleManagement(): JSX.Element {
	const { organization, membership } = useOrganization();
	const { toast } = useToast();
	const [loading, setLoading] = useState<string | null>(null);

	const updateMemberRole = async (memberId: string, role: string): Promise<void> => {
		if (!organization) return;

		setLoading(memberId);
		try {
			await organization.updateMember({
				userId: memberId,
				role,
			});
			toast({
				title: 'Role updated',
				description: 'Member role has been updated successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update member role.',
				variant: 'destructive',
			});
		} finally {
			setLoading(null);
		}
	};

	const removeMember = async (memberId: string): Promise<void> => {
		if (!organization) return;

		setLoading(memberId);
		try {
			await organization.removeMember(memberId);
			toast({
				title: 'Member removed',
				description: 'Member has been removed from the organization.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to remove member.',
				variant: 'destructive',
			});
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Member Management</h3>
				<p className="text-sm text-muted-foreground">
					Manage organization members and their roles.
				</p>
			</div>

			<div className="space-y-4">
				{organization?.getMemberships().then((memberships) => 
					memberships.map((member) => (
						<div
							key={member.id}
							className="flex items-center justify-between p-4 border rounded-lg"
						>
							<div className="flex items-center space-x-4">
								<Avatar>
									<AvatarImage src={member.publicUserData.imageUrl} />
									<AvatarFallback>
										{member.publicUserData.firstName?.[0] || 'U'}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">
										{member.publicUserData.firstName} {member.publicUserData.lastName}
									</p>
									<p className="text-sm text-muted-foreground">
										{member.publicUserData.identifier}
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								{member.role && (
									<Badge variant="outline">
										<Shield className="w-3 h-3 mr-1" />
										{member.role}
									</Badge>
								)}

								{membership?.role === 'admin' && member.id !== membership.id && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												disabled={loading === member.id}
											>
												<MoreHorizontal className="w-4 h-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<Select
												defaultValue={member.role}
												onValueChange={(value) => updateMemberRole(member.id, value)}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select role" />
												</SelectTrigger>
												<SelectContent>
													{roles.map((role) => (
														<SelectItem key={role.value} value={role.value}>
															{role.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="text-destructive focus:text-destructive"
												onClick={() => removeMember(member.id)}
											>
												<UserMinus className="w-4 h-4 mr-2" />
												Remove Member
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
} 