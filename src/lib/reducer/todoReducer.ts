import {produce} from "immer";
import type {Todo} from "@prisma/client";

export type Action =
	| { type: "SET_TODOS"; payload: Todo[] }
	| { type: "ADD_TODO"; payload: Todo }
	| { type: "UPDATE_TODO"; payload: Partial<Todo> & { id: string } }
	| { type: "REMOVE_TODO"; payload: string }
	| { type: "TOGGLE_TODO"; payload: string };

export const todoReducer = produce((draft: { todos: Todo[] }, action: Action) => {
	switch (action.type) {
		case "SET_TODOS":
			draft.todos = action.payload;
			break;

		case "ADD_TODO":
			draft.todos.push(action.payload);
			draft.todos.sort(
				(a, b) =>
					(a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
					(b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
			);
			break;

		case "UPDATE_TODO": {
			const index = draft.todos.findIndex((t) => t.id === action.payload.id);
			if (index !== -1) {
				draft.todos[index] = {
					...draft.todos[index],
					...action.payload,
				};
				draft.todos.sort(
					(a, b) =>
						(a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
						(b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
				);
			}
			break;
		}

		case "REMOVE_TODO":
			draft.todos = draft.todos.filter((t) => t.id !== action.payload);
			break;

		case "TOGGLE_TODO":
			const todo = draft.todos.find((t) => t.id === action.payload);
			if (todo) {
				todo.completed = !todo.completed;
			}
			break;
	}
});