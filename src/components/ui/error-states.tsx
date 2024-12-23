import { AlertCircle, RefreshCcw, WifiOff } from 'lucide-react';

import { Button } from './button';

interface ErrorStateProps {
	title: string;
	message: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export function NetworkError({ retry }: { retry: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center p-8">
			<WifiOff className="h-12 w-12 text-gray-400" />
			<h3 className="mt-4 text-lg font-semibold">Connection Error</h3>
			<p className="mt-2 text-sm text-gray-500">
				Please check your internet connection and try again
			</p>
			<Button onClick={retry} className="mt-4">
				<RefreshCcw className="mr-2 h-4 w-4" />
				Retry
			</Button>
		</div>
	);
}

export function QueryError({ error, retry }: { error: Error; retry: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center p-8">
			<AlertCircle className="h-12 w-12 text-red-400" />
			<h3 className="mt-4 text-lg font-semibold">Error Loading Data</h3>
			<p className="mt-2 text-sm text-gray-500">{error.message}</p>
			<Button onClick={retry} className="mt-4">
				Try Again
			</Button>
		</div>
	);
}

export function EmptyState({ message, action }: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center p-8">
			<p className="mt-2 text-sm text-gray-500">{message}</p>
			{action && (
				<Button onClick={action.onClick} className="mt-4">
					{action.label}
				</Button>
			)}
		</div>
	);
}
