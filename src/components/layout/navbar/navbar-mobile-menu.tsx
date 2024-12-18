'use client';

import { Menu, X } from 'lucide-react';

import { Button } from '@/src/components/ui/button';

interface NavbarMobileMenuProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export function NavbarMobileMenu({ isOpen, setIsOpen }: NavbarMobileMenuProps) {
	return (
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
	);
}
