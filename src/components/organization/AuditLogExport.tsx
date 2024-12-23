'use client';

import { useOrganization } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/src/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/select';
import { useToast } from '@/src/hooks/helpers/use-toast';

interface ExportOptions {
	format: 'csv' | 'json';
	timeRange: '7d' | '30d' | '90d' | 'all';
	eventTypes: string[];
}

export function AuditLogExport(): JSX.Element {
	const { organization } = useOrganization();
	const { toast } = useToast();
	const [showExportDialog, setShowExportDialog] = useState(false);
	const [exporting, setExporting] = useState(false);
	const [options, setOptions] = useState<ExportOptions>({
		format: 'csv',
		timeRange: '30d',
		eventTypes: ['all'],
	});

	const handleExport = async (): Promise<void> => {
		if (!organization) return;

		setExporting(true);
		try {
			const response = await fetch('/api/organizations/audit-logs/export', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					organizationId: organization.id,
					...options,
				}),
			});

			if (!response.ok) throw new Error('Export failed');

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.${options.format}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			toast({
				title: 'Export successful',
				description: 'Your audit logs have been exported successfully.',
			});
			setShowExportDialog(false);
		} catch (error) {
			toast({
				title: 'Export failed',
				description: 'Failed to export audit logs. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setExporting(false);
		}
	};

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				className="ml-auto"
				onClick={() => setShowExportDialog(true)}
			>
				<Download className="h-4 w-4 mr-2" />
				Export Logs
			</Button>

			<Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Export Audit Logs</DialogTitle>
						<DialogDescription>
							Choose your export format and time range.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<label htmlFor="format" className="text-sm font-medium">Format</label>
							<Select
								value={options.format}
								onValueChange={(value: 'csv' | 'json') =>
									setOptions({ ...options, format: value })
								}
							>
								<SelectTrigger id="format">
									<SelectValue placeholder="Select format" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="csv">CSV</SelectItem>
									<SelectItem value="json">JSON</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label htmlFor="timeRange" className="text-sm font-medium">Time Range</label>
							<Select
								value={options.timeRange}
								onValueChange={(value: '7d' | '30d' | '90d' | 'all') =>
									setOptions({ ...options, timeRange: value })
								}
							>
								<SelectTrigger id="timeRange">
									<SelectValue placeholder="Select time range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7d">Last 7 days</SelectItem>
									<SelectItem value="30d">Last 30 days</SelectItem>
									<SelectItem value="90d">Last 90 days</SelectItem>
									<SelectItem value="all">All time</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button
							className="w-full"
							onClick={handleExport}
							disabled={exporting}
						>
							{exporting ? 'Exporting...' : 'Export'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
} 