'use client';

import { useState, useCallback } from 'react';

import { useLoadingState } from '../helpers/use-loading-state';

export function useFormState<T extends Record<string, unknown>>(
	initialData: T
): {
	data: T;
	isDirty: boolean;
	isSubmitting: boolean;
	error: Error | null;
	handleChange: (field: keyof T, value: unknown) => void;
	resetForm: () => void;
	startSubmitting: () => void;
	stopSubmitting: () => void;
	setError: (error: Error | null) => void;
} {
	const [data, setData] = useState<T>(initialData);
	const [isDirty, setIsDirty] = useState(false);
	const { isLoading: isSubmitting, error, startLoading, stopLoading, setError } = useLoadingState();

	const handleChange = useCallback(
		(field: keyof T, value: unknown) => {
			setData((prev) => {
				const newData = { ...prev, [field]: value };
				setIsDirty(JSON.stringify(newData) !== JSON.stringify(initialData));
				return newData;
			});
		},
		[initialData]
	);

	const resetForm = useCallback(() => {
		setData(initialData);
		setIsDirty(false);
		setError(null);
	}, [initialData, setError]);

	return {
		data,
		isDirty,
		isSubmitting,
		error,
		handleChange,
		resetForm,
		startSubmitting: startLoading,
		stopSubmitting: stopLoading,
		setError,
	};
}
