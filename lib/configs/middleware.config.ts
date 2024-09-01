export const middlewareRoutes = {
    publicRoutes: new Set(["/", "/sign-in", "/sign-up"]),
    apiRoutes: ["/auth/sign-in", "/auth/sign-up"],
    apiAuthPrefix: "/api/auth",
    DEFAULT_SIGNIN_REDIRECT: "/sign-in",
};
