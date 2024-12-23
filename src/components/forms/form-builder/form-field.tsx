import type { FormField as FormFieldType } from './types';

interface FormFieldProps {
	field: FormFieldType;
	defaultValue?: unknown;
}

export function FormField({ field, defaultValue }: FormFieldProps): React.ReactNode {
	// Render different field types
	switch (field.type) {
		case 'text':
			return <input type="text" name={field.name} defaultValue={defaultValue as string} />;
		// ... other field types
	}
} 