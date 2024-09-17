import { useQueryClient } from "@tanstack/react-query";

import { Fetcher } from "@/lib/helpers/fetcher";

import { client } from "@/server/api/client";

const keys = {
    userId: ["userId"],
};

export const authApi = {
    query: {
        useGetUserId() {
            const queryClient = useQueryClient();
            const userId = queryClient.getQueryData(keys.userId) as string;
            return userId;
        },
    },
    mutation: {
        useSignIn() {
            const $post = client.api.auth["sign-in"].$post;
            const { mutation, router, toast } = Fetcher.useHonoMutation($post, {
                onSuccess({ msg }) {
                    router.replace("/home");
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
                        router.replace("/otp-verify");
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
            const { mutation, toast, router } = Fetcher.useHonoMutation($post, {
                onSuccess({ msg }) {
                    router.replace("/home");
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
                onSuccess({ data, msg }) {
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
