import Link from 'next/link';

import { cn } from '@/src/lib/utils';

import type { NavItemType } from '@/src/types/nav-item.types';
import type { ComponentType } from 'react';

interface NavItemProps {
	item: NavItemType;
	isActive: boolean;
}

export function NavItem({ item, isActive }: NavItemProps): JSX.Element {
	const Icon: ComponentType<{ className?: string }> = item.icon;

	return (
		<Link
			href={item.href}
			className={cn(
				'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
				isActive
					? 'bg-gray-100 text-gray-900'
					: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
			)}
		>
			<Icon className="h-5 w-5" />
			{item.label}
		</Link>
	);
}
