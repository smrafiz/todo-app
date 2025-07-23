'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/userStore';
import { useTodoStore } from '@/lib/store/todoStore';
import { useProjectStore } from '@/lib/store/projectStore';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';
import TaskItem from '@/components/todo/TaskItem';

import type { Todo } from '@prisma/client';
import {Folder, Plus} from "lucide-react";

export default function AllTasksPage() {
	const router = useRouter();
	const { user, hasHydrated } = useUserStore();
	const { filter, sort, setFilter, setSort, getFilteredTodos, loadTodos, isLoaded } = useTodoStore();
	const { getUserProjects } = useProjectStore();

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
	const userProjects = user ? getUserProjects(user.id) : [];

	useEffect(() => {
		if (hasHydrated && !user) {
			router.push("/login");
		}
	}, [hasHydrated, user, router]);

	useEffect(() => {
		setFilter({ search: searchTerm, status, due });
	}, [searchTerm, setFilter, status, due]);

	useEffect(() => {
		if (user && hasHydrated && !isLoaded) {
			void loadTodos(user.id);
		}
	}, [user, hasHydrated, isLoaded, loadTodos]);

	if (!hasHydrated) {
		return null;
	}

	if (!user) {
		return null;
	}
	console.log(getFilteredTodos())

	const filteredTasks = getFilteredTodos().filter(t => t.userId === user?.id);

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
					<div className="flex gap-3">
						<Link href={'/projects'}>
							<Button variant="secondary">
								<Folder className="w-4 h-4" />
								Projects
							</Button>
						</Link>
						<Link href="/tasks/new">
							<Button>
								<Plus className="w-4 h-4" />
								Add Task
							</Button>
						</Link>
					</div>
				</div>

				<Card className="mb-6">
					<div className="flex flex-col lg:flex-row gap-4">
						<Input
							placeholder="Search tasks..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="text-sm flex-1"
						/>

						<div className="flex flex-wrap gap-2">
							<select
								value={filter.project || 'all'}
								onChange={(e) => setFilter({ project: e.target.value })}
								className="px-3 py-2 text-sm border rounded-lg"
							>
								<option value="all">All Projects</option>
								{userProjects.map((p) => (
									<option key={p.id} value={p.id}>
										{p.name}
									</option>
								))}
							</select>

							<select
								value={filter.status}
								onChange={(e) => setFilter({ status: e.target.value as "all" | "completed" | "incomplete" })}
								className="px-3 py-2 text-sm border rounded-lg"
							>
								<option value="all">All Tasks</option>
								<option value="incomplete">Incomplete</option>
								<option value="completed">Completed</option>
							</select>

							<select
								value={filter.due}
								onChange={(e) =>
									setFilter({
										due: e.target.value as "all" | "today" | "upcoming" | "overdue" | "no-due",
									})
								}
								className="px-3 py-2 text-sm border rounded-lg"
							>
								<option value="all">All Due Dates</option>
								<option value="today">Due Today</option>
								<option value="upcoming">Upcoming</option>
								<option value="overdue">Overdue</option>
								<option value="no-due">No Due Date</option>
							</select>

							<select
								value={`${sort.field}-${sort.order}`}
								onChange={(e) => {
									const [field, order] = e.target.value.split('-');
									setSort({
										field: field as "dueDate" | "createdAt" | "title",
										order: order as "asc" | "desc",
									});
								}}
								className="px-3 py-2 text-sm border rounded-lg"
							>
								<option value="dueDate-asc">Due Date (Earliest)</option>
								<option value="dueDate-desc">Due Date (Latest)</option>
								<option value="createdAt-desc">Created (Newest)</option>
								<option value="createdAt-asc">Created (Oldest)</option>
								<option value="title-asc">Title (A-Z)</option>
								<option value="title-desc">Title (Z-A)</option>
							</select>
						</div>
					</div>
				</Card>

				{filteredTasks.length === 0 ? (
					<Card>
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<i className="ri-task-line text-2xl text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
							<p className="text-gray-500 mb-4">
								{searchTerm
									? 'Try adjusting your search or filters'
									: 'Get started by creating your first task'}
							</p>
							<Link href="/tasks/new">
								<Button>Create Task</Button>
							</Link>
						</div>
					</Card>
				) : (
					<div className="space-y-4">
						{filteredTasks.map((task) => (
							<TaskItem key={task.id} todo={task} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}