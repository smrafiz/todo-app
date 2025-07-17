import { create } from 'zustand';

type Todo = {
	id: number;
	title: string;
	datetime: string;
	is_done: number;
};

type Action =
	| { type: 'SET_TODOS'; payload: Todo[] }
	| { type: 'ADD_TODO'; payload: Todo }
	| { type: 'UPDATE_TODO'; payload: Todo }
	| { type: 'REMOVE_TODO'; payload: number };

type TodoStore = {
	todos: Todo[];
	dispatch: (action: Action) => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
	todos: [],
	dispatch: (action) =>
		set((state) => {
			switch (action.type) {
				case 'SET_TODOS':
					return { todos: action.payload };

				case 'ADD_TODO':
					return { todos: [...state.todos, action.payload] };

				case 'UPDATE_TODO':
					return {
						todos: state.todos.map((t) =>
							t.id === action.payload.id ? action.payload : t
						),
					};

				case 'REMOVE_TODO':
					return {
						todos: state.todos.filter((t) => t.id !== action.payload),
					};

				default:
					return state;
			}
		}),
}));