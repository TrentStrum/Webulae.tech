'use client';


import { useRouter } from 'next/navigation';

import { AccountForm } from '@/src/components/account/AccountForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useAccount, useUpdateAccount, useUpdatePassword } from '@/src/hooks/react-query/auth/queries';

import type { passwordSchema } from '@/src/schemas/auth';
import type { Account } from '@/src/types/auth.types';
import type * as z from 'zod';


export default function ClientAccountPage(): JSX.Element {
	const router = useRouter();
	const { toast } = useToast();
	const { data: account, isLoading } = useAccount();
	const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();
	const { mutate: updatePassword, isPending: isChangingPassword } = useUpdatePassword();

	if (isLoading) {
		return <div className="container py-8">Loading account settings...</div>;
	}

	const handleSubmit = async (formData: Partial<Account>): Promise<void> => {
		try {
			await updateAccount(formData, {
				onSuccess: () => {
					toast({
						title: 'Success',
						description: 'Account settings updated successfully.',
					});
					router.refresh();
				},
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update account settings.',
				variant: 'destructive',
			});
		}
	};

	const handlePasswordChange = async (data: z.infer<typeof passwordSchema>): Promise<void> => {
		try {
			await updatePassword({
				currentPassword: data.current_password,
				newPassword: data.new_password,
			}, {
				onSuccess: () => {
					toast({
						title: 'Success',
						description: 'Password updated successfully.',
					});
					router.refresh();
				},
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update password.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Account Settings</h1>
			<div className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>Email Preferences</CardTitle>
					</CardHeader>
					<CardContent>
						<AccountForm 
							onSubmit={handleSubmit} 
							onPasswordChange={handlePasswordChange}
							isSubmitting={isUpdating}
							isChangingPassword={isChangingPassword}
							defaultValues={account?.data}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 