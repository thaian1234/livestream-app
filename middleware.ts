import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { middlewareRoutes } from "./lib/configs/middleware.config";
import { ROUTES } from "./lib/configs/routes.config";
import { clientCookie } from "./lib/shared/client";

async function verifySession() {
    const $get = clientCookie(cookies().toString()).api.auth["verify-session"]
        .$get;
    const resp = await $get();
    if (!resp.ok) {
        return {
            user: null,
            isValidSession: false,
        };
    }
    const data = await resp.json();
    return {
        user: data.data.user,
        isValidSession: true,
    };
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionId = request.cookies.get("auth_session");
    const isPublicRoutes = middlewareRoutes.publicRoutes.has(pathname);
    const isDefaultPage = middlewareRoutes.DEFAULT_PAGE.startsWith(pathname);
    const isDashboardPage = pathname.startsWith("/dashboard/");
    const isResetPassword = pathname.startsWith("/reset-password")
    if (isDefaultPage) {
        return NextResponse.next();
    }
    if (isResetPassword) {
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
    const { isValidSession, user } = await verifySession();

    if (!isValidSession || !user) {
        return isPublicRoutes
            ? NextResponse.next()
            : NextResponse.redirect(
                  new URL(
                      middlewareRoutes.DEFAULT_SIGNIN_REDIRECT,
                      request.url,
                  ),
              );
    }

    if (isPublicRoutes) {
        return NextResponse.redirect(new URL(ROUTES.HOME_PAGE, request.url));
    }
    if (isDashboardPage) {
        const urlUsername = pathname.split("/")[2].trim();
        if (urlUsername !== user.username) {
            return NextResponse.redirect(
                new URL(ROUTES.HOME_PAGE, request.url),
            );
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|api|trpc|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2)).*)",
        "/dashboard/:username*",
    ],
};
