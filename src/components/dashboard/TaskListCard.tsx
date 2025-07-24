import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {format} from "date-fns";
import {Todo} from "@prisma/client";

type Props = {
	title: string;
	todos: Todo[];
	link: string;
	linkLabel: string;
};

export default function TaskListCard({title, todos, link, linkLabel}: Props) {
	return (
		<Card title={title}>
			{todos.length === 0 ? (
				<p className="text-gray-500 text-center py-8">No tasks</p>
			) : (
				<div className="space-y-3">
					{todos.slice(0, 5).map((todo) => (
						<div
							key={todo.id}
							className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
						>
							<div>
								<p className="text-gray-900 font-medium">{todo.title}</p>
								{todo.dueDate && (
									<p className="text-sm text-gray-500">
										Due: {format(new Date(todo.dueDate), "MMM d, yyyy")}
									</p>
								)}
							</div>
							<div className="flex items-center gap-2">
								{todo.tags?.split(",").map((tag) => (
									<span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
										{tag.trim()}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			)}
			<div className="mt-4">
				<Link href={link}>
					<Button size="sm" variant="ghost" className="w-full">
						{linkLabel}
					</Button>
				</Link>
			</div>
		</Card>
	);
}