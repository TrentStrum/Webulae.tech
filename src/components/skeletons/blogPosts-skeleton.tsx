import { Skeleton } from '@/src/components/ui/skeleton';

export function BlogPostsSkeleton(): JSX.Element {
	return (
		<div className="space-y-12">
			{/* Featured Post Skeleton */}
			<div className="w-full">
				<Skeleton className="w-full h-[400px] rounded-lg" />
				<div className="mt-4 space-y-3">
					<Skeleton className="w-24 h-5" /> {/* Category */}
					<Skeleton className="w-3/4 h-8" /> {/* Title */}
					<Skeleton className="w-full h-20" /> {/* Description */}
				</div>
			</div>

			{/* Category Sections */}
			{[1, 2].map((section) => (
				<div key={section} className="space-y-4">
					{/* Category Header */}
					<div className="flex justify-between items-center">
						<Skeleton className="w-40 h-8" />
						<div className="flex gap-2">
							<Skeleton className="w-8 h-8 rounded-md" />
							<Skeleton className="w-8 h-8 rounded-md" />
						</div>
					</div>

					{/* Scrollable Posts */}
					<div className="flex gap-6 overflow-hidden">
						{[1, 2, 3].map((post) => (
							<div key={post} className="min-w-[300px] md:min-w-[350px] space-y-3">
								<Skeleton className="w-full h-[200px] rounded-lg" />
								<Skeleton className="w-20 h-4" /> {/* Category */}
								<Skeleton className="w-full h-6" /> {/* Title */}
								<Skeleton className="w-full h-16" /> {/* Description */}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
