'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';

import {useUserStore} from '@/lib/store/userStore';
import {useTodoStore} from '@/lib/store/todoStore';

import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Folder, Plus} from 'lucide-react';
import LoaderWrapper from '@/components/global/LoaderWrapper';
import TaskItem from '@/components/task/TaskItem';

import TaskFilters from '@/components/task/TaskFilters';
import EmptyState from '@/components/task/EmptyState';

import {useLoadTodos} from '@/lib/hooks/useLoadTodos';
import {useLoadProjects} from '@/lib/hooks/useLoadProjects';
import {useAuthRedirect} from '@/lib/hooks/useAuthRedirect';

export default function AllTasksPage() {
	const {user, hasHydrated} = useUserStore();
	const {getFilteredTodos, setFilter} = useTodoStore();
	const {isLoading, error} = useLoadTodos();
	useLoadProjects();
	useAuthRedirect();

	const [searchTerm, setSearchTerm] = useState('');
	const searchParams = useSearchParams();

	const isStatus = (val: unknown): val is "all" | "completed" | "incomplete" =>
		val === "all" || val === "completed" || val === "incomplete";
	const isDue = (val: unknown): val is "all" | "overdue" | "upcoming" =>
		val === "all" || val === "overdue" || val === "upcoming";

	const statusParam = searchParams.get("status");
	const dueParam = searchParams.get("due");

	const status = isStatus(statusParam) ? statusParam : "all";
	const due = isDue(dueParam) ? dueParam : "all";
	const project = searchParams.get("project") ?? "all";

	useEffect(() => {
		setFilter({
			search: searchTerm,
			status,
			due,
			project: project,
		});
	}, [searchTerm, setFilter, status, due, project]);

	if (!hasHydrated || !user) return null;

	const filteredTasks = getFilteredTodos().filter(t => t.userId === user.id);

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
					<div className="flex gap-3">
						<Link href={'/projects'}>
							<Button variant="secondary" className="hover:bg-accent hover:text-accent-foreground">
								<Folder className="w-4 h-4"/> Projects
							</Button>
						</Link>
						<Link href="/tasks/new">
							<Button><Plus className="w-4 h-4"/> Add Task</Button>
						</Link>
					</div>
				</div>

				<Card className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
					<TaskFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
				</Card>

				<LoaderWrapper isLoading={isLoading} error={error}>
					{filteredTasks.length === 0
						? <EmptyState searchTerm={searchTerm}/>
						: <div className="space-y-4">
							{filteredTasks.map(task => (
								<TaskItem key={task.id} todo={task}/>
							))}
						</div>}
				</LoaderWrapper>
			</main>
		</div>
	);
}