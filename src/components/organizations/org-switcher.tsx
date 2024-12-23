import { useOrganizationList, useOrganization } from '@clerk/nextjs';
import { useState } from 'react';

import { Protected } from '@/src/components/auth/protected';
import { Button } from '@/src/components/ui/button';
import { useModal } from '@/src/components/ui/modal-manager';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/select';

export function OrganizationSwitcher() {
	const { organization } = useOrganization();
	const { userMemberships, setActive } = useOrganizationList();
	const { showModal } = useModal();
	const [isChanging, setIsChanging] = useState(false);

	const handleOrgChange = async (orgId: string) => {
		try {
			setIsChanging(true);
			await setActive?.({ organization: orgId });
		} finally {
			setIsChanging(false);
		}
	};

	return (
		<div className="flex items-center gap-4">
			<Select value={organization?.id} onValueChange={handleOrgChange} disabled={isChanging}>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Select organization" />
				</SelectTrigger>
				<SelectContent>
					{userMemberships.data?.map(({ organization }) => (
						<SelectItem key={organization.id} value={organization.id}>
							{organization.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Protected permission="manage_users">
				<Button variant="outline" onClick={() => showModal('invite')}>
					Invite Members
				</Button>
			</Protected>
		</div>
	);
}
