'use client';

import { useEffect, useState } from 'react';

export function useMobileMenu(): {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
} {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent): void => {
			if (e.key === 'Escape') {
				setIsOpen(false);
			}
		};

		const handleResize = (): void => {
			if (window.innerWidth >= 640) {
				setIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscape);
		window.addEventListener('resize', handleResize);

		return () => {
			document.removeEventListener('keydown', handleEscape);
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return {
		isOpen,
		setIsOpen,
	};
}
