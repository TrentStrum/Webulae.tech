export const schema = {
  organizations: {
    id: 'uuid references auth.organizations primary key',
    name: 'text not null',
    slug: 'text not null unique',
    status: `text not null default 'active' check (status in ('active', 'suspended', 'archived'))`,
    settings: 'jsonb not null default \'{}\':jsonb',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()',
  },

  users: {
    id: 'uuid references auth.users primary key',
    organization_id: 'uuid references organizations not null',
    email: 'text not null unique',
    status: `text not null default 'active' check (status in ('active', 'inactive', 'suspended'))`,
    role: `text not null check (role in ('admin', 'developer', 'client'))`,
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()',
  },

  profiles: {
    id: 'uuid references auth.users primary key',
    display_name: 'text',
    avatar_url: 'text',
    bio: 'text',
    social_links: 'jsonb default \'{}\':jsonb',
    updated_at: 'timestamp with time zone default now()',
  },

  user_preferences: {
    user_id: 'uuid references auth.users primary key',
    theme: `text not null default 'system' check (theme in ('light', 'dark', 'system'))`,
    notifications: 'jsonb not null default \'{}\':jsonb',
    dashboard_settings: 'jsonb not null default \'{}\':jsonb',
    updated_at: 'timestamp with time zone default now()',
  },

  projects: {
    id: 'uuid default uuid_generate_v4() primary key',
    organization_id: 'uuid references organizations not null',
    name: 'text not null',
    description: 'text',
    status: `text not null default 'planning' check (status in ('planning', 'in_progress', 'review', 'completed', 'on_hold'))`,
    created_by: 'uuid references auth.users not null',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()',
  },
} as const;

export const triggers = {
  updated_at: `
    create or replace function update_updated_at()
    returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;
  `,
};

export const policies = {
  organizations: {
    select: 'auth.uid() = organization_id',
    insert: 'auth.uid() = created_by',
    update: 'auth.uid() in (select user_id from organization_members where role = \'admin\')',
    delete: 'auth.uid() in (select user_id from organization_members where role = \'admin\')',
  },
}; 