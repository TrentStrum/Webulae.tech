'use client';

import { Skeleton } from "@/src/components/ui/skeleton";

export function BlogPostSkeleton(): JSX.Element {
	return (
		<div className="container py-8 max-w-4xl mx-auto space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<Skeleton className="w-3/4 h-12" /> {/* Title */}
				<div className="flex items-center gap-4">
					<Skeleton className="w-32 h-4" /> {/* Date */}
					<Skeleton className="w-4 h-4" /> {/* Dot */}
					<Skeleton className="w-24 h-4" /> {/* Category */}
				</div>
			</div>

			{/* Featured Image */}
			<Skeleton className="w-full h-[400px] rounded-lg" />

			{/* Content */}
			<div className="space-y-4">
				<Skeleton className="w-full h-24" />
				<Skeleton className="w-5/6 h-24" />
				<Skeleton className="w-full h-24" />
			</div>
		</div>
	);
}
