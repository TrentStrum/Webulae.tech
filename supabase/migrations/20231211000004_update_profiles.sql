-- Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS username text,
ADD COLUMN IF NOT EXISTS full_name text;

-- Update existing admin user with username and full_name
UPDATE profiles 
SET 
  username = 'admin',
  full_name = 'Admin User'
WHERE role = 'admin';

-- Add unique constraint to username
ALTER TABLE profiles
ADD CONSTRAINT profiles_username_key UNIQUE (username); 