// Full BlogPost type with all fields
export type BlogPost = {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string | null;
	author_id: string;
	created_at: string;
	updated_at: string;
	published_at?: string | null;
};

// Input type for creating or editing blog posts
export type BlogFormData = {
	title: string;
	slug?: string;
	content: string;
	excerpt: string;
};
