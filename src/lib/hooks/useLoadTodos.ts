import { useEffect } from 'react';
import { useTodoStore } from '@/lib/store/todoStore';
import { useUserStore } from '@/lib/store/userStore';

export function useLoadTodos() {
	const user = useUserStore(s => s.user);
	const hasHydrated = useUserStore(s => s.hasHydrated);
	const { loadTodos, isLoaded, isLoading, error } = useTodoStore();

	useEffect(() => {
		if (user && hasHydrated && !isLoaded && !isLoading) {
			void loadTodos(user.id);
		}
	}, [user, hasHydrated, isLoaded, isLoading, loadTodos]);

	return { isLoaded, isLoading, error };
}