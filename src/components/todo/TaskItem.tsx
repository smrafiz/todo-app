'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useTodoStore} from '@/lib/store/todoStore';
import {useProjectStore} from '@/lib/store/projectStore';
import {Project, Todo} from '@prisma/client';
import {Button} from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import {format, isPast, isToday} from 'date-fns';
import {Check, Edit2, Trash2} from "lucide-react";

interface TodoWithProject extends Todo {
	project?: Project;
}

interface Props {
	todo: TodoWithProject;
}

export default function TaskItem({todo}: Props) {
	const {toggleTodo, removeTodo} = useTodoStore();
	const {projects} = useProjectStore();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const taskProject = projects.find(p => p.id === todo.projectId);

	const handleToggleComplete = () => {
		toggleTodo(todo.id);
	};

	const handleDelete = () => {
		removeTodo(todo.id);
		setShowDeleteModal(false);
	};

	const getDueDateColor = () => {
		if (!todo.dueDate) return 'text-gray-500';
		if (isPast(todo.dueDate) && !todo.completed) return 'text-red-600';
		if (isToday(todo.dueDate)) return 'text-yellow-600';
		return 'text-gray-500';
	};

	const getDueDateText = () => {
		if (!todo.dueDate) return 'No due date';
		if (isToday(todo.dueDate)) return 'Due today';
		if (isPast(todo.dueDate) && !todo.completed)
			return `Overdue - ${format(todo.dueDate, 'MMM d, yyyy')}`;
		return `Due ${format(todo.dueDate, 'MMM d, yyyy')}`;
	};

	console.log(todo.tags)

	return (
		<>
			<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group">
				<div className="flex items-start justify-between">
					<div className="flex items-start flex-1">
						<button
							onClick={handleToggleComplete}
							className="mt-1 mr-4 cursor-pointer"
						>
							<div
								className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
									todo.completed
										? 'bg-green-500 border-green-500'
										: 'border-gray-300 hover:border-blue-500'
								}`}
							>
								{todo.completed && (
									<Check className="w-3.5 h-3.5 text-white" />
								)}
							</div>
						</button>

						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<h3
									className={`text-lg font-medium ${
										todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
									}`}
								>
									{todo.title}
								</h3>
								{taskProject && (
									<span
										className="px-2 py-1 text-xs rounded-full text-white"
										style={{backgroundColor: taskProject.color}}
									>
				                        {taskProject.name}
									</span>
								)}
							</div>

							{todo.description && (
								<p
									className={`mt-1 text-sm ${
										todo.completed ? 'text-gray-400' : 'text-gray-600'
									}`}
								>
									{todo.description}
								</p>
							)}

							<div className="flex items-center gap-4 mt-3">
				                <span className={`text-sm ${getDueDateColor()}`}>
				                  <i className="ri-calendar-line mr-1"></i>
					                {getDueDateText()}
				                </span>

								{todo.tags && (
									<div className="flex gap-1">
										{(typeof todo.tags === 'string' ? todo.tags.split(',') : todo.tags).map(tag => (
											<span
												key={tag.trim()}
												className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
											>
												{tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2 ml-4">
						<Link href={`/tasks/${todo.id}/edit`}>
							<Button variant="ghost" size="sm">
								<Edit2 className="w-4 h-4" />
							</Button>
						</Link>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowDeleteModal(true)}
							className="text-red-600 hover:text-red-700 hover:bg-red-50"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>

			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				title="Delete Task"
				description={
					<>
						Are you sure you want to delete{" "}
						<span className="font-semibold text-black">{todo.title}</span>? This action cannot be undone.
					</>
				}
			>
				<div className="flex justify-end gap-2 mt-4">
					<Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleDelete}>
						Delete
					</Button>
				</div>
			</Modal>
		</>
	);
}