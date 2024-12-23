export const OrganizationStatus = {
	Active: 'active',
	Suspended: 'suspended',
	Archived: 'archived',
} as const;

export type OrganizationStatus = typeof OrganizationStatus[keyof typeof OrganizationStatus];

export interface Organization {
	id: string;
	name: string;
	slug: string;
	status: OrganizationStatus;
	settings: OrganizationSettings;
	createdAt: string;
	updatedAt: string;
}

export interface OrganizationSettings {
	name: string;
	settings: {
		timezone: string;
		features: Array<{ name: string; enabled: boolean }>;
		theme: {
			primary: string;
			logo: string;
		};
	};
}

export interface AddMemberData {
	email: string;
	role: string;
	name?: string;
} 