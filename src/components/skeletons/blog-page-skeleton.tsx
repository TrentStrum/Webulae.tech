import { Skeleton } from '@/src/components/ui/skeleton';

export function BlogPostSkeleton(): JSX.Element {
	return (
		<div className="space-y-6">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex flex-col gap-4 p-4 border rounded-lg">
					<Skeleton className="h-6 w-1/3" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			))}
		</div>
	);
} 