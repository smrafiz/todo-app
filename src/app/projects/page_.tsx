'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {CheckSquare, Plus} from 'lucide-react';
import {useUserStore} from '@/lib/store/userStore';
import {useTodoStore} from '@/lib/store/todoStore';
import {useCallback, useMemo, useState} from 'react';
import {useLoadTodos} from '@/lib/hooks/useLoadTodos';
import EmptyState from '@/components/project/EmptyState';
import {useProjectStore} from '@/lib/store/projectStore';
import ProjectCard from '@/components/project/ProjectCard';
import {useAuthRedirect} from '@/lib/hooks/useAuthRedirect';
import {useLoadProjects} from '@/lib/hooks/useLoadProjects';
import LoaderWrapper from '@/components/global/LoaderWrapper';
import DeleteProjectModal from '@/components/project/modal/DeleteProjectModal';
import CreateProjectModal from '@/components/project/modal/CreateProjectModal';

export default function ProjectsPage() {
	const {todos} = useTodoStore();
	const {user, hasHydrated} = useUserStore();
	const {error, isLoading, refetch} = useLoadProjects();
	const {removeProject, projects} = useProjectStore();

	const [showProjectFormModal, setShowProjectFormModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

	useAuthRedirect();
	useLoadProjects();
	useLoadTodos();

	const userProjects = useMemo(
		() => (user ? projects.filter((project) => project.userId === user.id) : []),
		[projects, user]
	);

	const selectedProject = useMemo(() => {
		return selectedProjectId ? projects.find((p) => p.id === selectedProjectId) ?? null : null;
	}, [selectedProjectId, projects]);

	const getProjectStats = useCallback(
		(projectId: string) => {
			if (!user) return {total: 0, completed: 0, percent: 0};
			const all = todos.filter((t) => t.projectId === projectId && t.userId === user.id);
			const completed = all.filter((t) => t.completed);
			const total = all.length;
			const completedCount = completed.length;
			const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
			return {total, completed: completedCount, percent};
		},
		[todos, user]
	);

	const handleDeleteProject = useCallback(() => {
		if (selectedProjectId) {
			removeProject(selectedProjectId);
			setShowDeleteModal(false);
			setSelectedProjectId(null);
		}
	}, [selectedProjectId, removeProject]);

	const handleEditProject = useCallback(
		(projectId: string) => {
			setSelectedProjectId(projectId);
			setShowProjectFormModal(true);
		},
		[]
	);

	const handleCreateProject = useCallback(() => {
		setSelectedProjectId(null);
		setShowProjectFormModal(true);
	}, []);

	if (!hasHydrated || !user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
					<div className="flex gap-3">
						<Link href="/tasks">
							<Button variant="secondary" disabled={isLoading} className="hover:bg-accent hover:text-accent-foreground">
								<CheckSquare className="mr-2"/> Tasks
							</Button>
						</Link>
						<Button onClick={handleCreateProject} disabled={isLoading}>
							<Plus className="w-4 h-4"/>
							New Project
						</Button>
					</div>
				</div>

				<LoaderWrapper
					isLoading={isLoading}
					error={error}
					onRetry={() => refetch?.()}
					retryMessage="Failed to load projects. Please try again."
				>
					{userProjects.length === 0 ? (
						<EmptyState onCreate={handleCreateProject}/>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{userProjects.map((project) => (
								<ProjectCard
									key={project.id}
									project={project}
									getProjectStats={getProjectStats}
									onEdit={() => handleEditProject(project.id)}
									onDelete={() => {
										setSelectedProjectId(project.id);
										setShowDeleteModal(true);
									}}
									disableActions={isLoading}
								/>
							))}
						</div>
					)}
				</LoaderWrapper>
			</main>

			<CreateProjectModal
				isOpen={showProjectFormModal}
				onClose={() => {
					setShowProjectFormModal(false);
					setSelectedProjectId(null);
				}}
				project={selectedProject}
			/>

			<DeleteProjectModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteProject}
				isDeleting={isLoading}
			/>
		</div>
	);
}