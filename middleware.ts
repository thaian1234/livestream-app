import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { middlewareRoutes } from "./lib/configs/middleware.config";

async function verifySession(origin: string) {
    const response = await fetch(
        `http://localhost:4000/api/auth/verify-session`,
        {
            headers: {
                Cookie: cookies().toString(),
            },
        },
    );
    return response.ok;
}

export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const sessionId = request.cookies.get("auth_session");
    const isPublicRoutes = middlewareRoutes.publicRoutes.has(pathname);

    if (!sessionId) {
        return isPublicRoutes
            ? NextResponse.next()
            : NextResponse.redirect(
                  new URL(
                      middlewareRoutes.DEFAULT_SIGNIN_REDIRECT,
                      request.url,
                  ),
              );
    }
    const isValidSession = await verifySession(origin);
    if (!isValidSession) {
        return NextResponse.redirect(
            new URL(middlewareRoutes.DEFAULT_SIGNIN_REDIRECT, request.url),
        );
    }
    if (isPublicRoutes) {
        return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|api|trpc|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2)).*)",
    ],
};
