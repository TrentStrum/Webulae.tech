import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface CardSkeletonProps {
	hasHeader?: boolean;
	lines?: number;
	className?: string;
}

export function CardSkeleton({ hasHeader = true, lines = 3, className = '' }: CardSkeletonProps) {
	return (
		<Card className={className}>
			{hasHeader && (
				<CardHeader>
					<Skeleton className="h-6 w-2/3" />
				</CardHeader>
			)}
			<CardContent className="space-y-3">
				{Array.from({ length: lines }).map((_, i) => (
					<Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
				))}
			</CardContent>
		</Card>
	);
}
