import type { Profile } from './profile.types';

export const ProjectStatus = {
	Planning: 'planning',
	InProgress: 'in_progress',
	Review: 'review',
	Completed: 'completed',
	OnHold: 'on_hold',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface Project {
	id: string;
	name: string;
	description: string | null;
	dev_environment_url: string | null;
	staging_environment_url: string | null;
	start_date: string | null;
	target_completion_date: string | null;
	status: ProjectStatus;
	created_at: string;
	updated_at: string;
	projectId: string;
	userId: string;
}

export type ProjectMember = {
	userId: string;
	fullName: string;
	username: string;
	role: string;
	projectId: string;
	profiles: Profile;
};

export type ProjectMemberWithProfile = ProjectMember & Profile;
