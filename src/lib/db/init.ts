import { createClient } from '@supabase/supabase-js';

import { DataAccessFactory } from '@/src/dataAccess/dataAccessFactory';

import { schema, triggers, policies } from './schema';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function initializeDatabase(): Promise<void> {
  // Initialize data access layer
  DataAccessFactory.initialize(supabase);

  // Apply schema if in development
  if (process.env.NODE_ENV === 'development') {
    // Create tables
    for (const [table, definition] of Object.entries(schema)) {
      const columns = Object.entries(definition)
        .map(([name, type]) => `${name} ${type}`)
        .join(',\n  ');

      await supabase
        .from(table)
        .select()
        .then(async () => {
          await supabase.rpc('create_table', {
            table_name: table,
            table_definition: columns
          });
        });
    }

    // Create triggers
    for (const [name, definition] of Object.entries(triggers)) {
      await supabase.rpc('create_trigger', {
        trigger_name: name,
        trigger_definition: definition
      });
    }

    // Apply RLS policies
    for (const [table, tablePolicy] of Object.entries(policies)) {
      for (const [operation, policy] of Object.entries(tablePolicy)) {
        await supabase.rpc('create_policy', {
          policy_name: `${table}_${operation}`,
          policy_definition: policy
        });
      }
    }
  }
} 