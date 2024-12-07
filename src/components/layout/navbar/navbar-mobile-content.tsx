'use client';

import Link from 'next/link';

import { Button } from '@/src/components/ui/button';
import { useNavigation } from '@/src/hooks/helpers/use-navigation';
import { cn } from '@/src/utils/utils';

import type { AuthUser } from '@/src/types/authUser.types';

interface NavbarMobileContentProps {
	isOpen: boolean;
	user: AuthUser | null;
	items: Array<{ name: string; href: string }>;
}

export function NavbarMobileContent({ isOpen, user, items }: NavbarMobileContentProps) {
	const { isActive } = useNavigation();

	if (!isOpen) return null;

	return (
		<div className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="space-y-1 pb-3 pt-2 px-4">
				{items.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							'block px-3 py-2 text-base font-medium rounded-md transition-colors',
							isActive(item.href)
								? 'text-primary bg-primary/10'
								: 'hover:text-primary hover:bg-primary/5'
						)}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{item.name}
					</Link>
				))}
			</div>

			{!user && (
				<div className="border-t border-border/40 pb-3 pt-4 px-4">
					<div className="flex flex-col gap-2">
						<Button variant="ghost" asChild className="justify-center">
							<Link href="/auth/login">Log in</Link>
						</Button>
						<Button asChild className="justify-center">
							<Link href="/auth/signup">Sign up</Link>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
