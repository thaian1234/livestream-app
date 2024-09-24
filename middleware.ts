import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { middlewareRoutes } from "./lib/configs/middleware.config";
import { ROUTES } from "./lib/configs/routes.config";

async function verifySession(origin: string) {
    const response = await fetch(`${origin}/api/auth/verify-session`, {
        headers: {
            Cookie: cookies().toString(),
        },
    });
    return response.ok;
}

export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const sessionId = request.cookies.get("auth_session");
    const isPublicRoutes = middlewareRoutes.publicRoutes.has(pathname);
    const isDefaultPage = middlewareRoutes.DEFAULT_PAGE.startsWith(pathname);

    if (isDefaultPage) {
        return NextResponse.next();
    }
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
    if (isPublicRoutes && isValidSession) {
        return NextResponse.redirect(new URL(ROUTES.HOME_PAGE, request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|api|trpc|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2)).*)",
    ],
};
