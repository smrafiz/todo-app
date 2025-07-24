'use client';

import { ArrowLeft } from "lucide-react";
import type { Todo } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import TaskForm from '@/components/todo/TaskForm';

export default function EditTaskPage() {
	const { user, hasHydrated } = useUserStore();
	const router = useRouter();
	const params = useParams();
	const id = params?.id;
	const [task, setTask] = useState<Todo | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (hasHydrated && !user) {
			router.push('/login');
		}
	}, [hasHydrated, user, router]);

	useEffect(() => {
		const fetchTask = async () => {
			if (!id) return;

			try {
				const res = await fetch(`/api/todos/${id}`);
				if (!res.ok) {
					router.push('/tasks');
					return;
				}
				const data = await res.json();
				setTask(data);
			} catch (err) {
				console.error("Failed to fetch task:", err);
				router.push('/tasks');
			} finally {
				setLoading(false);
			}
		};

		if (hasHydrated && user) {
			void fetchTask();
		}
	}, [id, hasHydrated, user, router]);

	if (!hasHydrated || !user || loading) return null;

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<div className="mb-4">
						<button
							onClick={() => router.back()}
							className="flex items-center text-sm text-blue-600 hover:underline"
						>
							<ArrowLeft className="w-4 h-4 mr-1" />
							Back to Tasks
						</button>
					</div>
					<h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
					<p className="text-gray-600 mt-2">Make changes to your task</p>
				</div>

				{task && <TaskForm task={task} isEdit />}
			</main>
		</div>
	);
}