export const ROUTES = {
    HOME_PAGE: "/",
    SIGNIN_PAGE: "/sign-in",
    SIGNUP_PAGE: "/sign-up",
    RESET_PASSWORD_PAGE: (token: string) => `/reset-password/${token}`,
    FORGET_PASSWORD_PAGE: "/forget-password",
    OTP_VERIFY_PAGE: "/otp-verify",
    STREAM_PAGE: (username: string) => `/${username}`,
    DASHBOARD_PAGE: (username: string) => `/dashboard/${username}`,
    PROFILE_PAGE: (username: string) => `/dashboard/${username}/profile`,
    ACCOUNT_PAGE: (username: string) => `/dashboard/${username}/account`,
    DASHBOARD_STREAM_PAGE: (username: string) =>
        `/dashboard/${username}/stream`,
    SETTINGS_PAGE: (username: string) => `/dashboard/${username}/settings`,
    SET_USERNAME_PAGE: "/set-username",
    KEY_PAGE: (username: string) => `/dashboard/${username}/key`,
    COMMUNITY_PAGE: (username: string) => `/dashboard/${username}/community`,
    STUDIO_PAGE: (username: string) => `/dashboard/${username}/studio`,
    VIDEO_EDIT_PAGE: (username: string, videoId: string) =>
        `/dashboard/${username}/video/${videoId}`,
    STORAGE_PAGE: (username: string) => `/dashboard/${username}/storage`,
};
