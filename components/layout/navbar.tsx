'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Code2, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';
import { useAuthState } from '@/hooks/use-auth-state';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { useNavigation } from '@/hooks/use-navigation';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const { user, loading } = useAuthState();
  const { isOpen, setIsOpen } = useMobileMenu();
  const { navigationItems, isActive } = useNavigation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const renderDropdownMenuItems = () => {
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
        <DropdownMenuItem key="projects" asChild>
          <Link href="/admin/projects">Manage Projects</Link>
        </DropdownMenuItem>,
        <DropdownMenuItem key="users" asChild>
          <Link href="/admin/users">Manage Users</Link>
        </DropdownMenuItem>,
        <DropdownMenuItem key="blog" asChild>
          <Link href="/blog/admin">Manage Blog</Link>
        </DropdownMenuItem>,
      ],
      developer: [
        <DropdownMenuItem key="dev-dashboard" asChild>
          <Link href="/developer">Developer Dashboard</Link>
        </DropdownMenuItem>,
        <DropdownMenuItem key="tasks" asChild>
          <Link href="/tasks">My Tasks</Link>
        </DropdownMenuItem>,
        <DropdownMenuItem key="docs" asChild>
          <Link href="/docs">Documentation</Link>
        </DropdownMenuItem>,
      ],
      client: [
        <DropdownMenuItem key="projects" asChild>
          <Link href="/projects">My Projects</Link>
        </DropdownMenuItem>,
        <DropdownMenuItem key="messages" asChild>
          <Link href="/messages">Messages</Link>
        </DropdownMenuItem>,
      ],
    };

    return [
      ...(user ? roleSpecificItems[user.role] || [] : []),
      ...commonItems,
      <DropdownMenuSeparator key="separator" />,
      <LogoutButton key="logout">Sign out</LogoutButton>,
    ];
  };

  return (
		<nav
			className="bg-background/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50"
			role="navigation"
			aria-label="Main navigation"
		>
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
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
										isActive(item.href)
											? 'text-primary border-b-2 border-primary'
											: 'hover:text-primary',
									)}
									aria-current={isActive(item.href) ? 'page' : undefined}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>

					<div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
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

						{!loading &&
							(user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="relative h-8 w-8 rounded-full"
											aria-label="User menu"
										>
											<Avatar className="h-8 w-8 ring-2 ring-primary/20">
												<AvatarImage src={user.avatar_url || undefined} alt={user.email} />
												<AvatarFallback className="bg-secondary text-secondary-foreground">
													{user.email[0].toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56" align="end" forceMount>
										{renderDropdownMenuItems()}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className="space-x-2">
									<Button variant="ghost" asChild>
										<Link href="/login">Log in</Link>
									</Button>
									<Button
										asChild
										className="bg-primary text-primary-foreground hover:bg-primary/90"
									>
										<Link href="/signup">Sign up</Link>
									</Button>
								</div>
							))}
					</div>

					<div className="flex items-center sm:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsOpen(!isOpen)}
							aria-expanded={isOpen}
							aria-controls="mobile-menu"
							aria-label="Toggle mobile menu"
						>
							{isOpen ? (
								<X className="block h-6 w-6" aria-hidden="true" />
							) : (
								<Menu className="block h-6 w-6" aria-hidden="true" />
							)}
						</Button>
					</div>
				</div>
			</div>

			<div
				ref={mobileMenuRef}
				className={cn('sm:hidden', isOpen ? 'block' : 'hidden')}
				id="mobile-menu"
				role="region"
				aria-label="Mobile menu"
			>
				<div className="pt-2 pb-3 space-y-1">
					{navigationItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'block pl-3 pr-4 py-2 text-base font-medium transition-colors',
								isActive(item.href)
									? 'text-primary bg-primary/10'
									: 'hover:text-primary hover:bg-primary/5',
							)}
							onClick={() => setIsOpen(false)}
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.name}
						</Link>
					))}
					{!loading && !user && (
						<div className="pt-4 pb-3 border-t border-border/40">
							<Button variant="ghost" className="w-full justify-start" asChild>
								<Link href="/login" onClick={() => setIsOpen(false)}>
									Log in
								</Link>
							</Button>
							<Button
								className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
								asChild
							>
								<Link href="/signup" onClick={() => setIsOpen(false)}>
									Sign up
								</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}