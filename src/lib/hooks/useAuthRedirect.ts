import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';

export function useAuthRedirect() {
	const router = useRouter();
	const user = useUserStore(s => s.user);
	const hasHydrated = useUserStore(s => s.hasHydrated);

	useEffect(() => {
		if (hasHydrated && !user) {
			router.push('/login');
		}
	}, [hasHydrated, user, router]);
}