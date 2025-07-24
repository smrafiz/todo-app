import Modal from "@/components/ui/modal";
import ProjectForm from "@/components/project/ProjectForm";
import { Project } from "@prisma/client";

export default function CreateProjectModal({isOpen, onClose, project}: {
	isOpen: boolean;
	onClose: () => void;
	project?: Project | null;
}) {
	const title = project ? "Edit Project" : "Create New Project";

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<ProjectForm project={project} onSuccess={onClose} />
		</Modal>
	);
}