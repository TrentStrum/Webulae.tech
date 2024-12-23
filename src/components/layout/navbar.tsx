'use client';

import { Code2, Menu, Moon, Sun, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useRef, useEffect } from 'react';

import { PermissionGate } from '@/src/components/auth/PermissionGate';
import AuthButtons from '@/src/components/buttons/AuthButton';
import { UserMenu } from '@/src/components/menu/UserMenu';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { useMobileMenu } from '@/src/hooks/helpers/use-mobile-menu';
import { useNavigation } from '@/src/hooks/helpers/use-navigation';
import { cn } from '@/src/utils/utils';

import type { NavigationItem } from '@/src/types/navigation.types';
import type { Permission } from '@/src/types/permissions.types';

export function Navbar(): JSX.Element {
	const { theme, setTheme } = useTheme();
	const { user, isLoading } = useAuth();
	const { isOpen, setIsOpen } = useMobileMenu();
	const { navigationItems, isActive } = useNavigation();
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, setIsOpen]);

	const renderNavItem = (item: NavigationItem) => {
		const link = (
			<Link
				href={item.href}
				className={cn(
					'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
					isActive(item.href)
						? 'text-primary border-b-2 border-primary'
						: 'hover:text-primary'
				)}
			>
				{item.name}
			</Link>
		);

		return item.permission ? (
			<PermissionGate key={item.href} permission={item.permission as Permission}>
				{link}
			</PermissionGate>
		) : (
			link
		);
	};

	return (
		<nav className="bg-background/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link href="/" className="flex-shrink-0 flex items-center group" aria-label="Home">
							<div className="relative w-8 h-8">
								<div className="absolute inset-0 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors" />
								<Code2 className="h-8 w-8 text-primary relative z-10" />
							</div>
							<span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
								Webulae
							</span>
						</Link>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							{navigationItems.map((item) => (
								<div key={item.href}>
									{renderNavItem(item)}
								</div>
							))}
						</div>
					</div>

					<div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
						<Button
								variant="ghost"
								size="icon"
								onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
						>
							<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						</Button>

						{!isLoading && (user ? <UserMenu user={user} /> : <AuthButtons />)}
					</div>

					<div className="flex items-center sm:hidden">
						<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</Button>
					</div>
				</div>
			</div>

			<div
					ref={mobileMenuRef}
					className={cn('sm:hidden', isOpen ? 'block' : 'hidden')}
			>
				<div className="pt-2 pb-3 space-y-1">
					{navigationItems.map((item) => {
						const mobileLink = (
							<Link
									key={item.href}
									href={item.href}
									className={cn(
											'block pl-3 pr-4 py-2 text-base font-medium transition-colors',
											pathname.startsWith(item.href)
													? 'text-primary bg-primary/10'
													: 'hover:text-primary hover:bg-primary/5'
									)}
									onClick={() => setIsOpen(false)}
							>
									{item.name}
							</Link>
						);

						return (
								<div key={item.href}>
										{item.permission ? (
												<PermissionGate permission={item.permission}>
														{mobileLink}
												</PermissionGate>
										) : (
												mobileLink
										)}
								</div>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
