'use client';

import { LogOut } from 'lucide-react';
import { forwardRef } from 'react';

import { useLogoutMutation } from '@/src/hooks/auth/useAuthMutations';

import { Button } from '../ui/button';

const LogoutButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
	function LogoutButton(props, ref) {
		const { mutate: logout, isPending } = useLogoutMutation();
		console.log('LogoutButton: Component rendered');

		const handleLogout = (e: React.MouseEvent) => {
			console.log('LogoutButton: Click detected - before preventDefault');
			e.preventDefault();
			console.log('LogoutButton: Click detected - after preventDefault');

			logout(undefined, {
				onSuccess: () => {
					console.log('LogoutButton: Logout successful');
				},
				onError: (error) => {
					console.error('Logout error:', error);
				},
			});
		};

		return (
			<Button
				variant="ghost"
				onClick={handleLogout}
				disabled={isPending}
				className="w-full justify-start"
				ref={ref}
				{...props}
			>
				<LogOut className="mr-2 h-4 w-4" />
				Log out
			</Button>
		);
	},
);

export default LogoutButton;
