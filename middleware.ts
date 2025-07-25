import {getAuthUser} from "@/lib/auth";
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export async function middleware(request: NextRequest) {
    try {
        await getAuthUser();
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/tasks/:path*", "/projects/:path*"],
};
