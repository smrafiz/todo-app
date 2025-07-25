import {create} from "zustand";
import {jwtDecode} from "jwt-decode";
import type {User} from "@prisma/client";
import {persist} from "zustand/middleware";
import {userReducer} from "@/lib/reducer/userReducer";
import type {UserAction, UserState} from "@/lib/reducer/userReducer";

// API response types
type APIError = { error: string };
type UserResponse = { user: User };

// JWT Payload type with expiration
type JWTPayload = {
    exp: number;
};

// Store type
type UserStore = UserState & {
    isAuthenticated: boolean;
    dispatch: (action: UserAction) => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setHasHydrated: (value: boolean) => void;
    checkAuthStatus: () => void;
    checkTokenValidity: () => void;

    addUser: (user: User) => void;
    updateUser: (userUpdate: Partial<User>) => void;
    deleteUser: () => void;
};

function getTokenFromCookies() {
    if (typeof document === "undefined") return null;
    const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

    if (!tokenCookie) {
        return null;
    }

    return tokenCookie.split("=")[1];
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            hasHydrated: false,

            dispatch: (action) => set((state) => userReducer(state, action)),

            setHasHydrated: (value) => set({hasHydrated: value}),

            login: async (email, password) => {
                set({isLoading: true});
                try {
                    const res = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({email, password}),
                    });

                    if (!res.ok) {
                        const {error}: APIError = await res.json();
                        throw new Error(error || "Login failed");
                    }

                    const data: UserResponse = await res.json();
                    if (!data.user) {
                        throw new Error("Invalid credentials");
                    }

                    set({user: data.user, error: null, isAuthenticated: true});
                } catch (err) {
                    const message = err instanceof Error ? err.message : "Unknown login error";
                    set({error: message, user: null, isAuthenticated: false});
                    throw err;
                } finally {
                    set({isLoading: false});
                }
            },

            signup: async (name, email, password) => {
                set({isLoading: true});
                try {
                    const res = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({name, email, password}),
                    });
                    if (!res.ok) {
                        const {error}: APIError = await res.json();
                        throw new Error(error || "Signup failed");
                    }
                    const data: UserResponse = await res.json();
                    set({user: data.user, error: null, isAuthenticated: true});
                } catch (err) {
                    const message = err instanceof Error ? err.message : "Unknown signup error";
                    set({user: null, isAuthenticated: false, error: message});
                } finally {
                    set({isLoading: false});
                }
            },

            logout: async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                })
            },

            checkAuthStatus: async () => {
                try {
                    const res = await fetch("/api/auth/me", { method: "GET" });

                    if (!res.ok) {
                        get().logout();
                        return;
                    }

                    const { user } = await res.json();
                    set({ user, isAuthenticated: true, error: null });
                } catch (err) {
                    get().logout();
                }
            },

            checkTokenValidity: () => {
                const token = getTokenFromCookies();
                if (!token) {
                    return get().logout();
                }

                try {
                    const decoded: JWTPayload = jwtDecode(token);
                    console.log(decoded, token)

                    if (decoded.exp * 1000 < Date.now()) {
                        get().logout();
                    }
                } catch (err) {
                    get().logout();
                }
            },

            addUser: (user) => get().dispatch({type: "SET_USER", payload: user}),

            updateUser: (userUpdate) =>
                get().dispatch({type: "UPDATE_USER", payload: userUpdate}),

            deleteUser: () => get().dispatch({type: "DELETE_USER"}),
        }),
        {
            name: "taskmaster-user-store",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
                state?.checkAuthStatus();
            },
        }
    )
);