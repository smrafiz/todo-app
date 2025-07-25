"use server";

import {prisma} from '@/lib/prisma';
import {ActionListResponse} from "@/types";

export async function getTasksByProjectId(id: string) {
	try {
		const tasks = await prisma.todo.findMany({
			where: {projectId: id},
			include: {
				user: true,
			}
		});

		const data = {
			items: tasks,
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		console.log({error})
		const response: ActionListResponse = {
			status: false,
			error: 'Server Error'
		}

		return response
	}

}