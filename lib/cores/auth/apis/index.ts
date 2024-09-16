import { useQueryClient } from "@tanstack/react-query";

import { Fetcher } from "@/lib/helpers/fetcher";

import { client } from "@/server/api/client";

const keys = {
    userId: ["userId"],
} as const;

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
            const { mutation, router } = Fetcher.useHonoMutation($post, {
                onSuccess(data) {
                    router.replace("/home");
                },
                onError(err) {
                    console.log(err);
                },
            });
            return mutation;
        },
        useSignUp() {
            const $post = client.api.auth["sign-up"].$post;
            const { mutation, router, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess({ data, msg, status }) {
                        queryClient.setQueryData(keys.userId, data.userId);
                        router.replace("/otp-verify");
                    },
                    onError(err) {
                        console.log(err);
                    },
                },
            );
            return mutation;
        },
        useSendEmailVerifyCode() {
            const $post = client.api.auth["verify-email"].$post;
            const { mutation, queryClient, router } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess(data) {
                        router.replace("/home");
                    },
                    onError(err) {
                        console.log(err);
                    },
                },
            );
            return mutation;
        },
    },
};
