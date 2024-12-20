import { createClient } from '@supabase/supabase-js';

import type { ClerkUser, ClerkOrganization } from '@/src/types/clerk.types';
import type { Database } from '@/src/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function syncUserToDatabase(clerkUser: ClerkUser): Promise<Database['public']['Tables']['users']['Row']> {
	const { data, error } = await supabase
		.from('users')
		.upsert({
			clerk_id: clerkUser.id,
			clerk_org_id: clerkUser.organizationId,
			email: clerkUser.emailAddresses[0].emailAddress,
			full_name: `${clerkUser.firstName} ${clerkUser.lastName}`,
			role: 'professional',
		})
		.select()
		.single();

	if (error) {
		console.error('Error syncing user:', error);
		throw error;
	}

	return data;
}

export async function syncOrganizationToDatabase(clerkOrg: ClerkOrganization): Promise<Database['public']['Tables']['organizations']['Row']> {
	const { data, error } = await supabase
		.from('organizations')
		.upsert({
			clerk_org_id: clerkOrg.id,
			name: clerkOrg.name,
		})
		.select()
		.single();

	if (error) {
		console.error('Error syncing organization:', error);
		throw error;
	}

	return data;
}
