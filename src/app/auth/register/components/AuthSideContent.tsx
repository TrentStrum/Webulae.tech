'use client';

import type { LucideIcon } from 'lucide-react';

type Props = {
	icon: LucideIcon;
	title: string;
	quote: string;
	author?: string;
}

export function AuthSideContent({ icon: Icon, title, quote, author }: Props) {
	return (
		<div className="hidden lg:flex flex-col items-center justify-center bg-muted text-white p-8">
			<div className="flex flex-col items-center text-center space-y-4">
				<div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full">
					<Icon className="text-white w-8 h-8" />
				</div>
				<h2 className="text-2xl font-semibold">{title}</h2>
				<blockquote className="italic text-lg">&ldquo;{quote}&rdquo;</blockquote>
				{author && <p className="text-sm mt-4">- {author}</p>}
			</div>
		</div>
	);
}
