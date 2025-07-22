import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

type RegisterBody = {
	name: string;
	email: string;
	password: string;
};

export async function POST(req: Request): Promise<Response> {
	try {
		const { name, email, password }: RegisterBody = await req.json();

		const existing = await prisma.user.findUnique({ where: { email } });

		if (existing) {
			return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
		}

		const hashed = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				id: nanoid(),
				name,
				email,
				password: hashed,
			},
		});

		return new Response(
			JSON.stringify({
				message: "Registered successfully",
				user: { id: user.id, name: user.name, email: user.email },
			}),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Registration error:", error);

		return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
	}
}