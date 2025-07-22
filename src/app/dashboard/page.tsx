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
	const userState = useUserStore();
	const {todos, setFilter} = useTodoStore();
	const router = useRouter();

	useEffect(() => {
		if (!userState.user) {
			router.push("/login");
		}
	}, [userState.user, router]);

	if (!userState.user) {
		return null;
	}

	const userId = userState.user.id;

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

	const quotes = [
		"The secret of getting ahead is getting started.",
		"A goal is a dream with a deadline.",
		"You don't have to be great to get started, but you have to get started to be great.",
		"The way to get started is to quit talking and begin doing.",
		"Success is the sum of small efforts repeated day in and day out.",
	];

	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

	const handleCardClick = (filterType: string) => {
		// Reset filters
		setFilter({status: "all", due: "all", project: "all", search: ""});

		switch (filterType) {
			case "completed":
				setFilter({status: "completed"});
				break;
			case "pending":
				setFilter({status: "incomplete"});
				break;
			case "overdue":
				setFilter({status: "incomplete", due: "overdue"});
				break;
			case "all":
			default:
				setFilter({status: "all"});
		}

		router.push("/tasks");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome back, {userState.user.name}!
					</h1>
					<p className="text-gray-600 italic">{randomQuote}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card
						className="bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
						onClick={() => handleCardClick("all")}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">Total Tasks</p>
								<p className="text-2xl font-bold text-blue-900">
									{userTodos.length}
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
								<ListTodo className="text-xl text-blue-600" />
							</div>
						</div>
					</Card>

					<Card
						className="bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
						onClick={() => handleCardClick("completed")}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-green-600">Completed</p>
								<p className="text-2xl font-bold text-green-900">
									{completedTodos.length}
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<Check className="text-xl text-green-600" />
							</div>
						</div>
					</Card>

					<Card
						className="bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
						onClick={() => handleCardClick("pending")}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-yellow-600">Pending</p>
								<p className="text-2xl font-bold text-yellow-900">
									{pendingTodos.length}
								</p>
							</div>
							<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
								<Clock className="text-xl text-yellow-600" />
							</div>
						</div>
					</Card>

					<Card
						className="bg-red-50 border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
						onClick={() => handleCardClick("overdue")}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-red-600">Overdue</p>
								<p className="text-2xl font-bold text-red-900">
									{overdueTodos.length}
								</p>
							</div>
							<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="text-xl text-red-600" />
							</div>
						</div>
					</Card>
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					<Card title="Today's Tasks">
						{todayTodos.length === 0 ? (
							<p className="text-gray-500 text-center py-8">
								No tasks due today
							</p>
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
												className={
													todo.completed
														? "line-through text-gray-500"
														: "text-gray-900"
												}
											>
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
												Due:{" "}
												{todo.dueDate
													? format(new Date(todo.dueDate), "MMM d, yyyy")
													: "No due date"}
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