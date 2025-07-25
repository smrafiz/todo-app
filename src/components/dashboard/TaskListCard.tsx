import React from "react";
import {format} from "date-fns";
import {Todo} from "@prisma/client";
import {Card} from "@/components/ui/card";
import IconCircleButton from "@/components/dashboard/IconCircleButton";

type Props = {
	title: string;
	todos: Todo[];
	link: string;
	linkLabel: string;
	icon?: React.ReactNode;
};

export default function TaskListCard({title, todos, link, linkLabel, icon}: Props) {
	return (
		<Card className="relative border border-gray-200 p-6 max-h-[600px] overflow-y-auto">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
			{todos.length === 0 ? (
				<p className="text-gray-500 text-center py-8">No tasks</p>
			) : (
				<div className="space-y-3 pb-20">
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

			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
				<IconCircleButton link={link} linkLabel={linkLabel} icon={icon} />
			</div>
		</Card>
	);
}