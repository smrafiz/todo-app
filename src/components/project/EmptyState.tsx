import {Card} from "@/components/ui/card";
import {Folder} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function EmptyState({onCreate}: { onCreate: () => void }) {
	return (
		<Card>
			<div className="text-center py-12">
				<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Folder className="text-2xl text-gray-400"/>
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
				<p className="text-gray-500 mb-4">Create your first project to organize your tasks better</p>
				<Button onClick={onCreate}>Create Project</Button>
			</div>
		</Card>
	);
}