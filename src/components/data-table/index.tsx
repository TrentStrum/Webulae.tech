import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
} from '@tanstack/react-table';

import { QueryError } from '@/src/components/ui/error-states';
import { TableRowsSkeleton } from '@/src/components/ui/loading-states';

interface DataTableProps<TData> {
	data?: TData[];
	columns: ColumnDef<TData>[];
	isLoading?: boolean;
	error?: Error;
	onRetry?: () => void;
}

export function DataTable<TData>({
	data = [],
	columns,
	isLoading,
	error,
	onRetry,
}: DataTableProps<TData>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	if (error) {
		return <QueryError error={error} retry={onRetry!} />;
	}

	return (
		<div className="rounded-md border">
			<table className="w-full">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} className="p-4 text-left">
									{flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{isLoading ? (
						<TableRowsSkeleton rows={5} />
					) : (
						table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="p-4">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
