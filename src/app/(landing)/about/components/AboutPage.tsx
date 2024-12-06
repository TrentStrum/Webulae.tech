'use client';

import { Card, CardContent } from '@/src/components/ui/card';

export function AboutPage(): JSX.Element {
	return (
		<div className="container py-8">
			<Card>
				<CardContent>
					<h1 className="text-4xl font-bold mb-6">About Us</h1>
					<p className="text-lg text-muted-foreground mb-6">
						Founded in 2024, Webulae has been at the forefront of digital innovation, delivering
						cutting-edge software solutions that transform businesses. Our team of passionate
						developers, designers, and strategists work together to create exceptional digital
						experiences.
					</p>
					<p className="text-lg text-muted-foreground">
						We believe in pushing the boundaries of what&apos;s possible in software development
						while maintaining the highest standards of quality and reliability.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
