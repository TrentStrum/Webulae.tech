import { BaseDataAccess } from '../baseDataAccess';

import type { TypedSupabaseClient } from '@/src/lib/supabase/client';
import type { Organization } from '@/src/types/organization.types';
import type { User } from '@/src/types/user.types';

export class OrganizationDataAccess extends BaseDataAccess<Organization> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'organizations');
  }

  async getBySlug(slug: string): Promise<Organization> {
    return this.execute(() =>
      this.client
        .from(this.table)
        .select('*, settings(*)')
        .eq('slug', slug)
        .single()
    );
  }

  async updateSettings(
    id: string,
    settings: Partial<Organization['settings']>
  ): Promise<Organization> {
    return this.execute(() =>
      this.client
        .from(this.table)
        .update({ settings })
        .eq('id', id)
        .select('*, settings(*)')
        .single()
    );
  }

  async getMembers(id: string): Promise<Array<User & { role: string }>> {
    return this.execute(() =>
      this.client
        .from('users')
        .select('*, profiles(*)')
        .eq('organization_id', id)
    );
  }
} 