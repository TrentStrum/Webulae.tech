import type { ModalProps } from '@/src/components/ui/modal-manager';

export function EditForm({ onClose }: ModalProps): JSX.Element {
	return (
		<div>
			<h2>Edit Form</h2>
			<button onClick={onClose}>Close</button>
		</div>
	);
}
