import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { middlewareRoutes } from "./lib/configs/middleware.config";

export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const sessionId = request.cookies.get("auth_session");
    const isPublicRoute = middlewareRoutes.publicRoutes.includes(pathname);

    if (isPublicRoute) {
        return NextResponse.next();
    }
    if (!isPublicRoute && !sessionId) {
        return NextResponse.redirect(
            new URL(middlewareRoutes.DEFAULT_SIGNIN_REDIRECT, request.url),
        );
    }
    if (!isPublicRoute && sessionId) {
        const verifySessionResponse = await fetch(
            `${origin}/api/auth/verify-session`,
            {
                headers: {
                    Cookie: `auth_session=${sessionId.value}`,
                },
            },
        );
        if (!verifySessionResponse.ok) {
            return NextResponse.redirect(
                new URL(middlewareRoutes.DEFAULT_SIGNIN_REDIRECT, request.url),
            );
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|api|trpc|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2)).*)",
    ],
};
