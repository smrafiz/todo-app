import type {Project} from '@prisma/client';

export type ProjectState = {
	projects: Project[];
};

export type ProjectAction =
	| { type: 'ADD_PROJECT'; payload: Project }
	| { type: 'UPDATE_PROJECT'; payload: Project }
	| { type: 'REMOVE_PROJECT'; payload: string }
	| { type: 'SET_PROJECTS'; payload: Project[] }
	| { type: 'CLEAR_PROJECTS' };

export function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
	switch (action.type) {
		case 'ADD_PROJECT':
			return {...state, projects: [...state.projects, action.payload]};
		case 'UPDATE_PROJECT':
			return {
				...state,
				projects: state.projects.map(p =>
					p.id === action.payload.id ? {...p, ...action.payload} : p
				),
			};
		case 'REMOVE_PROJECT':
			return {
				...state,
				projects: state.projects.filter(p => p.id !== action.payload),
			};
		case 'SET_PROJECTS':
			return {...state, projects: action.payload};
		case 'CLEAR_PROJECTS':
			return {...state, projects: []};
		default:
			return state;
	}
}