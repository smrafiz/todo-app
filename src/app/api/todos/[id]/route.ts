import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const todo = await prisma.todo.findUnique({
			where: { id: params.id },
		});

		if (!todo) {
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
		}

		return NextResponse.json(todo);
	} catch (error) {
		console.error('GET /api/todos/[id] error:', error);
		return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await req.json();
		const { title, description, dueDate, tags, completed, projectId } = body;

		const data: Prisma.TodoUpdateInput = {};

		if (title !== undefined) data.title = title;
		if (description !== undefined) data.description = description;
		if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
		if (tags !== undefined) data.tags = Array.isArray(tags) ? tags.join(',') : tags;
		if (completed !== undefined) data.completed = completed;

		if (projectId !== undefined) {
			data.project = projectId
				? { connect: { id: projectId } }
				: { disconnect: true };
		}

		const updated = await prisma.todo.update({
			where: { id: params.id },
			data,
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error('PUT /api/todos/[id] error:', error);
		return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.todo.delete({
			where: { id: params.id },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('DELETE /api/todos/[id] error:', error);
		return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
	}
}