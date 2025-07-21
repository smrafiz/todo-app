import {useEffect} from 'react';
import Section from "@/components/Section";
import TodoList from "@/components/todo/TodoList";
import {useTodoStore} from '@/lib/store/todoStore';
import AddTodoForm from "@/components/todo/AddTodoForm";

export default function Home() {
	const {dispatch} = useTodoStore();

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
				<AddTodoForm/>
			</Section>

			<Section
				sectionClass="todo-list-container"
				containerClass=""
				rowClass=""
			>
				<TodoList/>
			</Section>
		</main>
	);
}