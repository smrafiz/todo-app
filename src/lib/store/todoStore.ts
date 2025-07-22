import { create } from "zustand";
import type { Todo } from "@prisma/client";
import { isToday, isFuture, isPast } from "date-fns";

// Filter and sort types
type TodoFilter = {
	status: "all" | "completed" | "incomplete";
	due: "all" | "today" | "upcoming" | "overdue" | "no-due";
	search: string;
};

type TodoSort = {
	field: "dueDate" | "createdAt" | "title";
	order: "asc" | "desc";
};

type Action =
	| { type: "SET_TODOS"; payload: Todo[] }
	| { type: "ADD_TODO"; payload: Todo }
	| { type: "UPDATE_TODO"; payload: Todo }
	| { type: "REMOVE_TODO"; payload: string };

type TodoStore = {
	todos: Todo[];
	title: string;
	dueDate: string;
	filter: TodoFilter;
	sort: TodoSort;

	dispatch: (action: Action) => void;

	setTitle: (title: string) => void;
	setDueDate: (dueDate: string) => void;

	editingId: string | null;
	editTitle: string;
	editDueDate: string;
	setEditingId: (id: string | null) => void;
	setEditTitle: (title: string) => void;
	setEditDueDate: (dueDate: string) => void;
	resetEditFields: () => void;

	setFilter: (filter: Partial<TodoFilter>) => void;
	setSort: (sort: TodoSort) => void;
	getFilteredTodos: () => Todo[];
};

export const useTodoStore = create<TodoStore>((set, get) => ({
	todos: [],
	title: "",
	dueDate: "",

	filter: {
		status: "all",
		due: "all",
		search: "",
	},
	sort: {
		field: "dueDate",
		order: "asc",
	},

	editingId: null,
	editTitle: "",
	editDueDate: "",

	dispatch: (action) =>
		set((state) => {
			switch (action.type) {
				case "SET_TODOS":
					return { todos: action.payload };

				case "ADD_TODO":
					return { todos: [...state.todos, action.payload] };

				case "UPDATE_TODO":
					return {
						todos: state.todos.map((t) =>
							t.id === action.payload.id ? action.payload : t
						),
					};

				case "REMOVE_TODO":
					return {
						todos: state.todos.filter((t) => t.id !== action.payload),
					};

				default:
					return state;
			}
		}),

	setTitle: (title) => set({ title }),
	setDueDate: (dueDate) => set({ dueDate }),
	setEditingId: (id) => set({ editingId: id }),
	setEditTitle: (title) => set({ editTitle: title }),
	setEditDueDate: (dueDate) => set({ editDueDate: dueDate }),
	resetEditFields: () =>
		set({ editingId: null, editTitle: "", editDueDate: "" }),

	setFilter: (newFilter) =>
		set((state) => ({
			filter: { ...state.filter, ...newFilter },
		})),

	setSort: (newSort) => set({ sort: newSort }),

	getFilteredTodos: () => {
		const { todos, filter, sort } = get();

		let filtered = todos.filter((todo) => {
			// Status filter
			if (filter.status === "completed" && !todo.completed) return false;
			if (filter.status === "incomplete" && todo.completed) return false;

			// Due date filter
			if (filter.due === "today") {
				if (!todo.dueDate || !isToday(new Date(todo.dueDate))) return false;
			} else if (filter.due === "upcoming") {
				if (!todo.dueDate || !isFuture(new Date(todo.dueDate))) return false;
			} else if (filter.due === "overdue") {
				if (
					!todo.dueDate ||
					!isPast(new Date(todo.dueDate)) ||
					todo.completed
				)
					return false;
			} else if (filter.due === "no-due") {
				if (todo.dueDate) return false;
			}

			// Search filter
			if (
				filter.search &&
				!todo.title.toLowerCase().includes(filter.search.toLowerCase())
			)
				return false;

			return true;
		});

		filtered.sort((a, b) => {
			let aValue: any = a[sort.field];
			let bValue: any = b[sort.field];

			if (sort.field === "dueDate" || sort.field === "createdAt") {
				aValue = aValue ? new Date(aValue).getTime() : Infinity;
				bValue = bValue ? new Date(bValue).getTime() : Infinity;
			}

			if (sort.order === "asc") {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
			}
		});

		return filtered;
	},
}));