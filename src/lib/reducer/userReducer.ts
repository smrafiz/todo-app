import {produce} from "immer";
import type { User } from "@prisma/client";

// State type
export type UserState = {
	user: User | null;
	isLoading: boolean;
	error: string | null;
	hasHydrated: boolean;
};

// Action type
export type UserAction =
	| { type: "SET_USER"; payload: User | null }
	| { type: "UPDATE_USER"; payload: Partial<User> }
	| { type: "DELETE_USER" }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "LOGOUT" };

// Reducer
export const userReducer = produce((draft: UserState, action: UserAction) => {
	switch (action.type) {
		case "SET_USER":
			draft.user = action.payload;
			draft.error = null;
			break;
		case "UPDATE_USER":
			if (draft.user) {
				Object.assign(draft.user, action.payload);
			}
			break;
		case "DELETE_USER":
			draft.user = null;
			draft.error = null;
			break;
		case "SET_LOADING":
			draft.isLoading = action.payload;
			break;
		case "SET_ERROR":
			draft.error = action.payload;
			break;
		case "LOGOUT":
			draft.user = null;
			draft.isLoading = false;
			draft.error = null;
			break;
		default:
			break;
	}
});