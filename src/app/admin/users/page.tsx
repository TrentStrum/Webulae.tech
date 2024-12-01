'use client';

import { useToast } from "@/src/hooks";
import { useResetPassword } from "@/src/hooks/react-query/useResetPassword";
import { useState } from "react";
import { useToggleUserRole, useUsers } from "@/src/hooks/react-query/useUsers";
import { UserTable } from "./components/UserTable";
import { User } from "@/src/types/user.types";

export default function AdminUsersPage() {
	const { data: users, isLoading } = useUsers();
	const { mutate: resetPassword, isPending: isResetting } = useResetPassword();
	const { mutate: toggleRole, isPending: isToggling } = useToggleUserRole();
	const { toast } = useToast();
	const [activeUserId, setActiveUserId] = useState<string | null>(null);

	const handleResetPassword = async (email: string) => {
		const userId = users?.find((u) => u.email === email)?.id || null;
		setActiveUserId(userId);
		try {
			await resetPassword(email);
			toast({
				title: 'Success',
				description: 'Password reset email sent successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to send password reset email.',
				variant: 'destructive',
			});
		}
		setActiveUserId(null);
	};

	const handleToggleRole = async (userId: string, currentRole: User['role']) => {
		setActiveUserId(userId);
		try {
			await toggleRole({ userId, currentRole });
			toast({
				title: 'Success',
				description: 'User role updated successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update user role.',
				variant: 'destructive',
			});
		}
		setActiveUserId(null);
	};

	if (isLoading) {
		return (
			<div className="container py-8">
				<h1 className="text-3xl font-bold mb-8">User Management</h1>
				<div className="animate-pulse space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-16 bg-muted rounded" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">User Management</h1>
			<UserTable
				onResetPassword={handleResetPassword}
				onToggleRole={handleToggleRole}
				isMutating={activeUserId}
			/>
		</div>
	);
}
