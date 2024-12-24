'use client';

import { OrganizationList } from '@clerk/nextjs';

export default function OrganizationSelectPage(): JSX.Element {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Select Organization</h1>
			<OrganizationList 
				hidePersonal
				afterSelectOrganizationUrl="/admin/dashboard"
				afterCreateOrganizationUrl="/admin/dashboard"
			/>
		</div>
	);
}
