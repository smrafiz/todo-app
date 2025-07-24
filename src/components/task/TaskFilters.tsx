'use client';

import {Input} from '@/components/ui/input';
import {useProjectStore} from '@/lib/store/projectStore';
import {useUserStore} from '@/lib/store/userStore';
import {useTodoStore} from '@/lib/store/todoStore';

type Props = {
	searchTerm: string;
	setSearchTerm: (val: string) => void;
};

export default function TaskFilters({searchTerm, setSearchTerm}: Props) {
	const {user} = useUserStore();
	const {getUserProjects} = useProjectStore();
	const {filter, sort, setFilter, setSort} = useTodoStore();
	const userProjects = user ? getUserProjects(user.id) : [];

	return (
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
					onChange={(e) => setFilter({project: e.target.value})}
					className="px-3 py-2 text-sm border rounded-lg"
				>
					<option value="all">All Projects</option>
					{userProjects.map((p) => (
						<option key={p.id} value={p.id}>{p.name}</option>
					))}
				</select>
				<select
					value={filter.status}
					onChange={(e) => setFilter({status: e.target.value as "all" | "completed" | "incomplete"})}
					className="px-3 py-2 text-sm border rounded-lg"
				>
					<option value="all">All Tasks</option>
					<option value="incomplete">Incomplete</option>
					<option value="completed">Completed</option>
				</select>
				<select
					value={filter.due}
					onChange={(e) =>
						setFilter({due: e.target.value as "all" | "today" | "upcoming" | "overdue" | "no-due"})
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
	);
}