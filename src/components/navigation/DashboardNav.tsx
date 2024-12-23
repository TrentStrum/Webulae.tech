'use client';

import { useAuth } from '@clerk/nextjs';
import { ChevronDown, Settings, Users, Home, BarChart, CreditCard, FolderKanban, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/src/components/ui/collapsible';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/src/components/ui/sheet';
import { usePermissions } from '@/src/hooks/helpers/usePermissions';
import { cn } from '@/src/lib/utils';

import type { Permission } from '@/src/types/permissions.types';

type NavigationItem = {
	name: string;
	href: string;
	icon: React.ElementType;
	permission: string;
	children?: Omit<NavigationItem, 'children'>[];
};

const navigation: NavigationItem[] = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: Home,
		permission: 'view:dashboard',
	},
	{
		name: 'Projects',
		href: '/projects',
		icon: FolderKanban,
		permission: 'view:projects',
		children: [
			{
				name: 'All Projects',
				href: '/projects',
				icon: FolderKanban,
				permission: 'view:projects',
			},
			{
				name: 'Active Projects',
				href: '/projects/active',
				icon: FolderKanban,
				permission: 'view:projects',
			},
			{
				name: 'Archived Projects',
				href: '/projects/archived',
				icon: FolderKanban,
				permission: 'view:projects',
			},
		],
	},
	{
		name: 'Admin',
		href: '/admin',
		icon: Users,
		permission: 'manage:users',
		children: [
			{
				name: 'Users',
				href: '/admin/users',
				icon: Users,
				permission: 'manage:users',
			},
			{
				name: 'Reports',
				href: '/admin/reports',
				icon: BarChart,
				permission: 'view:reports',
			},
		],
	},
	{
		name: 'Organization',
		href: '/organization',
		icon: Settings,
		permission: 'manage:settings',
		children: [
			{
				name: 'Billing',
				href: '/organization/billing',
				icon: CreditCard,
				permission: 'manage:billing',
			},
			{
				name: 'Settings',
				href: '/organization/settings',
				icon: Settings,
				permission: 'manage:settings',
			},
		],
	},
] as const;

function NavItem({ item, isNested = false }: { item: NavigationItem; isNested?: boolean }): JSX.Element | null {
	const pathname = usePathname();
	const { can } = usePermissions();
	const [isOpen, setIsOpen] = useState(false);

	if (!can(item.permission as Permission)) return null;

	const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
	const Icon = item.icon;

	if (item.children) {
		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<button
						className={cn(
							'flex w-full items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors',
							isActive
								? 'bg-primary/10 text-primary hover:bg-primary/20'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						<div className="flex items-center">
							<Icon className="mr-3 h-5 w-5" />
							{item.name}
						</div>
						<ChevronDown
							className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
						/>
					</button>
				</CollapsibleTrigger>
				<CollapsibleContent className="pl-4 space-y-1">
					{item.children.map((child) => (
						<NavItem key={child.href} item={child} isNested />
					))}
				</CollapsibleContent>
			</Collapsible>
		);
	}

	return (
		<Link
			href={item.href}
			className={cn(
				'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
				isActive
					? 'bg-primary/10 text-primary hover:bg-primary/20'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground',
				isNested && 'text-sm'
			)}
		>
			<Icon className="mr-3 h-5 w-5" />
			{item.name}
		</Link>
	);
}

export function DashboardNav(): JSX.Element {
	const { isLoaded } = useAuth();
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	if (!isLoaded) {
		return (
			<nav className="space-y-1">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-10 rounded-md bg-muted/10 animate-pulse"
					/>
				))}
			</nav>
		);
	}

	const NavigationContent = (): JSX.Element => (
		<nav className="space-y-1">
			{navigation.map((item) => (
				<NavItem key={item.href} item={item} />
			))}
		</nav>
	);

	return (
		<>
			{/* Desktop Navigation */}
			<div className="hidden md:block">
				<NavigationContent />
			</div>

			{/* Mobile Navigation */}
			<div className="md:hidden">
				<Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Open navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[300px] sm:w-[400px]">
						<SheetHeader>
							<SheetTitle>Navigation</SheetTitle>
						</SheetHeader>
						<div className="mt-4">
							<NavigationContent />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}
