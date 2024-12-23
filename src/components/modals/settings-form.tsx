import type { ModalProps } from '@/src/components/ui/modal-manager';

export function SettingsForm({ onClose }: ModalProps): JSX.Element {
	return (
		<div>
			<h2>Settings</h2>
			<button onClick={onClose}>Close</button>
		</div>
	);
}
