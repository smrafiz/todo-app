import React, { useState, useEffect } from 'react';
import { useTodoStore } from '@/store/todoStore';
import TodoEditForm from './TodoEditForm';
import TodoDisplay from './TodoDisplay';
import TodoActions from './TodoActions';

type TodoItemProps = {
	id: number;
};

export default function TodoItem({ id }: TodoItemProps) {
	const todo = useTodoStore((state) =>
		state.todos.find((t) => t.id === id)
	);
	const dispatch = useTodoStore((state) => state.dispatch);

	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState('');
	const [editDatetime, setEditDatetime] = useState('');

	// Sync edit inputs when todo or editing changes
	useEffect(() => {
		if (todo && isEditing) {
			setEditTitle(todo.title);
			setEditDatetime(todo.datetime.slice(0, 16));
		}
	}, [todo, isEditing]);

	if (!todo) return null;

	const handleSave = async () => {
		const res = await fetch('/api/todos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: todo.id, title: editTitle, datetime: editDatetime }),
		});
		const updatedTodo = await res.json();
		dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
		setIsEditing(false);
	};

	const markDone = async () => {
		const res = await fetch('/api/todos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: todo.id, is_done: 1 }),
		});
		const updatedTodo = await res.json();
		dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
	};

	const remove = async () => {
		await fetch('/api/todos', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: todo.id }),
		});
		dispatch({ type: 'REMOVE_TODO', payload: todo.id });
	};

	return (
		<li className="flex justify-between items-center border-b pb-2">
			{isEditing ? (
				<TodoEditForm
					editTitle={editTitle}
					editDatetime={editDatetime}
					onChangeTitle={setEditTitle}
					onChangeDatetime={setEditDatetime}
					onSave={handleSave}
					onCancel={() => setIsEditing(false)}
				/>
			) : (
				<TodoDisplay todo={todo} />
			)}

			<TodoActions
				todo={todo}
				isEditing={isEditing}
				onEdit={() => setIsEditing(true)}
				onMarkDone={markDone}
				onDelete={remove}
			/>
		</li>
	);
}