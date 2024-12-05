import { LucideIcon } from 'lucide-react';

type Props = {
	icon: LucideIcon;
	title: string;
	quote: string;
	author?: string;
}

export function AuthSideContent({ icon: Icon, title, quote, author }: Props) {
	return (
		<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
			<div className="absolute inset-0 bg-primary" />
			<div className="relative z-20 flex items-center text-lg font-medium">
				<Icon className="mr-2 h-6 w-6" /> {title}
			</div>
			<div className="relative z-20 mt-auto">
				<blockquote className="space-y-2">
					<p className="text-lg">{quote}</p>
					{author && <footer className="text-sm">{author}</footer>}
				</blockquote>
			</div>
		</div>
	);
}
