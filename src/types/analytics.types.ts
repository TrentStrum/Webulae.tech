export interface Metric {
	metric_type: 'api_call' | 'active_users' | 'storage';
	metric_value: number;
	created_at: string;
	organization_id: string;
}

export interface Analytics {
	views: number;
	uniqueVisitors: number;
	averageTime: number;
	bounceRate: number;
	topPages: Array<{
		path: string;
		views: number;
	}>;
	period: {
		start: string;
		end: string;
	};
}

export interface AnalyticsEvent {
	type: string;
	category: string;
	action: string;
	label?: string;
	value?: number;
	metadata?: Record<string, unknown>;
	timestamp: string;
} 