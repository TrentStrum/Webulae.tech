export type TimelineEvent = {
	id: string;
	project_id: string;
	title: string;
	description: string;
	status: 'planned' | 'in_progress' | 'completed' | 'delayed';
	start_date: string;
	end_date: string;
};
