import { supabase } from '@/src/lib/supabase/config';

export type AnalyticsEvent = {
	organizationId: string;
	userId: string;
	eventType: string;
	eventData?: Record<string, unknown>;
	pageUrl?: string;
	sessionId?: string;
};

export type UsageMetric = {
	organizationId: string;
	metricType: string;
	metricValue: number;
	resourceType: string;
	resourceId?: string;
};

interface ApiError {
	message: string;
	status?: number;
	code?: string;
}

export class AnalyticsService {
	static async trackEvent(event: AnalyticsEvent): Promise<void> {
		try {
			const { error } = await supabase.from('analytics_events').insert({
				organization_id: event.organizationId,
				user_id: event.userId,
				event_type: event.eventType,
				event_data: event.eventData,
				page_url: event.pageUrl,
				session_id: event.sessionId,
			});

			if (error) throw this.handleError(error);
		} catch (error) {
			throw this.handleError(error as ApiError);
		}
	}

	private static handleError(error: ApiError): Error {
		console.error('Analytics Service Error:', error);
		return new Error(error.message || 'An unexpected error occurred');
	}

	static async trackUsage(metric: UsageMetric): Promise<void> {
		try {
			const { error } = await supabase.from('usage_metrics').insert({
				organization_id: metric.organizationId,
				metric_type: metric.metricType,
				metric_value: metric.metricValue,
				resource_type: metric.resourceType,
				resource_id: metric.resourceId,
			});

			if (error) throw error;
		} catch (error) {
			console.error('Error tracking usage:', error);
			throw error;
		}
	}

	static async getOrganizationInsights(
		organizationId: string, 
		startDate: Date, 
		endDate: Date
	): Promise<OrganizationInsight[]> {
		try {
			const { data, error } = await supabase
				.from('organization_insights')
				.select('*')
				.eq('organization_id', organizationId)
				.gte('period_start', startDate.toISOString())
				.lte('period_end', endDate.toISOString());

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error fetching insights:', error);
			throw error;
		}
	}

	static async getCustomReports(organizationId: string): Promise<CustomReport[]> {
		try {
			const { data, error } = await supabase
				.from('custom_reports')
				.select('*')
				.eq('organization_id', organizationId);

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error fetching custom reports:', error);
			throw error;
		}
	}
}

interface OrganizationInsight {
	organization_id: string;
	period_start: string;
	period_end: string;
	[key: string]: unknown;
}

interface CustomReport {
	organization_id: string;
	[key: string]: unknown;
}
