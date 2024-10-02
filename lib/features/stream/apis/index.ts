import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    stream: ["stream"],
    call: ["call"],
    myStream: ["my-stream"],
};

export const streamApi = {
    query: {
        useGetGeneratedToken() {
            const $get = client.api.streams["generate-token"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.stream,
                {},
                {
                    retry: 1,
                },
            );
        },
        useGetLivestreamRoom() {
            const $get = client.api.streams.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.call,
                {},
                {
                    retry: 1,
                },
            );
        },
        useGetMyStream() {
            const $get = client.api.streams["my-stream"].$get;
            return Fetcher.useHonoQuery($get, keys.myStream, {}, {});
        },
    },
    mutation: {
        useCreateStreamRoom() {
            const $post = client.api.streams.$post;
            const { mutation } = Fetcher.useHonoMutation($post, {});
            return mutation;
        },
        useGenerateUserToken() {
            const $post = client.api.streams["generate-token"].$post;
            const { mutation } = Fetcher.useHonoMutation($post, {});
            return mutation;
        },
    },
};
