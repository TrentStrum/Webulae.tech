-- Create profiles table with updated constraints
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- Create indexes for better query performance
create index profiles_username_idx on profiles (username);
create index profiles_id_idx on profiles (id);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create function to handle username uniqueness
create or replace function handle_username_collision()
returns trigger as $$
declare
  base_username text;
  new_username text;
  counter integer := 1;
begin
  if new.username is null then
    return new;
  end if;

  base_username := new.username;
  new_username := base_username;

  while exists(select 1 from profiles where username = new_username and id != new.id) loop
    new_username := base_username || counter;
    counter := counter + 1;
  end loop;

  new.username := new_username;
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically handle username collisions
create trigger handle_username_collision_trigger
  before insert or update on profiles
  for each row
  execute function handle_username_collision();