'use client';

import { AlertTriangle } from 'lucide-react';
import { Component } from 'react';


import { Button } from '../ui/button';

import type { ErrorInfo, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	private handleRetry = () => {
		this.setState({ hasError: false, error: undefined });
	};

	private handleNavigation = (): void => {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	};

	private handleRefresh = (): void => {
		this.handleNavigation();
	};

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-h-screen flex items-center justify-center p-4">
					<div className="max-w-md w-full bg-background border rounded-lg p-6 text-center">
						<AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
						<h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
						<p className="text-muted-foreground mb-6">
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<div className="space-x-4">
							<Button onClick={this.handleRefresh}>Refresh Page</Button>
							<Button variant="outline" onClick={this.handleRetry}>
								Try Again
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
