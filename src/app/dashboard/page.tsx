"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useUserStore} from "@/lib/store/userStore";
import {useTodoStore} from "@/lib/store/todoStore";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {format, isPast, isToday} from "date-fns";
import {AlertTriangle, Check, Clock, ListTodo} from "lucide-react";

export default function DashboardPage() {
	const {user, hasHydrated} = useUserStore();
	const {todos, setFilter, loadTodos, isLoaded} = useTodoStore();
	const router = useRouter();

	useEffect(() => {
		if (hasHydrated && !user) {
			router.push("/login");
		}
	}, [hasHydrated, user, router]);

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

	const userId = user.id;

	// Filter todos for current user
	const userTodos = todos.filter((todo) => todo.userId === userId);

	// Categorize todos
	const completedTodos = userTodos.filter((t) => t.completed);
	const pendingTodos = userTodos.filter((t) => !t.completed);
	const todayTodos = userTodos.filter(
		(t) => t.dueDate && isToday(new Date(t.dueDate))
	);
	const overdueTodos = userTodos.filter(
		(t) => t.dueDate && isPast(new Date(t.dueDate)) && !t.completed
	);
	const upcomingTodos = userTodos.filter(
		(t) => t.dueDate && !isPast(new Date(t.dueDate)) && !t.completed
	);

	const handleCardClick = (filterType: string) => {
		setFilter({status: "all", due: "all", project: "all", search: ""});
		let query = "";

		switch (filterType) {
			case "completed":
				setFilter({status: "completed"});
				query = "status=completed";
				break;
			case "pending":
				setFilter({status: "incomplete"});
				query = "status=incomplete";
				break;
			case "overdue":
				setFilter({status: "incomplete", due: "overdue"});
				query = "status=incomplete&due=overdue";
				break;
			case "all":
			default:
				setFilter({status: "all"});
				query = "status=all";
		}

		router.push(`/tasks?${query}`);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome back, {user.name}!
					</h1>
					<p className="text-gray-600 italic">Have a productive day!</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="group">
						<Card
							className="bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 group-hover:scale-[1.02] transition-all p-6"
							onClick={() => handleCardClick("all")}
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-blue-600">Total Tasks</p>
									<p className="text-2xl font-bold text-blue-900">{userTodos.length}</p>
								</div>
								<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
									<ListTodo className="text-xl text-blue-600"/>
								</div>
							</div>
						</Card>
					</div>

					<div className="group">
						<Card
							className="bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 group-hover:scale-[1.02] transition-all p-6"
							onClick={() => handleCardClick("completed")}
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-green-600">Completed</p>
									<p className="text-2xl font-bold text-green-900">{completedTodos.length}</p>
								</div>
								<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
									<Check className="text-xl text-green-600"/>
								</div>
							</div>
						</Card>
					</div>

					<div className="group">
						<Card
							className="bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100 group-hover:scale-[1.02] transition-all p-6"
							onClick={() => handleCardClick("pending")}
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-yellow-600">Pending</p>
									<p className="text-2xl font-bold text-yellow-900">{pendingTodos.length}</p>
								</div>
								<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
									<Clock className="text-xl text-yellow-600"/>
								</div>
							</div>
						</Card>
					</div>

					<div className="group">
						<Card
							className="bg-red-50 border-red-200 cursor-pointer hover:bg-red-100 group-hover:scale-[1.02] transition-all p-6"
							onClick={() => handleCardClick("overdue")}
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-red-600">Overdue</p>
									<p className="text-2xl font-bold text-red-900">{overdueTodos.length}</p>
								</div>
								<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
									<AlertTriangle className="text-xl text-red-600"/>
								</div>
							</div>
						</Card>
					</div>
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					<Card title="Today's Tasks">
						{todayTodos.length === 0 ? (
							<p className="text-gray-500 text-center py-8">No tasks due today</p>
						) : (
							<div className="space-y-3">
								{todayTodos.slice(0, 5).map((todo) => (
									<div
										key={todo.id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div className="flex items-center">
											<input
												type="checkbox"
												checked={todo.completed}
												className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
												readOnly
											/>
											<span
												className={todo.completed ? "line-through text-gray-500" : "text-gray-900"}>
                        {todo.title}
                      </span>
										</div>
										<div className="flex items-center gap-2">
											{todo.tags
												? todo.tags.split(",").map((tag) => (
													<span
														key={tag}
														className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
													>
                              {tag.trim()}
                            </span>
												))
												: null}
										</div>
									</div>
								))}
							</div>
						)}
						<div className="mt-4">
							<Link href="/tasks">
								<Button variant="ghost" size="sm" className="w-full">
									View All Tasks
								</Button>
							</Link>
						</div>
					</Card>

					<Card title="Upcoming Tasks">
						{upcomingTodos.length === 0 ? (
							<p className="text-gray-500 text-center py-8">No upcoming tasks</p>
						) : (
							<div className="space-y-3">
								{upcomingTodos.slice(0, 5).map((todo) => (
									<div
										key={todo.id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div>
											<p className="text-gray-900 font-medium">{todo.title}</p>
											<p className="text-sm text-gray-500">
												Due: {todo.dueDate ? format(new Date(todo.dueDate), "MMM d, yyyy") : "No due date"}
											</p>
										</div>
										<div className="flex items-center gap-2">
											{todo.tags
												? todo.tags.split(",").map((tag) => (
													<span
														key={tag}
														className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
													>
                              {tag.trim()}
                            </span>
												))
												: null}
										</div>
									</div>
								))}
							</div>
						)}
						<div className="mt-4">
							<Link href="/tasks/new">
								<Button size="sm" className="w-full">
									Add New Task
								</Button>
							</Link>
						</div>
					</Card>
				</div>
			</main>
		</div>
	);
}