'use server';

import {prisma} from '@/lib/prisma';
import {ActionListResponse} from "@/types";

export async function getProjects() {
	const projects = await prisma.project.findMany();

	const data = {
		items: projects,
		pagination: {
			page: 3,
			pageSize: 10,
			total: 20
		}
	}
	const response: ActionListResponse = {
		data: data,
		status: true
	}

	return response;
}