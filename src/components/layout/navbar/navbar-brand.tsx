'use client';

import { Code2 } from 'lucide-react';
import Link from 'next/link';

export function NavbarBrand() {
	return (
		<Link href="/" className="flex-shrink-0 flex items-center group" aria-label="Home">
			<div className="relative w-8 h-8">
				<div className="absolute inset-0 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors" />
				<Code2 className="h-8 w-8 text-primary relative z-10" />
			</div>
			<span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
				Webulae
			</span>
		</Link>
	);
}
