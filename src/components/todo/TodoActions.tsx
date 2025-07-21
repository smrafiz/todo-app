import type { Todo } from '@prisma/client';
import { useTodoStore } from '@/lib/store/todoStore';

type Props = {
	todo: Todo;
	isEditing: boolean;
	onEdit: () => void;
};

export default function TodoActions({ todo, isEditing, onEdit }: Props) {
	const {
		dispatch,
		setEditingId,
		setEditTitle,
		setEditDatetime,
		resetEditFields,
	} = useTodoStore();

	const handleMarkDone = async () => {
		const res = await fetch('/api/todos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: todo.id, is_done: true }),
		});
		const updated = await res.json();
		dispatch({ type: 'UPDATE_TODO', payload: updated });

		// If this was being edited, cancel editing after marking as done
		if (isEditing) {
			resetEditFields();
		}
	};

	const handleDelete = async () => {
		await fetch('/api/todos', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: todo.id }),
		});
		dispatch({ type: 'REMOVE_TODO', payload: todo.id });

		// Reset editing state if deleted todo was being edited
		if (isEditing) {
			resetEditFields();
		}
	};

	const handleEdit = () => {
		setEditingId(todo.id);
		setEditTitle(todo.title);
		setEditDatetime(new Date(todo.datetime).toISOString().slice(0, 16));
		onEdit(); // optional callback from parent
	};

	return (
		<div className="flex gap-2 items-center">
			{!isEditing && new Date(todo.datetime) >= new Date() && (
				<button
					className="text-sm text-indigo-500 hover:underline"
					onClick={handleEdit}
				>
					✏️ Edit
				</button>
			)}

			{todo.is_done ? (
				<span className="text-green-600 text-sm">✅ Done</span>
			) : (
				<button
					className="text-sm text-blue-600 hover:underline"
					onClick={handleMarkDone}
				>
					✅ Mark as Done
				</button>
			)}

			<button
				className="text-sm text-red-500 hover:underline"
				onClick={handleDelete}
			>
				🗑️ Delete
			</button>
		</div>
	);
}