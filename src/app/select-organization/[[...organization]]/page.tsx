import { OrganizationList } from '@clerk/nextjs';

export default function SelectOrganizationPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<OrganizationList
				afterCreateOrganizationUrl="/dashboard"
				afterSelectOrganizationUrl="/dashboard"
			/>
		</div>
	);
}
