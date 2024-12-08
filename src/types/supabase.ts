export interface Database {
	public: {
		Tables: {
			project_documents: {
				Row: {
					id: string;
					name: string;
					category: string;
					file_url: string;
					file_type: string;
					project_id: string;
					uploader_id: string;
					created_at: string;
				};
				Insert: {
					name: string;
					category: string;
					file_url: string;
					file_type: string;
					project_id: string;
					uploader_id: string;
				};
				Update: {
					name: string;
					category: string;
					file_url: string;
					file_type: string;
					project_id: string;
					uploader_id: string;
				};
			};
			// ... other tables
		};
	};
}
