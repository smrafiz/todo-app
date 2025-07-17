import React, {useState} from 'react';
import {useTodoStore} from '@/store/todoStore';
import {getLocalDateTimeString} from '@/utils/helpers';

export default function AddTodoForm() {
	const dispatch = useTodoStore(state => state.dispatch);

	const [title, setTitle] = useState('');
	const [datetime, setDatetime] = useState(getLocalDateTimeString);

	const handleAdd = async () => {
		if (!title || !datetime) {
			return alert('Please enter a title and date');
		}

		const newTodo = {
			id: Date.now(),
			title,
			datetime,
			is_done: 0,
		};

		const res = await fetch('/api/todos', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(newTodo),
		});

		if (!res.ok) {
			alert('Failed to add todo');
			return;
		}

		const savedTodo = await res.json();

		dispatch({type: 'ADD_TODO', payload: savedTodo});

		// Reset inputs
		setTitle('');
		setDatetime(getLocalDateTimeString);
	};

	return (
		<div className="text-center max-w-2xl mx-auto bg-white rounded shadow p-4 mb-4">
			<input
				type="text"
				placeholder="Todo title"
				className="border p-2 rounded w-full mb-2"
				value={title}
				onChange={e => setTitle(e.target.value)}
			/>
			<input
				type="datetime-local"
				className="border p-2 rounded w-full mb-2"
				value={datetime}
				onChange={e => setDatetime(e.target.value)}
			/>
			<button
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				onClick={handleAdd}
			>
				Add Todo
			</button>
		</div>
	);
}