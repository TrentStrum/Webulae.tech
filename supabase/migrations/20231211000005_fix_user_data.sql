-- Update the existing user with the correct user_id
UPDATE blog_posts
SET user_id = author_id
WHERE user_id IS NULL;

-- Drop existing constraint if it exists
ALTER TABLE blog_posts
DROP CONSTRAINT IF EXISTS blog_posts_user_id_fkey;

-- Add not null constraint and foreign key
DO $$ BEGIN
  ALTER TABLE blog_posts ALTER COLUMN user_id SET NOT NULL;
EXCEPTION
  WHEN others THEN null;
END $$;

ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Update profiles to ensure they match auth.users
UPDATE profiles p
SET id = b.user_id
FROM blog_posts b
WHERE p.id = b.author_id; 