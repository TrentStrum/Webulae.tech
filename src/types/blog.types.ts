export interface BlogPost {
	id: string;
	title: string;
	content: string;
	author_id: string;
	slug: string;
	created_at: string;
	updated_at: string;
	published_at?: string;
	excerpt?: string;
	shortDescription?: string;
	profiles?: {
		username?: string;
		full_name?: string;
	} | null;
	category?: string;
	coverImage?: string;
	author?: {
		id: string;
		username?: string;
		full_name?: string;
		role: string;
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
