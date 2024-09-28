export const ROUTES = {
    HOME_PAGE: "/",
    SIGNIN_PAGE: "/sign-in",
    SIGNUP_PAGE: "/sign-up",
    OTP_VERIFY_PAGE: "/otp-verify",
    PROFILE_PAGE: (username: string) => `/dashboard/${username}/profile`,
    ACCOUNT_PAGE: (username: string) => `/dashboard/${username}/account`,
};
