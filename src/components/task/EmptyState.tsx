import Link from "next/link";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ListChecks} from "lucide-react";

export default function EmptyState({searchTerm}: { searchTerm: string }) {
	return (
		<Card>
			<div className="text-center py-12">
				<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<ListChecks className="w-6 h-6 text-gray-400"/>
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
				<p className="text-gray-500 mb-4">
					{searchTerm ? 'Try adjusting your search or filters' : 'Get started by creating your first task'}
				</p>
				<Link href="/tasks/new">
					<Button>Create Task</Button>
				</Link>
			</div>
		</Card>
	);
}