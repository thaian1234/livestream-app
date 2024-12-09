import { keepPreviousData } from "@tanstack/react-query";

import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";
import { PaginationType } from "@/lib/types";

type DefaultQueries = {
    recommendPage?: string | string[] | undefined;
    recommendSize?: string | string[] | undefined;
    followPage?: string | string[] | undefined;
    followSize?: string | string[] | undefined;
};

const keys = {
    stream_token: ["stream_token"],
    stream_information: (username: string) => ["stream_information", username],
    streams: (queries: DefaultQueries) => ["streams", queries] as string[],
    chat_token: ["chat_token"],
    recommend_streams: (pagination: PaginationType) =>
        ["recommend_streams", pagination] as string[],
    following_streams: (pagination: PaginationType) =>
        ["following_streams", pagination] as string[],
    stream_categories: (streamId?: string) =>
        ["stream_categories", streamId] as string[],
};

export const streamApi = {
    query: {
        useGetStreamToken() {
            const $get = client.api.streams["stream-token"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.stream_token,
                {},
                {
                    retry: 1,
                },
            );
        },
        useGetStreamInformation(username: string) {
            const $get = client.api.users[":username"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.stream_information(username),
                {
                    param: {
                        username,
                    },
                },
                {
                    retry: 0,
                },
            );
        },
        useGetDefaultStreams(queries: DefaultQueries) {
            const $get = client.api.streams.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.streams(queries),
                {
                    query: queries,
                },
                {
                    retry: 1,
                },
            );
        },
        useGetChatToken() {
            const $get = client.api.streams["chat-token"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.chat_token,
                {},
                {
                    retry: 1,
                },
            );
        },
        useGetRecommendStreams(pagination: PaginationType) {
            const $get = client.api.streams.recommend.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.recommend_streams(pagination),
                {
                    query: pagination,
                },
                {
                    retry: 1,
                    placeholderData: keepPreviousData,
                },
            );
        },
        useGetFollowingStreams(pagination: PaginationType) {
            const $get = client.api.streams.following.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.following_streams(pagination),
                {
                    query: pagination,
                },
                {
                    retry: 1,
                    placeholderData: keepPreviousData,
                },
            );
        },
        useGetStreamCategories(streamId?: string) {
            const $get = client.api.streams.categories.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.stream_categories(streamId),
                {
                    query: {
                        id: streamId,
                    },
                },
                {},
            );
        },
    },
    mutation: {
        useUpdateStream(username: string) {
            const $patch = client.api.streams.$patch;
            const { mutation, queryClient, toast } = Fetcher.useHonoMutation(
                $patch,
                {
                    onError(err) {
                        toast.error(err.message);
                    },
                    onSuccess() {
                        queryClient.invalidateQueries({
                            queryKey: keys.stream_information(username),
                        });
                    },
                },
            );
            return mutation;
        },
        useAddCategoriesToStream() {
            const $post = client.api.streams["add-categories"].$post;
            const { mutation, queryClient, toast } = Fetcher.useHonoMutation(
                $post,
                {
                    onError(err) {
                        console.error(err);
                    },
                    onSuccess({}, { json }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.stream_categories(json.streamId),
                        });
                        toast.success(
                            "Successfully added categories to stream",
                        );
                    },
                },
            );
            return mutation;
        },
    },
};
