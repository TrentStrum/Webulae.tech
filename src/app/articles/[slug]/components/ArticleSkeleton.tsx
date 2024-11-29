'use client';

import { Card, CardHeader, CardContent } from "@/src/components/ui/card";

export function ArticleSkeleton() {
	return (
		<div className="space-y-6">
			{[1, 2, 3].map((i) => (
				<Card key={i} className="animate-pulse">
					<CardHeader>
						<div className="h-8 bg-muted rounded w-3/4"></div>
					</CardHeader>
					<CardContent>
						<div className="h-4 bg-muted rounded w-full mb-4"></div>
						<div className="h-4 bg-muted rounded w-2/3"></div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
