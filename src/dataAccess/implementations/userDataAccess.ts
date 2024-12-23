import { BaseDataAccess } from '../baseDataAccess';

import type { TypedSupabaseClient } from '@/src/lib/supabase/client';
import type { User, UserPreferences } from '@/src/types/user.types';

export class UserDataAccess extends BaseDataAccess<User> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'users');
  }

  async getByEmail(email: string): Promise<User> {
    return this.execute(() =>
      this.client
        .from(this.table)
        .select('*, profile:profiles(*), preferences:user_preferences(*)')
        .eq('email', email)
        .single()
    );
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<User> {
    return this.execute(() =>
      this.client
        .from('user_preferences')
        .upsert({ user_id: userId, ...preferences })
        .select('user:users(*, profile:profiles(*), preferences:user_preferences(*))')
        .single()
    );
  }

  async updateProfile(
    userId: string,
    profile: Partial<User['profile']>
  ): Promise<User> {
    return this.execute(() =>
      this.client
        .from('profiles')
        .upsert({ id: userId, ...profile })
        .select('user:users(*, profile:profiles(*), preferences:user_preferences(*))')
        .single()
    );
  }
} 