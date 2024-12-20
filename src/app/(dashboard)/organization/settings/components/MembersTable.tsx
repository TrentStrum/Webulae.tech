'use client';

import { useOrganization } from '@clerk/nextjs';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/src/components/ui/table';


export function MembersTable() {
	const { organization, memberships } = useOrganization();

	const handleRemoveMember = async (memberId: string) => {
		try {
			await organization?.removeMember(memberId);
			// Add toast notification for success
		} catch (error) {
			console.error('Failed to remove member:', error);
			// Add toast notification for error
		}
	};

	const handleUpdateRole = async (memberId: string, role: string): Promise<void> => {
		try {
			const memberships = await organization?.getMemberships();
			const membership = memberships?.data.find(m => m.id === memberId);
			await membership?.update({ role });
			// Add toast notification for success
		} catch (error) {
			console.error('Failed to update role:', error);
			// Add toast notification for error
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{memberships?.data?.map((member) => (
					<TableRow key={member.id}>
						<TableCell>
							{member.publicUserData?.firstName} {member.publicUserData?.lastName}
						</TableCell>
						<TableCell>{member.publicUserData?.identifier}</TableCell>
						<TableCell>{member.role}</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'org:admin')}>
										Make Admin
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'org:member')}>
										Make Member
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleRemoveMember(member.id)}
										className="text-red-600"
									>
										Remove
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
