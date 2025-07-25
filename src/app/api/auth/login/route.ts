import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

type LoginBody = {
    email: string;
    password: string;
};

export async function POST(req: NextRequest): Promise<Response> {
    try {
        const body: LoginBody = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return Response.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return Response.json({ error: "Invalid password" }, { status: 401 });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        const { password: _, ...safeUser } = user;
        return Response.json({ message: "Login successful", user: safeUser });
    } catch (err) {
        console.error("Login error:", err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
