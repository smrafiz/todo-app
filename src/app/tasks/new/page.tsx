
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import TaskForm from '@/components/todo/TaskForm';

export default function NewTaskPage() {
	const { user, hasHydrated } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (hasHydrated && !user) {
			router.push("/login");
		}
	}, [hasHydrated, user, router]);

	if (!hasHydrated) {
		return null;
	}

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Add New Task</h1>
					<p className="text-gray-600 mt-2">Create a new task to stay organized</p>
				</div>

				<TaskForm />
			</main>
		</div>
	);
}
