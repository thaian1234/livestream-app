import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { middlewareRoutes } from "./lib/configs/middleware.config";
import { ROUTES } from "./lib/configs/routes.config";
import { UserValidation } from "./server/api/lib/validations/schema.validation";

async function verifySession(origin: string) {
    const response = await fetch(`${origin}/api/auth/verify-session`, {
        headers: {
            Cookie: cookies().toString(),
        },
    });
    if (!response.ok) {
        return {
            user: null,
            isValidSession: false,
        };
    }
    const user = (await response.json()) as {
        msg?: string;
        data?: {
            user: UserValidation.Select;
        };
        status: number;
    };
    return {
        user: user.data?.user,
        isValidSession: true,
    };
}

export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const sessionId = request.cookies.get("auth_session");
    const isPublicRoutes = middlewareRoutes.publicRoutes.has(pathname);
    const isDefaultPage = middlewareRoutes.DEFAULT_PAGE.startsWith(pathname);
    const isDashboardPage = pathname.startsWith("/dashboard/");

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
    const { isValidSession, user } = await verifySession(origin);
    if (!isValidSession || !user) {
        return NextResponse.redirect(
            new URL(middlewareRoutes.DEFAULT_SIGNIN_REDIRECT, request.url),
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
