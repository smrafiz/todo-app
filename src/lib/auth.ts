import jwt from "jsonwebtoken";
import {cookies} from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        throw new Error("No token");
    }

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        throw new Error("Invalid or expired token");
    }
}
