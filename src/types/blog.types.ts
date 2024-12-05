export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  published_at: string | null;
  username: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
};

export type BlogPostFormData = {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
};