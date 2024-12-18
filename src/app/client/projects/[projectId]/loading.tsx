import { Card, CardContent } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<Skeleton className="h-10 w-64 mb-2" />
					<Skeleton className="h-6 w-24" />
				</div>
				<Skeleton className="h-10 w-48" />
			</div>

			<div className="space-y-6">
				<Card>
					<CardContent className="p-6">
						<div className="space-y-4">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-2/3" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="space-y-4">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-2/3" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
