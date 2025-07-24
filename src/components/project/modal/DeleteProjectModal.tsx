import Modal from "@/components/ui/modal";
import {Button} from "@/components/ui/button";

export default function DeleteProjectModal({isOpen, onClose, onConfirm, isDeleting = false}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isDeleting?: boolean;
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
			<div className="space-y-4">
				<p className="text-gray-600">Are you sure you want to delete this project?</p>
				<div className="flex justify-end gap-3">
					<Button variant="secondary" onClick={onClose} disabled={isDeleting}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</Button>
				</div>
			</div>
		</Modal>
	);
}