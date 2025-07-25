import {create} from 'zustand';
import type {Project} from '@prisma/client';
import {ProjectAction, projectReducer, ProjectState} from '@/lib/reducer/projectReducer';

type ProjectStore = ProjectState & {
	dispatch: (action: ProjectAction) => void;
	getUserProjects: (userId: string) => Project[];

	error: string | null;
	isLoading: boolean;
	isLoaded: boolean;
	loadProjects: (userId: string) => Promise<void>;

	addProject: (project: Partial<Project>) => void;
	updateProject: (project: Partial<Project> & { id: string }) => void;
	removeProject: (id: string) => void;
	setProjects: (projects: Project[]) => void;
	clearProjects: () => void;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
	projects: [],
	isLoading: false,
	isLoaded: false,
	error: null,

	dispatch: (action) => {
		set((state) => projectReducer(state, action));
	},

	getUserProjects: (userId) => get().projects.filter(project => project.userId === userId),

	loadProjects: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const res = await fetch(`/api/projects?userId=${userId}`);

			if (!res.ok) {
				throw new Error("Failed to fetch projects")
			}

			const data: Project[] = await res.json();
			const projects: Project[] = data.map(project => ({
				...project,
				createdAt: new Date(project.createdAt),
				updatedAt: new Date(project.updatedAt),
			}));

			get().dispatch({ type: "SET_PROJECTS", payload: projects });
			set({ isLoaded: true });
		} catch (error: any) {
			console.error("Failed to load projects:", error);
			set({ isLoaded: false, error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	addProject: async (projectData: Partial<Project>) => {
		try {
			const payload = {
				...projectData,
				description: projectData.description?.trim() === '' ? null : projectData.description,
			};

			const res = await fetch("/api/projects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				throw new Error("Failed to create project");
			}

			const createdProject: Project = await res.json();
			get().dispatch({ type: "ADD_PROJECT", payload: createdProject });
		} catch (error) {
			console.error("Failed to add project", error);
		}
	},

	updateProject: async (project) => {
		try {
			await fetch(`/api/projects/${project.id}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(project),
			});
			get().dispatch({type: "UPDATE_PROJECT", payload: project});
		} catch (error) {
			console.error("Failed to update project", error);
		}
	},

	removeProject: async (id) => {
		try {
			await fetch(`/api/projects/${id}`, {
				method: "DELETE",
			});
			get().dispatch({type: "REMOVE_PROJECT", payload: id});
		} catch (error) {
			console.error("Failed to delete project:", error);
		}
	},

	setProjects: (projects) => get().dispatch({type: 'SET_PROJECTS', payload: projects}),

	clearProjects: () => get().dispatch({type: 'CLEAR_PROJECTS'}),
}));