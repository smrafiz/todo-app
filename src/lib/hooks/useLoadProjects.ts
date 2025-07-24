'use client';

import {useCallback, useEffect} from 'react';
import {useUserStore} from '@/lib/store/userStore';
import {useProjectStore} from '@/lib/store/projectStore';

export function useLoadProjects() {
	const user = useUserStore((s) => s.user);
	const hasHydrated = useUserStore((s) => s.hasHydrated);
	const {loadProjects, isLoaded, isLoading, error} = useProjectStore();

	useEffect(() => {
		if (user && hasHydrated && !isLoaded && !isLoading) {
			void loadProjects(user.id);
		}
	}, [user, hasHydrated, isLoaded, isLoading, loadProjects]);

	// Refetch function to reload projects explicitly
	const refetch = useCallback(() => {
		if (user) {
			void loadProjects(user.id);
		}
	}, [user, loadProjects]);

	return {isLoaded, isLoading, error, refetch};
}