import { FormField } from './form-field';

import type { FormField as FormFieldType } from './types';

interface FormBuilderProps<T extends Record<string, unknown>> {
	fields: FormFieldType[];
	onSubmit: (data: T) => Promise<void>;
	defaultValues?: Partial<T>;
}

export function FormBuilder<T extends Record<string, unknown>>({ fields, onSubmit, defaultValues }: FormBuilderProps<T>): React.ReactNode {
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData) as T;
		await onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit}>
			{fields.map((field) => (
				<FormField
					key={field.name}
					field={field}
					defaultValue={defaultValues?.[field.name]}
				/>
			))}
		</form>
	);
} 