import { useQueryClient } from "@tanstack/react-query";

import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

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
            const $get = client.api.auth["verify-session"].$get;
            return Fetcher.useHonoQuery($get, keys.session, {
                refetchOnWindowFocus: false,
                retry: 1,
            });
        },
    },
    mutation: {
        useSignIn() {
            const $post = client.api.auth["sign-in"].$post;
            const { mutation, router, toast, queryClient } = Fetcher.useHonoMutation($post, {
                onSuccess({ msg }) {
                    queryClient.invalidateQueries({
                        queryKey: keys.session,
                    });
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
            const $post = client.api.auth["sign-up"].$post;
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
            const $post = client.api.auth["verify-email"].$post;
            const { mutation, toast, router, queryClient } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg }) {
                        router.replace(ROUTES.HOME_PAGE);
                        queryClient.invalidateQueries({
                            queryKey: keys.session,
                        });
                        toast.success(msg);
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useSignInGoogle() {
            const $get = client.api.auth.oauth.google.$get;
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
        useSignOut() {
            const $post = client.api.auth["sign-out"].$post;
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
            const $get = client.api.auth.oauth.github.$get;
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
    },
};
