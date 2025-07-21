import type { Todo } from '@prisma/client';
import { useTodoStore } from '@/lib/store/todoStore';

type TodoEditFormProps = {
	todoId: Todo['id'];
};

export default function TodoEditForm({ todoId }: TodoEditFormProps) {
	const {
		editTitle,
		editDatetime,
		setEditTitle,
		setEditDatetime,
		dispatch,
		resetEditFields,
	} = useTodoStore();

	const onChangeTitle = (val: string) => setEditTitle(val);
	const onChangeDatetime = (val: string) => setEditDatetime(val);

	const onSave = async () => {
		// Save changes to API
		const res = await fetch('/api/todos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: todoId,
				title: editTitle,
				datetime: editDatetime,
			}),
		});
		const updated = await res.json();

		dispatch({ type: 'UPDATE_TODO', payload: updated });
		resetEditFields();
	};

	const onCancel = () => {
		resetEditFields();
	};

	return (
		<div className="flex flex-col gap-2">
			<input
				className="border p-1 rounded"
				value={editTitle}
				onChange={(e) => onChangeTitle(e.target.value)}
			/>
			<input
				type="datetime-local"
				className="border p-1 rounded"
				value={editDatetime}
				onChange={(e) => onChangeDatetime(e.target.value)}
			/>
			<div className="flex gap-2">
				<button className="text-green-600 text-sm" onClick={onSave}>
					💾 Save
				</button>
				<button className="text-gray-500 text-sm" onClick={onCancel}>
					❌ Cancel
				</button>
			</div>
		</div>
	);
}