import { DataAccessInterface } from '@/src/contracts/DataAccess';
import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/types/database.types';
import { NextResponse } from 'next/server';

type ProjectTimeline = Database['public']['Tables']['project_timeline']['Row'];

const timelineDataAccess: DataAccessInterface<ProjectTimeline> = {
	// Fetch by key (generalized method for single or multiple rows)
	async getByKey(
		key: string,
		value: string,
		single = true,
	): Promise<ProjectTimeline | ProjectTimeline[] | null> {
		const query = supabase.from('project_timeline').select('*').eq(key, value);

		try {
			if (single) {
				const { data, error } = await query.single();
				if (error) throw new Error(`Error fetching by key ${key}: ${error.message}`);
				return data;
			}

			const { data, error } = await query;
			if (error) throw new Error(`Error fetching by key ${key}: ${error.message}`);
			return data;
		} catch (error) {
			console.error('getByKey error:', error);
			throw error;
		}
	},

	// Create a new timeline entry
	async create(data: Partial<ProjectTimeline>): Promise<ProjectTimeline | null> {
		try {
			const { data: newTimeline, error } = await supabase
				.from('project_timeline')
				.insert(data as ProjectTimeline)
				.single();

			if (error) throw new Error(`Error creating timeline: ${error.message}`);
			return newTimeline;
		} catch (error) {
			console.error('create error:', error);
			throw error;
		}
	},

	// Update an existing timeline entry
	async update(id: string, data: Partial<ProjectTimeline>): Promise<ProjectTimeline | null> {
		try {
			const { data: updatedTimeline, error } = await supabase
				.from('project_timeline')
				.update(data)
				.eq('id', id)
				.single();

			if (error) throw new Error(`Error updating timeline with ID ${id}: ${error.message}`);
			return updatedTimeline;
		} catch (error) {
			console.error('update error:', error);
			throw error;
		}
	},

	// Delete a timeline entry
	async delete(id: string): Promise<void> {
		try {
			const { error } = await supabase.from('project_timeline').delete().eq('id', id);
			if (error) throw new Error(`Error deleting timeline with ID ${id}: ${error.message}`);
		} catch (error) {
			console.error('delete error:', error);
			throw error;
		}
	},
};

// Helper function to check if an error has a message
function isErrorWithMessage(error: unknown): error is { message: string } {
	return typeof error === 'object' && error !== null && 'message' in error;
}
