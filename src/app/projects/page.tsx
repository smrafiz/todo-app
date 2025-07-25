import {getProjects} from "@/actions/project.action";
import {ActionListResponse, Project} from "@/types";
import Title from "@/app/projects/Title";

export default async function ProjectsPage() {
	const res: ActionListResponse  = await getProjects();
	console.log({res})

	if(res.error) return <div>Error</div>;

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{res.data?.items && Array.isArray(res.data.items) && res.data.items.map((project: Project) => <Title key={project.id} project={project} />)}
				</div>
			</main>
		</div>
	);
}