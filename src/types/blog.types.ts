export type BlogPost = {
  id: string;
  title: string;
  content: string;
  content_format: string | null;
  excerpt: string | null;
  metadata: Json;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  slug: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
};

export type BlogPostFormData = {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
};