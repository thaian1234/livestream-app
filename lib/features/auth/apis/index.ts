import { useQueryClient } from "@tanstack/react-query";

import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { AuthRouteType } from "@/server/api/routes/auth.routes";
import { UserRouteType } from "@/server/api/routes/user.routes";

const baseApi = baseClient<AuthRouteType>().auth;
const userClient = baseClient<UserRouteType>().users;

const keys = {
    userId: ["userId"],
    session: ["session"],
};

export const authApi = {
    query: {
        useGetUserId() {
            const queryClient = useQueryClient();
            const userId = queryClient.getQueryData(keys.userId) as string;
            return userId;
        },
        useVerifySession() {
            const $get = baseApi["verify-session"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.session,
                {},
                {
                    refetchOnWindowFocus: false,
                    retry: 0,
                },
            );
        },
        useSuspenseVerifySession() {
            const $get = baseApi["verify-session"].$get;
            return Fetcher.useHonoSuspenseQuery(
                $get,
                keys.session,
                {},
                {
                    refetchOnWindowFocus: false,
                    retry: 0,
                },
            );
        },
    },
    mutation: {
        useSignIn() {
            const $post = baseApi["sign-in"].$post;
            const { mutation, router, toast, queryClient } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg }) {
                        queryClient.invalidateQueries();
                        router.replace(ROUTES.HOME_PAGE);
                        toast.success(msg);
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useSignUp() {
            const $post = baseApi["sign-up"].$post;
            const { mutation, router, queryClient, toast } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ data, msg }) {
                        queryClient.setQueryData(keys.userId, data.userId);
                        router.replace(ROUTES.OTP_VERIFY_PAGE);
                        toast.success(msg);
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useSendEmailVerifyCode() {
            const $post = baseApi["verify-email"].$post;
            const { mutation, toast, router, queryClient } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg }) {
                        router.replace(ROUTES.HOME_PAGE);
                        queryClient.invalidateQueries();
                        toast.success(msg);
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useSignInGoogle() {
            const $get = baseApi.oauth.google.$get;
            const { mutation, toast } = Fetcher.useHonoMutation($get, {
                onSuccess({ data }) {
                    console.log("Debug ", data.redirectTo);
                    window.location.href = data.redirectTo;
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
        useSignOut() {
            const $post = baseApi["sign-out"].$post;
            const { mutation, toast, queryClient, router } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg }) {
                        toast.success(msg);
                        router.replace(ROUTES.SIGNIN_PAGE);
                        queryClient.clear();
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useSignInGithub() {
            const $get = baseApi.oauth.github.$get;
            const { mutation, toast } = Fetcher.useHonoMutation($get, {
                onSuccess({ data }) {
                    window.location.href = data.redirectTo;
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
        useSetUsername() {
            const $patch = userClient.$patch;
            const { mutation, toast, queryClient, router } =
                Fetcher.useHonoMutation($patch, {
                    onSuccess() {
                        toast.success("Set username successfully");
                        queryClient.invalidateQueries({
                            queryKey: keys.session,
                        });
                        router.replace(ROUTES.HOME_PAGE);
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useSendForgetPasswordLink() {
            const $post = baseApi["reset-password"].$post;
            const { mutation, toast } = Fetcher.useHonoMutation($post, {
                onSuccess(data) {
                    toast.success(data.msg);
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
        useResetPassword() {
            const $post = baseApi["reset-password"][":token"].$post;
            const { mutation, toast, router } = Fetcher.useHonoMutation($post, {
                onSuccess(data) {
                    toast.success(data.msg);
                    router.replace(ROUTES.SIGNIN_PAGE);
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
    },
};
