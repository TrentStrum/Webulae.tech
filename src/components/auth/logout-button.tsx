'use client';

import { LogOut } from 'lucide-react';
import { forwardRef } from 'react';

import { useLogout } from '@/src/hooks/auth/useLogout';

import { Button } from '../ui/button';

const LogoutButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
	function LogoutButton(props, ref) {
		const { logout, isLoading } = useLogout();

		const handleLogout = (e: React.MouseEvent) => {
			e.preventDefault();
			logout();
		};

		return (
			<Button
				variant="ghost"
				onClick={handleLogout}
				disabled={isLoading}
				className="w-full justify-start"
				ref={ref}
				{...props}
			>
				<LogOut className="mr-2 h-4 w-4" />
				Log out
			</Button>
		);
	}
);

export default LogoutButton;
