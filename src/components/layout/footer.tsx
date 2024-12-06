import { Code2, Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const navigation = {
	main: [
		{ name: 'About', href: '/about' },
		{ name: 'Services', href: '/services' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Privacy', href: '#' },
		{ name: 'Terms', href: '#' },
	],
	social: [
		{ name: 'Facebook', icon: Facebook, href: '#' },
		{ name: 'Instagram', icon: Instagram, href: '#' },
		{ name: 'Twitter', icon: Twitter, href: '#' },
		{ name: 'GitHub', icon: Github, href: '#' },
		{ name: 'LinkedIn', icon: Linkedin, href: '#' },
	],
};

export function Footer() {
	return (
		<footer className="mt-auto border-t border-border/40">
			<div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
				<div className="flex items-center justify-center mb-8">
					<Link href="/" className="flex items-center group">
						<div className="relative w-8 h-8">
							<div className="absolute inset-0 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors" />
							<Code2 className="h-8 w-8 text-primary relative z-10" />
						</div>
						<span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
							Webulae
						</span>
					</Link>
				</div>
				<nav className="mb-8 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
					{navigation.main.map((item) => (
						<div key={item.name} className="pb-6">
							<Link href={item.href} className="text-sm leading-6 hover:text-primary">
								{item.name}
							</Link>
						</div>
					))}
				</nav>
				<div className="flex justify-center space-x-10">
					{navigation.social.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="text-muted-foreground hover:text-primary"
						>
							<span className="sr-only">{item.name}</span>
							<item.icon className="h-6 w-6" aria-hidden="true" />
						</Link>
					))}
				</div>
				<p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
					&copy; {new Date().getFullYear()} Webulae. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
