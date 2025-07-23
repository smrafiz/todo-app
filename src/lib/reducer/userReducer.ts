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
export function userReducer(state: UserState, action: UserAction): UserState {
	switch (action.type) {
		case "SET_USER":
			return { ...state, user: action.payload, error: null };
		case "UPDATE_USER":
			return {
				...state,
				user: state.user ? { ...state.user, ...action.payload } : null,
			};
		case "DELETE_USER":
			return { ...state, user: null, error: null };
		case "SET_LOADING":
			return { ...state, isLoading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		case "LOGOUT":
			return { ...state, user: null, isLoading: false, error: null };
		default:
			return state;
	}
}