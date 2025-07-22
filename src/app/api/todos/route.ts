import {prisma} from '@/lib/prisma';
import {NextRequest, NextResponse} from 'next/server';
import type {Prisma} from "@prisma/client";

export async function GET() {
	try {
		const todos = await prisma.todo.findMany({
			orderBy: {datetime: 'asc'},
		});

		return NextResponse.json(todos);
	} catch (error) {
		console.error('GET /api/todos error:', error);

		return NextResponse.json(
			{error: 'Failed to fetch todos'},
			{status: 500}
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {title, datetime} = body;

		if (!title || !datetime) {
			return NextResponse.json(
				{error: 'Missing title or datetime'},
				{status: 400}
			);
		}

		const todo = await prisma.todo.create({
			data: {
				title,
				datetime: new Date(datetime),
			},
		});

		return NextResponse.json(todo, {status: 201});
	} catch (error) {
		console.error('POST /api/todos error:', error);

		return NextResponse.json(
			{error: 'Failed to create todo'},
			{status: 500}
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const {id, is_done, title, datetime} = body;

		if (!id) {
			return NextResponse.json({error: 'Missing ID'}, {status: 400});
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

		return NextResponse.json(updated);
	} catch (error) {
		console.error('PUT /api/todos error:', error);

		return NextResponse.json(
			{ error: 'Failed to update todo' },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const { id } = body;

		if (!id) {
			return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
		}

		await prisma.todo.delete({
			where: { id },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('DELETE /api/todos error:', error);

		return NextResponse.json(
			{ error: 'Failed to delete todo' },
			{ status: 500 }
		);
	}
}