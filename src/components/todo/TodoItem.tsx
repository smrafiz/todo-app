import TodoDisplay from './TodoDisplay';
import TodoActions from './TodoActions';
import TodoEditForm from './TodoEditForm';
import type { Todo } from '@prisma/client';
import { useTodoStore } from '@/lib/store/todoStore';

type Props = {
	todo: Todo;
};

export default function TodoItem({ todo }: Props) {
	const {
		editingId,
		setEditingId,
		setEditTitle,
		setEditDatetime,
	} = useTodoStore();

	const isEditing = editingId === todo.id;

	const handleEdit = () => {
		setEditingId(todo.id);
		setEditTitle(todo.title);
		setEditDatetime(new Date(todo.datetime).toISOString().slice(0, 16));
	};

	return (
		<li className="flex justify-between items-center border-b pb-2">
			{isEditing && !todo.is_done ? (
				<TodoEditForm todoId={todo.id} />
			) : (
				<TodoDisplay todo={todo} />
			)}

			{!todo.is_done && (
				<TodoActions todo={todo} isEditing={isEditing} onEdit={handleEdit} />
			)}
		</li>
	);
}