import { supabase } from '@/src/lib/supabase/config';

interface ReportData {
	id: string;
	report_config: Record<string, unknown>;
	last_generated_at: string;
}

export class ReportService {
	static async generateReport(reportId: string, _organizationId: string): Promise<ReportData> {
		try {
			const { data: report } = await supabase
				.from('custom_reports')
				.select('*')
				.eq('id', reportId)
				.single();

			if (!report) throw new Error('Report not found');

			// Execute report query but don't use result since we return original report
			await this.executeReportQuery(report.report_config);

			await supabase
				.from('custom_reports')
				.update({ last_generated_at: new Date().toISOString() })
				.eq('id', reportId);

			return report as ReportData;
		} catch (error) {
			console.error('Error generating report:', error);
			throw error;
		}
	}

	private static async executeReportQuery(config: Record<string, unknown>): Promise<unknown> {
		// Execute the report query based on configuration
		const { data } = await supabase.rpc('generate_custom_report', {
			report_config: config,
		});

		return data;
	}
}
