import { Loader2 } from 'lucide-react';

export function TableRowsSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, i) => (
				<tr key={i} className="animate-pulse">
					<td className="p-4">
						<div className="h-4 w-3/4 bg-gray-200 rounded" />
					</td>
					<td className="p-4">
						<div className="h-4 w-1/2 bg-gray-200 rounded" />
					</td>
					<td className="p-4">
						<div className="h-4 w-1/4 bg-gray-200 rounded" />
					</td>
				</tr>
			))}
		</>
	);
}

export function CardSkeleton() {
	return (
		<div className="p-4 border rounded-lg animate-pulse">
			<div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />
			<div className="h-4 w-1/2 bg-gray-200 rounded" />
		</div>
	);
}

export function LoadingSpinner({ className = 'h-4 w-4' }) {
	return <Loader2 className={`animate-spin ${className}`} />;
}

export function LoadingOverlay() {
	return (
		<div className="absolute inset-0 bg-white/50 flex items-center justify-center">
			<LoadingSpinner className="h-8 w-8" />
		</div>
	);
}
