"use client";

import {useRouter} from "next/navigation";
import {useUserStore} from "@/lib/store/userStore";
import {useTodoStore} from "@/lib/store/todoStore";
import {useUserTodos} from "@/lib/hooks/useUserTodos";

import StatsCard from "@/components/dashboard/StatsCard";
import TaskListCard from "@/components/dashboard/TaskListCard";

import {AlertTriangle, Check, Clock, ListTodo} from "lucide-react";
import {useAuthRedirect} from "@/lib/hooks/useAuthRedirect";
import {useLoadTodos} from "@/lib/hooks/useLoadTodos";

export default function DashboardPage() {
	const {user, hasHydrated} = useUserStore();
	const {setFilter} = useTodoStore();
	const {userTodos, completed, pending, today, overdue, upcoming} = useUserTodos();

	const router = useRouter();

	useAuthRedirect();
	useLoadTodos()

	if (!hasHydrated || !user) {
		return null;
	}

	const stats = [
		{label: "Total Tasks", count: userTodos.length, color: "blue", Icon: <ListTodo/>, filter: "all"},
		{label: "Completed", count: completed.length, color: "green", Icon: <Check/>, filter: "completed"},
		{label: "Pending", count: pending.length, color: "yellow", Icon: <Clock/>, filter: "pending"},
		{label: "Overdue", count: overdue.length, color: "red", Icon: <AlertTriangle/>, filter: "overdue"},
	];

	const todayCardProps = {
		title: "Today's Tasks",
		todos: today,
		link: "/tasks",
		linkLabel: "View All Tasks",
	};

	const upcomingCardProps = {
		title: "Upcoming Tasks",
		todos: upcoming,
		link: "/tasks/new",
		linkLabel: "Add New Task",
	};

	const handleCardClick = (type: string) => {
		setFilter({search: "", status: "all", due: "all", project: "all"});

		switch (type) {
			case "completed":
				setFilter({status: "completed"});
				router.push("/tasks?status=completed");
				break;
			case "pending":
				setFilter({status: "incomplete"});
				router.push("/tasks?status=incomplete");
				break;
			case "overdue":
				setFilter({status: "incomplete", due: "overdue"});
				router.push("/tasks?status=incomplete&due=overdue");
				break;
			default:
				router.push("/tasks");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto px-4 py-8">
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
					<p className="text-gray-600 italic">Have a productive day!</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map(({label, count, color, Icon, filter}) => (
						<StatsCard
							key={label}
							label={label}
							count={count}
							color={color}
							Icon={Icon}
							onClick={() => handleCardClick(filter)}
						/>
					))}
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					<TaskListCard {...todayCardProps} />
					<TaskListCard {...upcomingCardProps} />
				</div>
			</main>
		</div>
	);
}