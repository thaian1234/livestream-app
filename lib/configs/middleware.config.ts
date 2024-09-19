import { ROUTES } from "./routes.config";

export const middlewareRoutes = {
    publicRoutes: new Set([
        ROUTES.SIGNIN_PAGE,
        ROUTES.SIGNUP_PAGE,
        ROUTES.OTP_VERIFY_PAGE,
        ROUTES.HOME_PAGE,
    ]),
    DEFAULT_SIGNIN_REDIRECT: ROUTES.SIGNIN_PAGE,
};
