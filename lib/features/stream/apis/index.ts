import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    stream_token: ["stream_token"],
    stream_information: (username: string) => ["stream_information", username],
    streams: (page: string, size: string) => ["streams", page, size],
    chat_token: ["chat_token"],
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
            );
        },
        useGetDefaultStreams(page = "1", size = "9") {
            const $get = client.api.streams.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.streams(page, size),
                {
                    query: {
                        page,
                        size,
                    },
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
    },
    mutation: {
        useGetStreamToken() {
            const $get = client.api.streams["stream-token"].$get;
            const { mutation, router } = Fetcher.useHonoMutation($get, {
                onError() {
                    router.replace(ROUTES.HOME_PAGE);
                },
            });
            return mutation;
        },
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
    },
};
