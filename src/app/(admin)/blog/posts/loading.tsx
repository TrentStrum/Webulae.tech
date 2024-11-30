import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function BlogListLoading() {
	return (
		<div className="container py-8">
			<Skeleton className="h-10 w-32 mb-8" /> {/* Blog title skeleton */}
			<div className="space-y-4">
				{/* Generate 3 skeleton blog post cards */}
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-3/4" /> {/* Title skeleton */}
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-full mb-4" /> {/* Excerpt line 1 */}
							<Skeleton className="h-4 w-2/3 mb-6" /> {/* Excerpt line 2 */}
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-24" /> {/* Author skeleton */}
								<Skeleton className="h-4 w-20" /> {/* Date badge skeleton */}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
