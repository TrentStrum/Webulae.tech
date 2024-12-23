import type { ModalProps } from '@/src/components/ui/modal-manager';

export function InviteMembers({ onClose }: ModalProps): JSX.Element {
	return (
		<div>
			<h2>Invite Members</h2>
			<button onClick={onClose}>Close</button>
		</div>
	);
}
