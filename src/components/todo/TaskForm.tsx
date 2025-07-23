
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { useTodoStore } from '@/lib/store/todoStore';
import { useProjectStore } from '@/lib/store/projectStore';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';
import { format } from 'date-fns';
import { Todo } from '@prisma/client';

interface TaskFormProps {
	task?: Todo;
	isEdit?: boolean;
}

export default function TaskForm({ task, isEdit = false }: TaskFormProps) {
	const { user } = useUserStore();
	const { addTodo, updateTodo } = useTodoStore();
	const { getUserProjects } = useProjectStore();
	const router = useRouter();

	const userProjects = user ? getUserProjects(user.id) : [];

	const initialTags = (() => {
		if (!task?.tags) return '';
		if (Array.isArray(task.tags)) return task.tags.join(', ');
		if (typeof task.tags === 'string') return task.tags;
		return '';
	})();

	const [formData, setFormData] = useState({
		title: task?.title || '',
		description: task?.description || '',
		dueDate: task?.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
		dueTime: task?.dueDate ? format(task.dueDate, 'HH:mm') : '',
		tags: initialTags,
		projectId: task?.projectId || ''
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setIsLoading(true);

		if (!formData.title.trim()) {
			setErrors({ title: 'Title is required' });
			setIsLoading(false);
			return;
		}

		if (!user) {
			setErrors({ general: 'User not authenticated' });
			setIsLoading(false);
			return;
		}

		try {
			let dueDate: Date | null = null;
			if (formData.dueDate) {
				const dateTimeString = formData.dueTime
					? `${formData.dueDate}T${formData.dueTime}`
					: `${formData.dueDate}T23:59`;
				dueDate = new Date(dateTimeString);
			}

			const tags = formData.tags
				.split(',')
				.map((tag: string) => tag.trim())
				.filter(tag => tag.length > 0)

			if (isEdit && task) {
				updateTodo({
					id: task.id,
					title: formData.title.trim(),
					description: formData.description.trim(),
					dueDate,
					tags: tags.length > 0 ? tags.join(',') : null,
					projectId: formData.projectId || null
				});
			} else {
				addTodo({
					title: formData.title.trim(),
					description: formData.description.trim(),
					dueDate,
					tags: tags.length > 0 ? tags.join(',') : null,
					completed: false,
					userId: user.id,
					projectId: formData.projectId || null
				});
			}

			router.push('/tasks');
		} catch (error) {
			setErrors({ general: 'An error occurred. Please try again.' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit} className="space-y-6">
				{errors.general && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
						{errors.general}
					</div>
				)}

				<Input
					label="Task Title"
					type="text"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					error={errors.title}
					placeholder="Enter task title"
					required
				/>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Project
					</label>
					<select
						value={formData.projectId}
						onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-8"
					>
						<option value="">No Project</option>
						{userProjects.map(project => (
							<option key={project.id} value={project.id}>
								{project.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						placeholder="Enter task description (optional)"
						rows={4}
						maxLength={500}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
					/>
					<div className="text-right text-sm text-gray-500 mt-1">
						{formData.description.length}/500
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Due Date"
						type="date"
						value={formData.dueDate}
						onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
						error={errors.dueDate}
					/>

					<Input
						label="Due Time"
						type="time"
						value={formData.dueTime}
						onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
						error={errors.dueTime}
						disabled={!formData.dueDate}
					/>
				</div>

				<Input
					label="Tags"
					type="text"
					value={formData.tags}
					onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
					error={errors.tags}
					placeholder="Enter tags separated by commas (e.g., work, urgent, personal)"
				/>

				<div className="flex justify-end gap-4">
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.push('/tasks')}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? 'Saving...' : (isEdit ? 'Update Task' : 'Add Task')}
					</Button>
				</div>
			</form>
		</Card>
	);
}
