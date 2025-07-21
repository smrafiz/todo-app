import TodoItem from './TodoItem';
import { useTodoStore } from '@/lib/store/todoStore';

export default function TodoList() {
	const { todos } = useTodoStore();

	return (
		<ul className="max-w-2xl mx-auto bg-white rounded shadow p-4 space-y-2">
			{todos.map(todo => (
				<TodoItem key={todo.id} todo={todo} />
			))}
		</ul>
	);
}