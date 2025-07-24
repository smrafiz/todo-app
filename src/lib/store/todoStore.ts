import {create} from "zustand";
import {nanoid} from "nanoid";
import type {Todo} from "@prisma/client";
import {isFuture, isPast, isToday} from "date-fns";
import {type Action, todoReducer} from "../reducer/todoReducer";

type TodoFilter = {
	status: "all" | "completed" | "incomplete";
	due: "all" | "today" | "upcoming" | "overdue" | "no-due";
	search: string;
	project?: string;
};

type TodoSort = {
	field: "dueDate" | "createdAt" | "title";
	order: "asc" | "desc";
};

type NewTodo = Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">> & {
	id?: string;
};

type TodoStore = {
	todos: Todo[];
	filter: TodoFilter;
	sort: TodoSort;

	dispatch: (action: Action) => void;
	setFilter: (filter: Partial<TodoFilter>) => void;
	setSort: (sort: TodoSort) => void;
	getFilteredTodos: () => Todo[];
	resetFilters: () => void;

	isLoaded: boolean;
	loadTodos: (userId: string) => Promise<void>;

	addTodo: (todo: NewTodo) => void;
	updateTodo: (todo: Partial<Todo> & { id: string }) => void;
	removeTodo: (id: string) => void;
	setTodos: (todos: Todo[]) => void;
	toggleTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
	todos: [],
	filter: {
		status: "all",
		due: "all",
		search: "",
	},
	sort: {
		field: "dueDate",
		order: "asc",
	},
	isLoaded: false,

	dispatch: (action) => {
		set(state => todoReducer(state, action));
	},

	setFilter: (newFilter) =>
		set((state) => ({
			filter: {...state.filter, ...newFilter},
		})),

	setSort: (newSort) => set({sort: newSort}),

	resetFilters: () =>
		set({
			filter: {status: "all", due: "all", search: ""},
			sort: {field: "dueDate", order: "asc"},
		}),

	getFilteredTodos: () => {
		const {todos, filter, sort} = get();

		const filtered = todos.filter((todo) => {
			// Status
			if (filter.status === "completed" && !todo.completed) return false;
			if (filter.status === "incomplete" && todo.completed) return false;

			// Due
			if (filter.due === "today" && (!todo.dueDate || !isToday(new Date(todo.dueDate)))) return false;
			if (filter.due === "upcoming" && (!todo.dueDate || !isFuture(new Date(todo.dueDate)))) return false;
			if (filter.due === "overdue" && (!todo.dueDate || !isPast(new Date(todo.dueDate)) || todo.completed)) return false;
			if (filter.due === "no-due" && todo.dueDate) return false;

			// Search
			return !(filter.search && !todo.title.toLowerCase().includes(filter.search.toLowerCase()));
		});

		// Sort
		filtered.sort((a, b) => {
			let aValue: any = a[sort.field];
			let bValue: any = b[sort.field];
			if (sort.field === "dueDate" || sort.field === "createdAt") {
				aValue = aValue ? new Date(aValue).getTime() : Infinity;
				bValue = bValue ? new Date(bValue).getTime() : Infinity;
			}
			return sort.order === "asc"
				? aValue - bValue
				: bValue - aValue;
		});

		return filtered;
	},

	loadTodos: async (userId: string) => {
		try {
			const res = await fetch(`/api/todos?userId=${userId}`);
			if (!res.ok) throw new Error("Failed to fetch todos");

			const data: Todo[] = await res.json();
			const todos = data.map(todo => ({
				...todo,
				dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
				createdAt: new Date(todo.createdAt),
				updatedAt: new Date(todo.updatedAt),
			}));

			get().dispatch({ type: "SET_TODOS", payload: todos });
			set({ isLoaded: true });
		} catch (error) {
			console.error("Failed to load todos:", error);
			set({ isLoaded: false });
		}
	},

	addTodo: async (todo) => {
		const now = new Date();
		const newTodo: Todo = {
			id: todo.id ?? nanoid(),
			title: todo.title ?? "Untitled",
			description: todo.description ?? null,
			completed: todo.completed ?? false,
			dueDate: todo.dueDate ?? null,
			tags: Array.isArray(todo.tags) ? todo.tags.join(',') : todo.tags ?? null,
			priority: todo.priority ?? "medium",
			userId: todo.userId ?? "",
			projectId: todo.projectId ?? null,
			createdAt: now,
			updatedAt: now,
		};

		try {
			await fetch("/api/todos", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(newTodo),
			});
			get().dispatch({type: "ADD_TODO", payload: newTodo});
		} catch (error) {
			console.error("Failed to add todo", error);
		}
	},

	updateTodo: async (todo) => {
		try {
			await fetch(`/api/todos/${todo.id}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(todo),
			});
			get().dispatch({type: "UPDATE_TODO", payload: todo});
		} catch (error) {
			console.error("Failed to update todo", error);
		}
	},

	removeTodo: async (id) => {
		try {
			await fetch(`/api/todos/${id}`, {
				method: "DELETE",
			});
			get().dispatch({type: "REMOVE_TODO", payload: id});
		} catch (error) {
			console.error("Failed to delete todo:", error);
		}
	},

	setTodos: (todos) => {
		get().dispatch({type: "SET_TODOS", payload: todos});
	},

	toggleTodo: async (id) => {
		const todo = get().todos.find(t => t.id === id);
		if (!todo) return;

		const updated = {...todo, completed: !todo.completed};

		try {
			await fetch(`/api/todos/${id}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(updated),
			});
			get().dispatch({type: "TOGGLE_TODO", payload: id});
		} catch (error) {
			console.error("Failed to toggle todo:", error);
		}
	},
}));