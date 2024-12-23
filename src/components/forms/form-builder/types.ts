export type FieldType = 'text' | 'select' | 'array' | 'object' | 'checkbox' | 'color';

export interface BaseFormField {
	name: string;
	label: string;
}

export interface ArrayFormField extends BaseFormField {
	type: 'array';
	arrayFields: FormField[];
}

export interface ObjectFormField extends BaseFormField {
	type: 'object';
	fields: FormField[];
}

export interface SimpleFormField extends BaseFormField {
	type: Exclude<FieldType, 'array' | 'object'>;
	options?: Array<{ label: string; value: string }>;
}

export type FormField = SimpleFormField | ArrayFormField | ObjectFormField; 