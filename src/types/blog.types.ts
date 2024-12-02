export type BlogPost = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content: string | null;
	published_at: string | null;
	profiles: {
		username: string | null;
		full_name: string | null;
	} | null;
};

// Input type for creating or editing articles
export type BlogPostFormData = {
	title: string;
	author_id: string;
	slug?: string;
	content: string;
	excerpt: string;
};
