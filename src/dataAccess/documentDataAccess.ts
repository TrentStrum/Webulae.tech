import { supabaseClient } from '../lib/supabaseClient';

interface ProjectDocument {
	id: string;
	name: string;
	category: string;
	file_url: string;
	file_type: string;
	project_id: string;
	uploader_id: string;
	created_at: string;
	profiles?: { username: string; full_name: string };
}

export const DocumentsDataAccess = {
	async getAll(): Promise<ProjectDocument[]> {
		const { data, error } = await supabaseClient
			.from('project_documents')
			.select('*, profiles(username, full_name)')
			.order('created_at', { ascending: false })
			.returns<ProjectDocument[]>();

		if (error) throw new Error(error.message);
		return data ?? [];
	},
	async upload({ file, category }: { file: File; category: string }): Promise<ProjectDocument> {
		const fileExt = file.name.split('.').pop();
		const fileName = `${Math.random()}.${fileExt}`;
		const filePath = `${category}/${fileName}`;

		const { error: uploadError } = await supabaseClient.storage
			.from('documents')
			.upload(filePath, file);

		if (uploadError) throw new Error(uploadError.message);

		// 2. Create database record
		const { data, error: insertError } = await supabaseClient
			.from('project_documents')
			.insert({
				name: file.name,
				category,
				file_url: filePath,
				file_type: file.type,
				project_id: '1',
				uploader_id: '1',
			})
			.select()
			.single();

		if (insertError) throw new Error(insertError.message);
		return data;
	},
};
