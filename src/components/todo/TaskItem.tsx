import { FC } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Todo, Project } from '@prisma/client';
import { useTodoStore } from '@/lib/store/todoStore';
import { CheckCircle, Circle, Clock, Trash2 } from 'lucide-react';

interface TodoWithProject extends Todo {
	project?: Project;
}

interface Props {
	todo: TodoWithProject;
}

const TaskItem: FC<Props> = ({ todo }) => {
	const { toggleTodo, removeTodo } = useTodoStore();

	const dueDateLabel = todo.dueDate
		? format(new Date(todo.dueDate), 'PPP')
		: 'No Due Date';

	return (
		<Card className="p-4 flex items-center justify-between group transition-shadow">
			<div className="flex items-start gap-3">
				<button
					onClick={() => toggleTodo(todo.id)}
					className="text-muted-foreground hover:text-primary mt-1"
				>
					{todo.completed ? (
						<CheckCircle className="w-5 h-5 text-green-600" />
					) : (
						<Circle className="w-5 h-5" />
					)}
				</button>

				<div>
					<p
						className={cn(
							'text-sm font-medium',
							todo.completed && 'line-through text-muted-foreground'
						)}
					>
						{todo.title}
					</p>

					<div className="text-xs text-gray-500 flex items-center gap-1 mt-1 flex-wrap">
						<Clock className="w-3 h-3" />
						<span>{dueDateLabel}</span>

						{todo.project && (
							<>
								<span className="mx-1">•</span>
								<span className="italic text-xs flex items-center gap-1">
									<span
										className="inline-block w-2 h-2 rounded-full"
										style={{ backgroundColor: todo.project.color }}
									/>
									{todo.project.name}
								</span>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="opacity-0 group-hover:opacity-100 transition">
				<Button variant="ghost" size="sm" onClick={() => removeTodo(todo.id)}>
					<Trash2 className="w-4 h-4 text-destructive" />
				</Button>
			</div>
		</Card>
	);
};

export default TaskItem;