import { supabaseClient } from "../lib/supabaseClient";


export const DocumentsDataAccess = {
	async getAll() {
		const { data, error } = await supabaseClient
			.from('project_documents')
			.select(
				`
      *,
      profiles (username, full_name)
    `,
			)
			.order('created_at', { ascending: false });

		if (error) throw new Error(error.message);
		return data;
	},
	async upload({ file, category }: { file: File; category: string }) {
		// Implement upload logic here
	},
};
