'use client';

import { format } from 'date-fns';
import {
	AlertCircle,
	Settings,
	UserPlus,
	UserMinus,
	Shield,
	Package,
	CreditCard,
} from 'lucide-react';
import { useState } from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/src/components/ui/table';

interface AuditLog {
	id: string;
	event: string;
	description: string;
	actor: string;
	timestamp: Date;
	metadata?: Record<string, unknown>;
}

const eventIcons = {
	'member.invited': UserPlus,
	'member.removed': UserMinus,
	'role.updated': Shield,
	'settings.updated': Settings,
	'plan.changed': Package,
	'billing.updated': CreditCard,
	'security.alert': AlertCircle,
} as const;

export function OrganizationAuditLogs(): JSX.Element {
	const [timeRange, setTimeRange] = useState('7d');
	const [eventType, setEventType] = useState('all');

	// This would be replaced with actual API call to fetch audit logs
	const auditLogs: AuditLog[] = [
		{
			id: '1',
			event: 'member.invited',
			description: 'Invited new team member',
			actor: 'John Doe',
			timestamp: new Date(),
			metadata: {
				email: 'newmember@example.com',
				role: 'member',
			},
		},
		{
			id: '2',
			event: 'settings.updated',
			description: 'Updated organization settings',
			actor: 'Jane Smith',
			timestamp: new Date(Date.now() - 86400000),
			metadata: {
				changes: ['name', 'logo'],
			},
		},
		// Add more sample logs as needed
	];

	const getEventIcon = (event: string): JSX.Element => {
		const Icon = eventIcons[event as keyof typeof eventIcons] || AlertCircle;
		return <Icon className="h-4 w-4" />;
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Audit Logs</h3>
				<p className="text-sm text-muted-foreground">
					View a history of actions taken in your organization.
				</p>
			</div>

			{/* Filters */}
			<div className="flex gap-4">
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select time range" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="24h">Last 24 hours</SelectItem>
						<SelectItem value="7d">Last 7 days</SelectItem>
						<SelectItem value="30d">Last 30 days</SelectItem>
						<SelectItem value="90d">Last 90 days</SelectItem>
					</SelectContent>
				</Select>

				<Select value={eventType} onValueChange={setEventType}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select event type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All events</SelectItem>
						<SelectItem value="member">Member events</SelectItem>
						<SelectItem value="settings">Settings events</SelectItem>
						<SelectItem value="billing">Billing events</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Logs Table */}
			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Event</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Actor</TableHead>
							<TableHead>Timestamp</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{auditLogs.map((log) => (
							<TableRow key={log.id}>
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										{getEventIcon(log.event)}
										{log.event}
									</div>
								</TableCell>
								<TableCell>{log.description}</TableCell>
								<TableCell>{log.actor}</TableCell>
								<TableCell>
									{format(log.timestamp, 'MMM d, yyyy HH:mm')}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
} 