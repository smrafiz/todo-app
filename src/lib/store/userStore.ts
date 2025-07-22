import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@prisma/client";

// State type
type State = {
	user: User | null;
	isLoading: boolean;
	error: string | null;
	hasHydrated: boolean;
};

// Action type
type Action =
	| { type: "SET_USER"; payload: User | null }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "LOGOUT" };

// API response types
type APIError = { error: string };
type UserResponse = { user: User };

// Reducer
function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "SET_USER":
			return { ...state, user: action.payload, error: null };
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

// Full Store type
type UserStore = State & {
	dispatch: (action: Action) => void;
	login: (email: string, password: string) => Promise<void>;
	signup: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	setHasHydrated: (value: boolean) => void;
};

// Zustand store
export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			user: null,
			isLoading: false,
			error: null,
			hasHydrated: false,

			dispatch: (action) => set((state) => reducer(state, action)),

			setHasHydrated: (value) => set({ hasHydrated: value }),

			login: async (email, password) => {
				set({ isLoading: true });
				try {
					const res = await fetch("/api/auth/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});

					if (!res.ok) {
						const { error }: APIError = await res.json();
						throw new Error(error || "Login failed");
					}

					const data: UserResponse = await res.json();
					if (!data.user) {
						throw new Error("Invalid credentials");
					}

					set({ user: data.user, error: null });
				} catch (err) {
					const message = err instanceof Error ? err.message : "Unknown login error";
					set({ error: message, user: null });  // explicitly clear user on error
					throw err;  // re-throw so caller knows
				} finally {
					set({ isLoading: false });
				}
			},

			signup: async (name, email, password) => {
				set({ isLoading: true });
				try {
					const res = await fetch("/api/auth/register", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ name, email, password }),
					});
					if (!res.ok) {
						const { error }: APIError = await res.json();
						throw new Error(error || "Signup failed");
					}
					const data: UserResponse = await res.json();
					set({ user: data.user, error: null });
				} catch (err) {
					const message = err instanceof Error ? err.message : "Unknown signup error";
					set({ error: message });
				} finally {
					set({ isLoading: false });
				}
			},

			logout: () =>
				set({
					user: null,
					isLoading: false,
					error: null,
				}),
		}),
		{
			name: "taskmaster-user-store",
			partialize: (state) => ({
				user: state.user,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);