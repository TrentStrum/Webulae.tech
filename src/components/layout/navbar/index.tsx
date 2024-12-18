'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/src/contexts/AuthContext';
import { useMobileMenu } from '@/src/hooks/helpers/use-mobile-menu';
import { useNavigation } from '@/src/hooks/helpers/use-navigation';

import { NavbarActions } from './navbar-actions';
import { NavbarBrand } from './navbar-brand';
import { NavbarDesktopLinks } from './navbar-desktop-links';
import { NavbarMobileContent } from './navbar-mobile-content';
import { NavbarMobileMenu } from './navbar-mobile-menu';

export function Navbar() {
	const [isMounted, setIsMounted] = useState(false);
	const { user } = useAuth();
	const { isOpen, setIsOpen } = useMobileMenu();
	const { navigationItems } = useNavigation();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<nav className="sticky top-0 z-50">
			<div className="bg-background/80 backdrop-blur-sm border-b border-border/40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<NavbarBrand />
							<NavbarDesktopLinks items={navigationItems} />
						</div>

						<div className="flex items-center gap-2">
							{user ? (
								<NavbarActions user={user} isMounted={isMounted} />
							) : (
								<NavbarActions isMounted={isMounted} />
							)}
							<NavbarMobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
						</div>
					</div>
				</div>
			</div>
			<NavbarMobileContent isOpen={isOpen} user={user} items={navigationItems} />
		</nav>
	);
}
