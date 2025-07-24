import {produce} from 'immer';
import type {Project} from '@prisma/client';

export type ProjectState = {
	projects: Project[];
};

export type ProjectAction =
	| { type: 'ADD_PROJECT'; payload: Project }
	| { type: 'UPDATE_PROJECT'; payload: Partial<Project> & { id: string } }
	| { type: 'REMOVE_PROJECT'; payload: string }
	| { type: 'SET_PROJECTS'; payload: Project[] }
	| { type: 'CLEAR_PROJECTS' };

export const projectReducer = produce(
	(draft: ProjectState, action: ProjectAction) => {
		switch (action.type) {
			case 'ADD_PROJECT':
				draft.projects.push(action.payload);
				break;
			case 'UPDATE_PROJECT': {
				const index = draft.projects.findIndex(p => p.id === action.payload.id);
				if (index !== -1) {
					draft.projects[index] = {
						...draft.projects[index],
						...action.payload,
					};
				}
				break;
			}
			case 'REMOVE_PROJECT':
				draft.projects = draft.projects.filter(p => p.id !== action.payload);
				break;
			case 'SET_PROJECTS':
				draft.projects = action.payload;
				break;
			case 'CLEAR_PROJECTS':
				draft.projects = [];
				break;
			default:
				break;
		}
	}
);