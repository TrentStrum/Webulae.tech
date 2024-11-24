import { BlogFormData } from "../types/blog.types";
import { supabaseClient } from "../lib/supabaseClient";


export const createBlogPost = async (data: BlogFormData) => {
	const { data: session } = await supabaseClient.auth.getSession();
	if (!session) throw new Error('Not authenticated');

	const { error } = await supabaseClient.from('blog_posts').insert([
		{
			...data,
			slug: data.title.toLowerCase().replace(/ /g, '-'),
			author_id: session.session?.user.id || '',
		},
	]);

	if (error) throw error;
};
