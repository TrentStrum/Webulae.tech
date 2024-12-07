'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import UserMenu from '@/src/components/menu/UserMenu';
import { Button } from '@/src/components/ui/button';

import type { AuthUser } from '@/src/types/authUser.types';

interface NavbarActionsProps {
	user: AuthUser | null;
	isMounted: boolean;
}

export function NavbarActions({ user, isMounted }: NavbarActionsProps) {
	const { theme, setTheme } = useTheme();

	return (
		<div className="hidden sm:flex sm:items-center sm:gap-4">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				aria-label={
					isMounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Toggle theme'
				}
			>
				<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			</Button>

			{user ? (
				<UserMenu user={user} />
			) : (
				<div className="flex items-center gap-2">
					<Button variant="ghost" asChild>
						<Link href="/auth/login">Log in</Link>
					</Button>
					<Button asChild>
						<Link href="/auth/signup">Sign up</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
