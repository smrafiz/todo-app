import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { _, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
    } catch (err) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}
