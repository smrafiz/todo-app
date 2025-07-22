import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

type LoginBody = {
	email: string;
	password: string;
};

export async function POST(req: Request): Promise<Response> {
	try {
		const body: LoginBody = await req.json();
		const { email, password } = body;

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return Response.json({ error: "User not found" }, { status: 404 });
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			return Response.json({ error: "Invalid password" }, { status: 401 });
		}

		const { password: _, ...safeUser } = user;

		return Response.json({ message: "Login successful", user: safeUser });
	} catch (err) {
		console.error("Login error:", err);

		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}