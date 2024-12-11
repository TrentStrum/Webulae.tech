-- Insert test admin user if not exists
INSERT INTO profiles (id, username, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin', 'Admin User', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert test blog posts
INSERT INTO blog_posts (
  author_id,
  title,
  slug,
  content,
  excerpt,
  published_at
)
VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    'First Blog Post',
    'first-blog-post',
    'This is the content of our first blog post.',
    'A brief excerpt of the first post',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'Second Blog Post',
    'second-blog-post',
    'Content for our second blog post.',
    'A brief excerpt of the second post',
    now()
  )
ON CONFLICT (slug) DO NOTHING; 