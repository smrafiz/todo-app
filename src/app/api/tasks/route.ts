import {prisma} from '@/lib/prisma';
import {NextRequest, NextResponse} from 'next/server';

export async function GET() {
	try {
		const todos = await prisma.todo.findMany({
			orderBy: {dueDate: 'asc'},
		});
		return NextResponse.json(todos);
	} catch (error) {
		console.error('GET /api/tasks error:', error);
		return NextResponse.json({error: 'Failed to fetch todos'}, {status: 500});
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {title, description, dueDate, tags, completed, userId, projectId} = body;

		if (!title || !userId) {
			return NextResponse.json({error: 'Missing title or userId'}, {status: 400});
		}

		const todo = await prisma.todo.create({
			data: {
				title,
				description: description ?? null,
				dueDate: dueDate ? new Date(dueDate) : null,
				tags: tags ?? null,
				completed: completed ?? false,
				userId,
				projectId: projectId ?? null,
			},
		});

		return NextResponse.json(todo, {status: 201});
	} catch (error) {
		console.error('POST /api/tasks error:', error);
		return NextResponse.json({error: 'Failed to create todo'}, {status: 500});
	}
}