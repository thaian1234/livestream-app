import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    stream_token: ["stream_token"],
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
    },
};
