export interface ProjectDocument {
	id: string;
	name: string;
	category: string;
	file_url: string;
	file_type: string;
	project_id: string;
	uploader_id: string;
	created_at: string;
	profiles?: {
		username: string;
		full_name: string;
	};
}

export type DocumentCategory = 'contracts' | 'documents' | 'invoices' | 'other';
