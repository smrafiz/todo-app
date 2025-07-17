import {useEffect, useState} from 'react';
import Section from "@/components/Section";
import {useTodoStore} from '@/store/todoStore';
import AddTodoForm from "@/components/todo/AddTodoForm";
import TodoDisplay from "@/components/todo/TodoDisplay";

export default function Home() {
	const {todos, dispatch} = useTodoStore();

	const [editingId, setEditingId] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState('');
	const [editDatetime, setEditDatetime] = useState('');

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const res = await fetch('/api/todos');
				const data = await res.json();
				dispatch({type: 'SET_TODOS', payload: data});
			} catch (error) {
				console.error('Failed to fetch todos:', error);
			}
		};

		void fetchTodos();
	}, [dispatch]);

	return (
		<main id="content" className="site-content">
			<Section
				sectionClass="todo-input-container"
				containerClass=""
				rowClass="row-col"
			>
				<AddTodoForm />
			</Section>
			<section className="todo-list-container">
				<div className="container">
					<div className="row">
						<ul className="max-w-2xl mx-auto bg-white rounded shadow p-4 space-y-2">
							{todos.map(todo => (
								<li
									key={todo.id}
									className="flex justify-between items-center border-b pb-2"
								>
									{editingId === todo.id ? (
										<div className="flex flex-col gap-2">
											<input
												className="border p-1 rounded"
												value={editTitle}
												onChange={e => setEditTitle(e.target.value)}
											/>
											<input
												type="datetime-local"
												className="border p-1 rounded"
												value={editDatetime}
												onChange={e => setEditDatetime(e.target.value)}
											/>
											<div className="flex gap-2">
												<button
													className="text-green-600 text-sm"
													onClick={async () => {
														const res = await fetch('/api/todos', {
															method: 'PUT',
															headers: {'Content-Type': 'application/json'},
															body: JSON.stringify({
																id: todo.id,
																title: editTitle,
																datetime: editDatetime,
															}),
														});
														const updated = await res.json();
														dispatch({type: 'UPDATE_TODO', payload: updated});
														setEditingId(null);
													}}
												>
													💾 Save
												</button>
												<button
													className="text-gray-500 text-sm"
													onClick={() => setEditingId(null)}
												>
													❌ Cancel
												</button>
											</div>
										</div>
									) : (
										TodoDisplay({todo})
									)}

									<div className="flex gap-2 items-center">
										{editingId !== todo.id && new Date(todo.datetime) >= new Date() && (
											<button
												className="text-sm text-indigo-500 hover:underline"
												onClick={() => {
													setEditingId(todo.id);
													setEditTitle(todo.title);
													setEditDatetime(todo.datetime.slice(0, 16)); // Truncate for input
												}}
											>
												✏️ Edit
											</button>
										)}

										{todo.is_done ? (
											<span className="text-green-600 text-sm">✅ Done</span>
										) : (
											<button
												className="text-sm text-blue-600 hover:underline"
												onClick={async () => {
													const res = await fetch('/api/todos', {
														method: 'PUT',
														headers: {'Content-Type': 'application/json'},
														body: JSON.stringify({id: todo.id, is_done: 1}),
													});
													const updated = await res.json();
													dispatch({type: 'UPDATE_TODO', payload: updated});
												}}
											>
												✅ Mark as Done
											</button>
										)}

										<button
											className="text-sm text-red-500 hover:underline"
											onClick={async () => {
												await fetch('/api/todos', {
													method: 'DELETE',
													headers: {'Content-Type': 'application/json'},
													body: JSON.stringify({id: todo.id}),
												});
												dispatch({type: 'REMOVE_TODO', payload: todo.id});
											}}
										>
											🗑️ Delete
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
		</main>
	);
}