export interface BlogResponse {
	data: {
		featured?: BlogPost;
		categories: Record<string, BlogPost[]>;
	};
	nextCursor?: number;
}

export interface BlogPost {
	id: string;
	title: string;
	content: string;
	slug: string;
	image?: string;
	created_at: string;
	updated_at: string;
	author_id: string;
	category: string;
	status: 'draft' | 'published';
	profiles?: {
		full_name?: string;
		username?: string;
	};
}

export type BlogPostFormData = {
	title: string;
	content: string;
	excerpt?: string;
	shortDescription?: string;
	category?: string;
	slug?: string;
};

export type BlogPostWithViews = BlogPost & {
	views: number;
};