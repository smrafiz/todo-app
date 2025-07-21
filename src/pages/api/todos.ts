import {prisma} from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const todos = await prisma.todo.findMany({orderBy: {datetime: 'asc'}});

		return res.status(200).json(todos);
	}

	if (req.method === 'POST') {
		const {title, datetime} = req.body;

		if (!title || !datetime) {
			return res.status(400).json({error: 'Missing data'});
		}

		const todo = await prisma.todo.create({
			data: {
				title,
				datetime: new Date(datetime),
			},
		});

		return res.status(201).json(todo);
	}

	if (req.method === 'PUT') {
		const {id, is_done, title, datetime} = req.body;

		if (!id) {
			return res.status(400).json({error: 'Missing ID'});
		}

		const data: Partial<Prisma.TodoUpdateInput> = {};

		if (typeof is_done !== 'undefined') {
			data.is_done = !!is_done;
		}

		if (title) {
			data.title = title;
		}

		if (datetime) {
			data.datetime = new Date(datetime);
		}

		const updated = await prisma.todo.update({
			where: {id},
			data,
		});

		return res.status(200).json(updated);
	}

	if (req.method === 'DELETE') {
		const {id} = req.body;

		if (!id) {
			return res.status(400).json({error: 'Missing ID'});
		}

		await prisma.todo.delete({where: {id}});

		return res.status(204).end();
	}

	return res.status(405).json({error: 'Method not allowed'});
}
