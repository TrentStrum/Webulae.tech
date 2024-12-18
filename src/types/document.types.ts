export interface Document {
	id: string;
	name: string;
	url: string;
	project_id: string;
	created_at: string;
	updated_at: string;
	uploaded_by: {
		full_name: string;
		username: string;
	};
}
