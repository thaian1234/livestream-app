import { ROUTES } from "./routes.config";

export const middlewareRoutes = {
    publicRoutes: new Set([
        ROUTES.DEFAULT_PAGE,
        ROUTES.SIGNIN_PAGE,
        ROUTES.SIGNUP_PAGE,
    ]),
    DEFAULT_SIGNIN_REDIRECT: ROUTES.SIGNIN_PAGE,
};
