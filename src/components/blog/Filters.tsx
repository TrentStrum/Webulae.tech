'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/select';

import type { Dispatch, SetStateAction } from 'react';

interface FiltersProps {
	sortBy: 'newest' | 'oldest';
	setSortBy: Dispatch<SetStateAction<'newest' | 'oldest'>>;
}

export function Filters({ sortBy, setSortBy }: FiltersProps) {
	return (
		<div className="mb-6 p-4 border rounded-lg">
			<label htmlFor="sort-trigger" className="text-sm font-medium mb-1 block">
				Sort by
				<Select value={sortBy} onValueChange={(value: 'newest' | 'oldest') => setSortBy(value)}>
					<SelectTrigger id="sort-trigger">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="newest">Newest first</SelectItem>
						<SelectItem value="oldest">Oldest first</SelectItem>
						<SelectItem value="a-z">Title A-Z</SelectItem>
						<SelectItem value="z-a">Title Z-A</SelectItem>
					</SelectContent>
				</Select>
			</label>
		</div>
	);
}
