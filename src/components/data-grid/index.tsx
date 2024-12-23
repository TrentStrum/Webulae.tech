import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type OnChangeFn,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Protected } from '@/src/components/auth/protected';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

import type { Permission } from '@/src/lib/auth/roles';

interface DataGridProps<TData> {
	data?: TData[];
	columns: ColumnDef<TData>[];
	isLoading?: boolean;
	error?: Error;
	onRetry?: () => void;
	actions?: Array<{
		label: string;
		permission?: Permission;
		onClick: (selectedRows: TData[]) => void;
	}>;
	filters?: Array<{
		name: string;
		options: Array<{ label: string; value: string }>;
	}>;
}

export function DataGrid<TData>({ data = [], columns, actions, filters }: DataGridProps<TData>) {
	const [rowSelection, setRowSelection] = useState({});
	const [globalFilter, setGlobalFilter] = useState('');
	const [columnFilters, setColumnFilters] = useState<{ id: string; value: string }[]>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
			globalFilter,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		onColumnFiltersChange: setColumnFilters as OnChangeFn<ColumnFiltersState>,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Input
					placeholder="Search..."
					value={globalFilter}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="max-w-sm"
				/>
				<div className="flex gap-2">
					{actions?.map((action) => (
						<Protected key={action.label} permission={action.permission as Permission}>
							<Button
								onClick={() => action.onClick(selectedRows)}
								disabled={selectedRows.length === 0}
							>
								{action.label}
							</Button>
						</Protected>
					))}
				</div>
			</div>

			{filters && (
				<div className="flex gap-4">
					{filters.map((filter) => (
						<select
							key={filter.name}
							onChange={(e) =>
								setColumnFilters((prev) => [...prev, { id: filter.name, value: e.target.value }])
							}
						>
							{filter.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					))}
				</div>
			)}

			{/* Table implementation from previous example */}
		</div>
	);
}
