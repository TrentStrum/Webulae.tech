export type Feedback = {
	id: string;
	content: string;
	rating: number;
	is_public: boolean;
	created_at: string;
	user_id: string;
	profiles?: {
		username: string;
		full_name: string;
	};
};
