'use client';

import { LoadingSpinner } from './loading-spinner';

export function LoadingPage() {
	return (
		<div className="min-h-[50vh] flex items-center justify-center">
			<LoadingSpinner size="lg" />
		</div>
	);
}
