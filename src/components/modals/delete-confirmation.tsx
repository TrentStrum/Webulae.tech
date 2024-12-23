import type { ModalProps } from '@/src/components/ui/modal-manager';

export function DeleteConfirmation({ onClose }: ModalProps): JSX.Element {
	return (
		<div>
			<h2>Confirm Delete</h2>
			<button onClick={onClose}>Cancel</button>
			<button onClick={onClose}>Delete</button>
		</div>
	);
}
