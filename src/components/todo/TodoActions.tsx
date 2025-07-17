import React from 'react';
import type { Todo } from '@/lib/types';

type TodoActionsProps = {
	todo: Todo;
	isEditing: boolean;
	onEdit: () => void;
	onMarkDone: () => void;
	onDelete: () => void;
};

export default function TodoActions({
	                                    todo,
	                                    isEditing,
	                                    onEdit,
	                                    onMarkDone,
	                                    onDelete,
                                    }: TodoActionsProps) {
	return (
		<div className="flex gap-2 items-center">
			{!isEditing && new Date(todo.datetime) >= new Date() && (
				<button
					className="text-sm text-indigo-500 hover:underline"
					onClick={onEdit}
				>
					✏️ Edit
				</button>
			)}

			{todo.is_done ? (
				<span className="text-green-600 text-sm">✅ Done</span>
			) : (
				<button
					className="text-sm text-blue-600 hover:underline"
					onClick={onMarkDone}
				>
					✅ Mark as Done
				</button>
			)}

			<button
				className="text-sm text-red-500 hover:underline"
				onClick={onDelete}
			>
				🗑️ Delete
			</button>
		</div>
	);
}