'use client';

import type { Todo } from '@prisma/client';
import { useEffect, useState } from 'react';

type GroupedTodos = {
	[date: string]: Todo[];
};

type MonthlyStats = {
	[month: string]: { total: number; done: number };
};

export default function Page() {
	const [todos, setTodos] = useState<Todo[]>([]);

	useEffect(() => {
		fetch('/api/todos')
			.then(res => res.json())
			.then(data => {
				console.log(data);
					setTodos(
						data.map((todo: Todo) => ({
							...todo,
							datetime: new Date(todo.datetime),
						}))
					)
				}
			)
			.catch(console.error);
	}, []);

	const grouped: GroupedTodos = {};
	const monthStats: MonthlyStats = {};

	todos.forEach(todo => {
		const iso = todo.datetime.toISOString();
		const dayKey = iso.slice(0, 10);
		const monthKey = iso.slice(0, 7);

		// Daily grouping
		if (!grouped[dayKey]) grouped[dayKey] = [];
		grouped[dayKey].push(todo);

		// Monthly stats
		if (!monthStats[monthKey]) monthStats[monthKey] = { total: 0, done: 0 };
		monthStats[monthKey].total += 1;
		if (todo.is_done) monthStats[monthKey].done += 1;
	});

	return (
		<div className="min-h-screen p-8 bg-gray-50 font-sans">
			{/*<h1 className="text-2xl font-bold mb-4 text-center">📊 Task Completion Report</h1>*/}

			{/*<div className="mb-4 text-center">*/}
			{/*	<Link href="/" className="text-blue-600 underline">*/}
			{/*		← Back to ToDo List*/}
			{/*	</Link>*/}
			{/*</div>*/}

			{/* 🟦 Monthly Table */}
			<div className="max-w-3xl mx-auto bg-white p-4 rounded shadow mb-10">
				<h2 className="text-lg font-semibold mb-4">📅 Monthly Completion Summary</h2>
				<table className="w-full text-sm text-left border border-gray-300">
					<thead className="bg-gray-100">
					<tr>
						<th className="p-2 border">Month</th>
						<th className="p-2 border">Total Tasks</th>
						<th className="p-2 border">Completed</th>
						<th className="p-2 border">Completion Rate</th>
					</tr>
					</thead>
					<tbody>
					{Object.entries(monthStats).map(([month, stat]) => {
						const rate = Math.round((stat.done / stat.total) * 100);
						const dateObj = new Date(`${month}-01`);
						return (
							<tr key={month} className="border-t">
								<td className="p-2 border">{dateObj.toLocaleString('default', { month: 'long', year: 'numeric' })}</td>
								<td className="p-2 border">{stat.total}</td>
								<td className="p-2 border">{stat.done}</td>
								<td className="p-2 border text-green-700 font-medium">{rate}%</td>
							</tr>
						);
					})}
					</tbody>
				</table>
			</div>

			{/* 📆 Daily Reports */}
			<div className="space-y-6 max-w-2xl mx-auto">
				{Object.entries(grouped).map(([date, todosForDate]) => {
					const completed = todosForDate.filter(t => t.is_done).length;
					const total = todosForDate.length;
					const rate = Math.round((completed / total) * 100);

					return (
						<div key={date} className="bg-white p-4 rounded shadow">
							<div className="font-semibold text-lg mb-2">
								{new Date(date).toDateString()}
							</div>

							<div className="text-sm text-gray-700 mb-2">
								✅ {completed} of {total} completed ({rate}%)
							</div>

							<div className="w-full bg-gray-200 h-3 rounded overflow-hidden mb-2">
								<div
									className="h-full bg-green-500"
									style={{ width: `${rate}%` }}
								></div>
							</div>

							<ul className="list-disc ml-5 text-sm">
								{todosForDate.map(todo => (
									<li key={todo.id} className={todo.is_done ? 'line-through text-gray-500' : ''}>
										{todo.title}
									</li>
								))}
							</ul>
						</div>
					);
				})}
			</div>
		</div>
	);
}
