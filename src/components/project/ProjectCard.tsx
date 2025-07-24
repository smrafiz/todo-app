import Link from "next/link";
import {Project} from "@prisma/client";
import {Card} from "@/components/ui/card";
import {Pencil, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function ProjectCard({project, getProjectStats, onEdit, onDelete, disableActions = false}: {
	project: Project;
	getProjectStats: (projectId: string) => { total: number; completed: number; percent: number };
	onEdit: () => void;
	onDelete: () => void;
	disableActions?: boolean;
}) {
	const {total, completed, percent} = getProjectStats(project.id);

	return (
		<Card className="hover:shadow-md transition-shadow p-6 border border-gray-200">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="w-4 h-4 rounded-full" style={{backgroundColor: project.color}}/>
					<h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
				</div>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="sm" onClick={onEdit} disabled={disableActions}>
						<Pencil/>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:text-red-300 disabled:hover:bg-transparent"
						onClick={onDelete}
						disabled={disableActions}
					>
						<Trash2 className="w-4 h-4"/>
					</Button>
				</div>
			</div>

			<p className="text-gray-600 text-sm mb-4">{project.description}</p>

			<div className="space-y-3">
				<div className="flex justify-between text-sm text-gray-500">
					<span>Tasks</span>
					<span className="font-medium">
            {completed}/{total}
          </span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="h-2 rounded-full"
						style={{
							width: `${percent}%`,
							backgroundColor: project.color,
						}}
					/>
				</div>
				<div className="flex justify-between text-xs text-gray-500">
					<span>{percent}% Complete</span>
					<Link href={`/tasks?project=${project.id}`} className="text-blue-600 hover:underline">
						View Tasks
					</Link>
				</div>
			</div>
		</Card>
	);
}