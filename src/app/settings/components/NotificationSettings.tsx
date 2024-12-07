import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';

interface NotificationSettingProps {
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

export function NotificationSetting({
	label,
	description,
	checked,
	onCheckedChange,
}: NotificationSettingProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="space-y-0.5">
				<Label>{label}</Label>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			<Switch checked={checked} onCheckedChange={onCheckedChange} />
		</div>
	);
}
