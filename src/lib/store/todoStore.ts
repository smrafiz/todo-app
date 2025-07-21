import { create } from 'zustand';
import type { Todo } from '@prisma/client';

type Action =
	| { type: 'SET_TODOS'; payload: Todo[] }
	| { type: 'ADD_TODO'; payload: Todo }
	| { type: 'UPDATE_TODO'; payload: Todo }
	| { type: 'REMOVE_TODO'; payload: number };

type TodoStore = {
	todos: Todo[];
	title: string;
	datetime: string;
	dispatch: (action: Action) => void;
	setTitle: (title: string) => void;
	setDatetime: (datetime: string) => void;
	editingId: number | null;
	editTitle: string;
	editDatetime: string;
	setEditingId: (id: number | null) => void;
	setEditTitle: (title: string) => void;
	setEditDatetime: (datetime: string) => void;
	resetEditFields: () => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
	todos: [],
	title: '',
	datetime: '',
	editingId: null,
	editTitle: '',
	editDatetime: '',
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
	setTitle: (title) => set({ title }),
	setDatetime: (datetime) => set({ datetime }),
	setEditingId: (id) => set({ editingId: id }),
	setEditTitle: (title) => set({ editTitle: title }),
	setEditDatetime: (datetime) => set({ editDatetime: datetime }),
	resetEditFields: () =>
		set({ editingId: null, editTitle: '', editDatetime: '' }),
}));