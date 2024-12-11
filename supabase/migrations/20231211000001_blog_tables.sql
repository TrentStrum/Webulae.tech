-- Create roles enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles if it doesn't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'user';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create blog posts table
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
); 

-- Create indexes
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts (published_at);

-- Set up RLS policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update their own blog posts"
  ON blog_posts FOR UPDATE
  USING (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.id = author_id
    )
  );

-- Add foreign key constraint with the correct name
ALTER TABLE blog_posts
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey,
ADD CONSTRAINT blog_posts_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;