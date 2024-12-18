import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function DashboardSkeleton() {
	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<Skeleton className="h-10 w-48" />
				<div className="space-x-4">
					<Skeleton className="h-10 w-32 inline-block" />
					<Skeleton className="h-10 w-32 inline-block" />
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-8 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-between items-center">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-20" />
						</div>
						<div className="flex justify-between items-center">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-20" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
