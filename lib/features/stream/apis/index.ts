import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

export const streamApi = {
    query: {},
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
