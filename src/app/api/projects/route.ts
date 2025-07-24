import {nanoid} from "nanoid";
import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export async function GET() {
	try {
		const projects = await prisma.project.findMany({
			orderBy: { createdAt: 'asc' },
		});
		return NextResponse.json(projects);
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, description, color, userId } = body;

		if (!name || !color || !userId) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const now = new Date();
		const newProject = await prisma.project.create({
			data: {
				id: nanoid(),
				name,
				description: description || '',
				color,
				userId,
				createdAt: now,
				updatedAt: now,
			},
		});

		return NextResponse.json(newProject, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
	}
}