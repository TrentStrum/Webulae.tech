export type Document = {
	id: string; // Unique identifier for the document
	name: string; // The name of the document
	file_url: string; // URL to access the uploaded file
	file_type: string; // MIME type of the file (e.g., "application/pdf")
	category: 'contract' | 'scope_change' | 'design' | 'other'; // Enum-like category values
	created_at: string; // Timestamp when the document was created
	uploader_id: string; // ID of the user who uploaded the document
	project_id?: string; // Optional: ID of the project the document belongs to
	profiles?: {
		username?: string | null; // Optional username of the uploader
		full_name?: string | null; // Optional full name of the uploader
	}; // Optional uploader metadata
};
