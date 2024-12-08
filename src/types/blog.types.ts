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
	profiles?: {
		username?: string;
		full_name?: string;
	} | null;
}

export type BlogPostFormData = {
	title: string;
	content: string;
	excerpt?: string;
	slug?: string;
};
