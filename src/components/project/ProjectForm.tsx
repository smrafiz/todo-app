'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { useProjectStore } from '@/lib/store/projectStore';
import { Project } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProjectFormProps {
	project?: Project | null;
	onSuccess: () => void;
}

const projectColors = [
	'#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
	'#EC4899', '#6B7280', '#14B8A6', '#F97316', '#84CC16'
];

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
	const { user } = useUserStore();
	const { addProject, updateProject } = useProjectStore();
	const isEdit = !!project;

	const [formData, setFormData] = useState({
		name: project?.name || '',
		description: project?.description || '',
		color: project?.color || projectColors[0]
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setIsLoading(true);

		if (!formData.name.trim()) {
			setErrors({ name: 'Project name is required' });
			setIsLoading(false);
			return;
		}

		if (!user) {
			setErrors({ general: 'User not authenticated' });
			setIsLoading(false);
			return;
		}

		try {
			if (isEdit && project) {
				updateProject({
					id: project.id,
					name: formData.name.trim(),
					description: formData.description.trim(),
					color: formData.color
				});
			} else {
				addProject({
					name: formData.name.trim(),
					description: formData.description.trim(),
					color: formData.color,
					userId: user.id
				});
			}

			onSuccess();
		} catch (error) {
			setErrors({ general: 'An error occurred. Please try again.' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{errors.general && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{errors.general}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="name">Project Name</Label>
				<Input
					id="name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					placeholder="Enter project name"
					required
				/>
				{errors.name && (
					<p className="text-sm text-red-500 mt-1">{errors.name}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					placeholder="Enter project description (optional)"
					rows={3}
					maxLength={500}
				/>
				<div className="text-right text-sm text-muted-foreground">
					{formData.description.length}/500
				</div>
			</div>

			<div className="space-y-2">
				<Label>Project Color</Label>
				<div className="flex flex-wrap gap-3">
					{projectColors.map((color) => (
						<button
							key={color}
							type="button"
							onClick={() => setFormData({ ...formData, color })}
							className={`w-8 h-8 rounded-full transition-all border-2 ${
								formData.color === color
									? 'ring-2 ring-offset-2 ring-gray-400'
									: 'hover:scale-110 border-transparent'
							}`}
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
			</div>

			<div className="flex justify-end gap-4">
				<Button
					type="button"
					variant="secondary"
					onClick={onSuccess}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
				</Button>
			</div>
		</form>
	);
}