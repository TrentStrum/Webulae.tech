-- Add new columns to blog_posts table
alter table blog_posts
add column if not exists short_description text,
add column if not exists category text;

-- Create index for category to improve query performance
create index if not exists blog_posts_category_idx on blog_posts(category);

-- Update existing posts with default categories (optional)
update blog_posts
set category = 'General'
where category is null; 