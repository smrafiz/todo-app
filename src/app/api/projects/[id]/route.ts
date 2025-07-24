import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export async function GET(_: Request, {params}: { params: { id: string } }) {
	try {
		const project = await prisma.project.findUnique({
			where: {id: params.id},
		});

		if (!project) return NextResponse.json({error: 'Not found'}, {status: 404});

		return NextResponse.json(project);
	} catch (error) {
		return NextResponse.json({error: 'Failed to fetch project'}, {status: 500});
	}
}

export async function PUT(req: Request, {params}: { params: { id: string } }) {
	try {
		const body = await req.json();
		const {name, description, color} = body;

		const updated = await prisma.project.update({
			where: {id: params.id},
			data: {
				name,
				description: description || null,
				color,
			},
		});

		return NextResponse.json(updated);
	} catch (error) {
		return NextResponse.json({error: 'Failed to update project'}, {status: 500});
	}
}

export async function DELETE(_: Request, {params}: { params: { id: string } }) {
	try {
		await prisma.project.delete({
			where: {id: params.id},
		});
		return NextResponse.json({success: true});
	} catch (error) {
		return NextResponse.json({error: 'Failed to delete project'}, {status: 500});
	}
}