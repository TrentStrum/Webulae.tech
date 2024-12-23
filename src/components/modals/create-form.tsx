import type { ModalProps } from '@/src/components/ui/modal-manager';

export function CreateForm({ onClose }: ModalProps): JSX.Element {
	return (
		<div>
			<h2>Create Form</h2>
			<button onClick={onClose}>Close</button>
		</div>
	);
}
