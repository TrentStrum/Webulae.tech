export type Article = {
	id: string; // Unique identifier for the article
	title: string; // Title of the article
	slug: string; // URL-friendly identifier for the article
	excerpt: string | null; // Short description or summary of the article
	published_at: string; // ISO 8601 timestamp for when the article was published
	profiles: {
		username: string; // Username of the author
		full_name: string; // Full name of the author
	};
};
