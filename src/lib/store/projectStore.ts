import {create} from 'zustand';
import type {Project} from '@prisma/client';
import {ProjectAction, projectReducer, ProjectState} from '@/lib/reducer/projectReducer';

type ProjectStore = ProjectState & {
	dispatch: (action: ProjectAction) => void;
	getUserProjects: (userId: string) => Project[];

	addProject: (project: Project) => void;
	updateProject: (project: Project) => void;
	removeProject: (id: string) => void;
	setProjects: (projects: Project[]) => void;
	clearProjects: () => void;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
	projects: [],

	dispatch: (action) => {
		set((state) => projectReducer(state, action));
	},

	getUserProjects: (userId) => {
		return get().projects.filter(project => project.userId === userId);
	},

	addProject: (project) => get().dispatch({type: 'ADD_PROJECT', payload: project}),

	updateProject: (project) => get().dispatch({type: 'UPDATE_PROJECT', payload: project}),

	removeProject: (id) => get().dispatch({type: 'REMOVE_PROJECT', payload: id}),

	setProjects: (projects) => get().dispatch({type: 'SET_PROJECTS', payload: projects}),

	clearProjects: () => get().dispatch({type: 'CLEAR_PROJECTS'}),
}));