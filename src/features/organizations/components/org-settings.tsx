import { useOrganization } from '@clerk/nextjs';

import { FormBuilder } from '@/src/components/forms/form-builder/form-builder';
import { useUpdateOrganization } from '@/src/hooks/react-query/organizations';

import type { FormField, ArrayFormField } from '@/src/components/forms/form-builder/types';
import type { OrganizationSettings } from '@/src/types/organization.types';

type OrganizationSettingsData = {
	name: string;
	settings: {
		timezone: string;
		features: Array<{ name: string; enabled: boolean }>;
		theme: {
			primary: string;
			logo: string;
		};
	};
};

const SETTINGS_FIELDS: FormField[] = [
	{
		name: 'name',
		label: 'Organization Name',
		type: 'text',
	},
	{
		name: 'settings.timezone',
		label: 'Timezone',
		type: 'select',
		options: [
			{ label: 'UTC', value: 'UTC' },
			{ label: 'EST', value: 'America/New_York' },
			{ label: 'PST', value: 'America/Los_Angeles' },
		],
	},
	{
		name: 'settings.features',
		label: 'Features',
		type: 'array',
		arrayFields: [
			{ name: 'name', label: 'Feature Name', type: 'text' },
			{ name: 'enabled', label: 'Enabled', type: 'checkbox' },
		],
	} as ArrayFormField,
	{
		name: 'settings.theme',
		label: 'Theme Settings',
		type: 'object',
		fields: [
			{ name: 'primary', label: 'Primary Color', type: 'color' },
			{ name: 'logo', label: 'Logo URL', type: 'text' },
		],
	},
];

export function OrganizationSettings(): JSX.Element | null {
	const { organization, isLoaded } = useOrganization();
	const updateSettings = useUpdateOrganization();

	const handleSubmit = async (data: OrganizationSettings): Promise<void> => {
		await updateSettings.mutateAsync(data);
	};

	if (!isLoaded || !organization) return null;

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Organization Settings</h2>

			<FormBuilder<OrganizationSettingsData>
				defaultValues={organization}
				onSubmit={handleSubmit}
				fields={SETTINGS_FIELDS}
			/>
		</div>
	);
}
