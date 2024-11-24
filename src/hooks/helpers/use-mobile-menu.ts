'use client';

import { useEffect, useState } from 'react';

export function useMobileMenu() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsOpen(false);
			}
		};

		const handleResize = () => {
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
