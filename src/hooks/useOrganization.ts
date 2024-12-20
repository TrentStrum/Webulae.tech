import { useOrganization as useClerkOrganization } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/src/lib/supabase/config';

import type { Database } from '@/src/types/database.types';

interface OrganizationHookReturn {
	organization: Database['public']['Tables']['organizations']['Row'] | null;
	isLoading: boolean;
}

export function useOrganization(): OrganizationHookReturn {
	const { organization, isLoaded: isClerkOrgLoaded } = useClerkOrganization();

	const { data: orgData, isLoading } = useQuery({
		queryKey: ['organization', organization?.id],
		queryFn: async () => {
			if (!organization?.id) return null;

			const { data, error } = await supabase
				.from('organizations')
				.select('*')
				.eq('clerk_org_id', organization.id)
				.single();

			if (error) throw error;
			return data;
		},
		enabled: !!organization?.id && isClerkOrgLoaded,
	});

	return {
		organization: orgData,
		isLoading: isLoading || !isClerkOrgLoaded,
	};
}
