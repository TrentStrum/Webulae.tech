import type { Profile } from './profile.types';

export type Project = {
	dev_environment_url: string | null;
	staging_environment_url: string | null;
	projectId: string;
	userId: string;
	name: string;
	description: string | null;
	status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
	start_date: string | null;
	target_completion_date: string | null;
	created_at: string;
	updated_at: string;
};

export type ProjectMember = {
	userId: string;
	fullName: string;
	username: string;
	role: string;
	projectId: string;
	profiles: Profile;
};

export type ProjectMemberWithProfile = ProjectMember & Profile;
