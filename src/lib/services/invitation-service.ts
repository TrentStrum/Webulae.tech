import { nanoid } from 'nanoid';

import { supabase } from '@/src/lib/supabase/config';

import type { Database } from '@/src/types/database.types';

type Invitation = Database['public']['Tables']['invitations']['Row'];

export class InvitationService {
	static async createInvitation(organizationId: string, email: string, role: 'client' = 'client'): Promise<Invitation> {
		const token = nanoid(32);
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

		const { data, error } = await supabase
			.from('invitations')
			.insert({
				organization_id: organizationId,
				email,
				token,
				role,
				expires_at: expiresAt.toISOString(),
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	static async verifyInvitation(token: string): Promise<Invitation & { organizations: Database['public']['Tables']['organizations']['Row'] }> {
		const { data, error } = await supabase
			.from('invitations')
			.select('*, organizations(*)')
			.eq('token', token)
			.is('used_at', null)
			.single();

		if (error) throw error;
		if (!data) throw new Error('Invalid or expired invitation');

		if (new Date(data.expires_at) < new Date()) {
			throw new Error('Invitation has expired');
		}

		return data;
	}

	static async markInvitationAsUsed(token: string): Promise<void> {
		const { error } = await supabase
			.from('invitations')
			.update({ used_at: new Date().toISOString() })
			.eq('token', token);

		if (error) throw error;
	}
}
