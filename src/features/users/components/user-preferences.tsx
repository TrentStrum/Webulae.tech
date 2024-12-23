import { useUser } from '@clerk/nextjs';

import { FormBuilder } from '@/src/components/forms/form-builder';
import { useUpdatePreferences } from '@/src/hooks/react-query/users';
import { preferencesSchema } from '@/src/schemas/user';

import type { FormField } from '@/src/components/forms/form-builder';
import type { UserPreferences } from '@/src/types/user.types';

const PREFERENCES_FIELDS: FormField[] = [
	{
		name: 'theme' as const,
		label: 'Theme',
		type: 'select' as const,
		options: [
			{ label: 'Light', value: 'light' },
			{ label: 'Dark', value: 'dark' },
			{ label: 'System', value: 'system' },
		],
	},
	{
		name: 'notifications' as const,
		label: 'Notifications',
		type: 'object' as const,
		fields: [
			{ name: 'email' as const, label: 'Email Notifications', type: 'checkbox' as const },
			{ name: 'push' as const, label: 'Push Notifications', type: 'checkbox' as const },
		],
	},
	{
		name: 'dashboard' as const,
		label: 'Dashboard Settings',
		type: 'object' as const,
		fields: [
			{
				name: 'layout' as const,
				label: 'Layout',
				type: 'select' as const,
				options: [
					{ label: 'Grid', value: 'grid' },
					{ label: 'List', value: 'list' },
				],
			},
			{
				name: 'defaultView' as const,
				label: 'Default View',
				type: 'select' as const,
				options: [
					{ label: 'Week', value: 'week' },
					{ label: 'Month', value: 'month' },
					{ label: 'Year', value: 'year' },
				],
			},
		],
	} as const,
];

export function UserPreferences(): JSX.Element {
	const { user } = useUser();
	const { mutateAsync: updatePreferences } = useUpdatePreferences();

	return (
		<FormBuilder
			schema={preferencesSchema}
			fields={PREFERENCES_FIELDS}
			onSubmit={async (data) => {
				await updatePreferences(data);
			}}
			defaultValues={user?.publicMetadata.preferences}
		/>
	);
}
