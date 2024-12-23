import { DataAccessError } from '@/src/types/result.types';

import type { TypedSupabaseClient } from '@/src/lib/supabase/client';
import type { PostgrestError } from '@supabase/postgrest-js';

export abstract class BaseDataAccess<T, CreateDTO = Omit<T, 'id' | 'createdAt' | 'updatedAt'>> {
  constructor(
    protected readonly client: TypedSupabaseClient,
    protected readonly table: string
  ) {}

  protected async execute<R>(
    operation: () => Promise<{ data: R | null; error: PostgrestError | null }>
  ): Promise<{ ok: true; data: R } | { ok: false; error: DataAccessError }> {
    try {
      const { data, error } = await operation();
      
      if (error) {
        return {
          ok: false,
          error: new DataAccessError(
            error.message,
            error.code,
            error.details ? 400 : 500,
            error
          ),
        };
      }

      if (!data) {
        return {
          ok: false,
          error: new DataAccessError('Not found', 'NOT_FOUND', 404),
        };
      }

      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        error: new DataAccessError(
          'Database operation failed',
          'INTERNAL_ERROR',
          500,
          error
        ),
      };
    }
  }

  async getById(id: string): Promise<{ ok: true; data: T } | { ok: false; error: DataAccessError }> {
    return this.execute(async () =>
      await this.client
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  async create(data: CreateDTO): Promise<{ ok: true; data: T } | { ok: false; error: DataAccessError }> {
    return this.execute(async () =>
      await this.client
        .from(this.table)
        .insert([data])
        .select()
        .single()
    );
  }

  async update(id: string, data: Partial<CreateDTO>): Promise<{ ok: true; data: T } | { ok: false; error: DataAccessError }> {
    return this.execute(async () =>
      await this.client
        .from(this.table)
        .update(data)
        .eq('id', id)
        .select()
        .single()
    );
  }

  async delete(id: string): Promise<{ ok: true; data: boolean } | { ok: false; error: DataAccessError }> {
    const result = await this.execute(async () =>
      await this.client
        .from(this.table)
        .delete()
        .eq('id', id)
    );

    return result.ok
      ? { ok: true, data: true }
      : { ok: false, error: result.error };
  }
} 