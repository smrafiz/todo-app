export type Project = {
	id: string;
	name :string;
	description?: string;
	color:      string;
	userId:      string;
	createdAt:string;
	updatedAt:string;
};

export type ActionResponse = {
	data?: object;
	status: boolean;
	message?: string;
	error?: string;
};

export type ActionListResponse = {
	data?: {
		items: object[];
		pagination: {
			page: number;
			pageSize: number;
			total: number;
		};
	};
	status: boolean;
	message?: string;
	error?: string;
};